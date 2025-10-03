
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
  filters: {
    caseFilters: string;
    numberFilters: string;
    definitenessFilters: string;
    exemplarFilters: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    console.log("Incoming body:", await req.text());

    const { category, subcategory, filters }: NotificationRequest = await req.json();
    const timestamp = new Date().toISOString();

    const emailResponse = await resend.emails.send({
      from: "Icelandic Made Easier <onboarding@resend.dev>",
      to: ["siggi@icelandicmadeeasier.com"],
      subject: "Category Completed! 🎉",
      html: `
        <h1>A user has completed all available sentences!</h1>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subcategory:</strong> ${subcategory}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Filters:</strong></p>
        <ul>
          <li>Filters raw: ${JSON.stringify(filters)}</li>
          <li>Case: ${filters.caseFilters}</li>
          <li>Number: ${filters.numberFilters}</li>
          <li>Definiteness: ${filters.definitenessFilters}</li>
          <li>Exemplars: ${filters.exemplarFilters}</li>
        </ul>
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
