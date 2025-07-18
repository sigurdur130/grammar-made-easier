
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
      definitenessFilters 
    }: NotificationRequest = await req.json();
    const timestamp = new Date().toISOString();

    // Debug logging
    console.log("Notification request data:", {
      category,
      subcategory,
      caseFilters,
      numberFilters,
      definitenessFilters
    });

    // Format filter information for Cases subcategory
    let filterInfo = '';
    if (subcategory === 'Cases' && caseFilters && numberFilters && definitenessFilters) {
      console.log("Adding filter info to email");
      filterInfo = `
        <h2>Active Filters:</h2>
        <ul>
          <li><strong>Case:</strong> ${caseFilters.join(', ')}</li>
          <li><strong>Number:</strong> ${numberFilters.join(', ')}</li>
          <li><strong>Definiteness:</strong> ${definitenessFilters.join(', ')}</li>
        </ul>
      `;
    } else {
      console.log("Filter info not added. Conditions:", {
        isCorrectSubcategory: subcategory === 'Cases',
        hasCaseFilters: !!caseFilters,
        hasNumberFilters: !!numberFilters,
        hasDefinitenessFilters: !!definitenessFilters
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
