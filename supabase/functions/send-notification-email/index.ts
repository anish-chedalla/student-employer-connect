
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'application_confirmation' | 'status_update';
  data: {
    applicantName: string;
    jobTitle: string;
    hasResume?: boolean;
    status?: string;
    employerMessage?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let htmlContent = '';

    if (type === 'application_confirmation') {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Application Confirmation</h1>
          
          <p>Dear ${data.applicantName},</p>
          
          <p>Thank you for your interest! We have successfully received your application for the position:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${data.jobTitle}</h3>
          </div>
          
          <p><strong>Application Details:</strong></p>
          <ul>
            <li>Submitted: ${new Date().toLocaleDateString()}</li>
            <li>Resume: ${data.hasResume ? 'Attached' : 'Not attached'}</li>
          </ul>
          
          <p>We will review your application and get back to you soon. You will receive an email notification when there are any updates regarding your application status.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>The Hiring Team</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;
    } else if (type === 'status_update') {
      const statusColor = data.status === 'accepted' ? '#10b981' : '#ef4444';
      const statusText = data.status === 'accepted' ? 'Accepted' : 
                        data.status === 'rejected' ? 'Not Selected' : 'Updated';
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: ${statusColor}; margin-bottom: 20px;">Application Update</h1>
          
          <p>Dear ${data.applicantName},</p>
          
          <p>We have an update regarding your application for the position:</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${data.jobTitle}</h3>
            <p style="margin: 10px 0 0 0; color: ${statusColor}; font-weight: bold;">
              Status: ${statusText}
            </p>
          </div>
          
          ${data.employerMessage ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">Message from Employer:</h4>
              <p style="margin: 0; color: #92400e;">${data.employerMessage}</p>
            </div>
          ` : ''}
          
          <p>Thank you for your interest in this position.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>The Hiring Team</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Student-Employer Connect <notifications@resend.dev>",
      to: [to],
      subject: subject,
      html: htmlContent,
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
    console.error("Error in send-notification-email function:", error);
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
