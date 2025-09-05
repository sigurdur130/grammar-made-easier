
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  category: string;
  subcategory: string;
  caseFilters?: string[];
  numberFilters?: string[];
  definitenessFilters?: string[];
  exemplarFilters?: number[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      category, 
      subcategory, 
      caseFilters, 
      numberFilters, 
      definitenessFilters,
      exemplarFilters 
    }: NotificationRequest = await req.json();
    const timestamp = new Date().toISOString();

    // Debug logging
    console.log("Notification request data:", {
      category,
      subcategory,
      caseFilters,
      numberFilters,
      definitenessFilters,
      exemplarFilters
    });

    // Format filter information for Cases subcategory
    let filterInfo = '';
    if (subcategory === 'Cases' && caseFilters && numberFilters && definitenessFilters && exemplarFilters && exemplarFilters.length > 0) {
      console.log("Adding filter info to email");
      
      // Fetch exemplar names from database
      const { data: exemplars, error } = await supabase
        .from('exemplars')
        .select('id, exemplar')
        .in('id', exemplarFilters);
      
      let exemplarNames = '';
      if (exemplars && !error) {
        exemplarNames = exemplars.map(e => e.exemplar).join(', ');
      } else {
        console.error("Error fetching exemplars:", error);
        exemplarNames = exemplarFilters.join(', '); // fallback to IDs
      }
      
      filterInfo = `
        <h2>Active Filters:</h2>
        <ul>
          <li><strong>Case:</strong> ${caseFilters.join(', ')}</li>
          <li><strong>Number:</strong> ${numberFilters.join(', ')}</li>
          <li><strong>Definiteness:</strong> ${definitenessFilters.join(', ')}</li>
          <li><strong>Exemplars:</strong> ${exemplarNames}</li>
        </ul>
      `;
    } else {
      console.log("Filter info not added. Conditions:", {
        isCorrectSubcategory: subcategory === 'Cases',
        hasCaseFilters: !!caseFilters,
        hasNumberFilters: !!numberFilters,
        hasDefinitenessFilters: !!definitenessFilters,
        hasExemplarFilters: !!exemplarFilters,
        hasExemplarFiltersWithLength: exemplarFilters && exemplarFilters.length > 0
      });
    }

    const emailResponse = await resend.emails.send({
      from: "Icelandic Made Easier <onboarding@resend.dev>",
      to: ["siggi@icelandicmadeeasier.com"],
      subject: "Category Completed! 🎉",
      html: `
        <h1>A user has completed all available sentences!</h1>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subcategory:</strong> ${subcategory}</p>
        ${filterInfo}
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p>Time to add more sentences to the database!</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-category-completed function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
