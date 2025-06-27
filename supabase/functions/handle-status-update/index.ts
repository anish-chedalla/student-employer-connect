
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WebhookPayload {
  type: 'UPDATE';
  table: string;
  record: any;
  old_record: any;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const payload: WebhookPayload = await req.json();
    
    // Only process application status updates
    if (payload.table !== 'applications' || payload.type !== 'UPDATE') {
      return new Response('OK', { status: 200 });
    }

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    // Check if status actually changed and is not pending
    if (oldRecord.status === newRecord.status || newRecord.status === 'pending') {
      return new Response('OK', { status: 200 });
    }

    // Get job details
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('title, company')
      .eq('id', newRecord.job_id)
      .single();

    if (jobError) {
      console.error('Error fetching job:', jobError);
      return new Response('Error fetching job data', { status: 500 });
    }

    // Prepare email data
    const recipientEmail = newRecord.applicant_email || 
      (await supabase.from('profiles').select('email').eq('id', newRecord.student_id).single()).data?.email;

    if (!recipientEmail) {
      console.error('No recipient email found');
      return new Response('No recipient email', { status: 400 });
    }

    const statusText = newRecord.status === 'accepted' ? 'Accepted' : 
                      newRecord.status === 'rejected' ? 'Not Selected' : 'Updated';
    
    const subject = newRecord.status === 'accepted' 
      ? `Job Application Accepted - ${jobData.title}`
      : `Job Application Update - ${jobData.title}`;

    const statusColor = newRecord.status === 'accepted' ? '#10b981' : '#ef4444';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: ${statusColor}; margin-bottom: 20px;">Application Update</h1>
        
        <p>Dear ${newRecord.applicant_name || 'Applicant'},</p>
        
        <p>We have an update regarding your application for the position:</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #374151;">${jobData.title}</h3>
          <p style="margin: 5px 0 0 0; color: #6b7280;">${jobData.company}</p>
          <p style="margin: 10px 0 0 0; color: ${statusColor}; font-weight: bold;">
            Status: ${statusText}
          </p>
        </div>
        
        ${newRecord.employer_message ? `
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">Message from Employer:</h4>
            <p style="margin: 0; color: #92400e;">${newRecord.employer_message}</p>
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

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Student-Employer Connect <notifications@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Status update email sent:", emailResponse);

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error("Error in handle-status-update function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
};

serve(handler);
