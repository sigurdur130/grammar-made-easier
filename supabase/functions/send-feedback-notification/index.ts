
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackNotificationRequest {
  email: string | null;
  feedback: string;
  screen: string;
  sentence: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, feedback, screen, sentence }: FeedbackNotificationRequest = await req.json();
    const timestamp = new Date().toISOString();

    const emailResponse = await resend.emails.send({
      from: "Icelandic Made Easier <onboarding@resend.dev>",
      to: ["siggi@icelandicmadeeasier.com"],
      subject: "New Feedback Received! 💬",
      html: `
        <h1>New feedback has been submitted</h1>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Screen:</strong> ${screen}</p>
        ${sentence ? `<p><strong>Sentence ID:</strong> ${sentence}</p>` : ''}
        ${email ? `<p><strong>User Email:</strong> ${email}</p>` : '<p><strong>User Email:</strong> Not provided</p>'}
        <h2>Feedback:</h2>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0088cc;">${feedback}</p>
      `,
    });

    console.log("Feedback notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback-notification function:", error);
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
