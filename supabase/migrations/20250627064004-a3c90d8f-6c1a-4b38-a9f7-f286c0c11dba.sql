
-- Create storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the resumes bucket
CREATE POLICY "Students can upload their own resumes" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own resumes" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employers can view resumes for their job applications" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE j.employer_id = auth.uid() 
    AND a.resume_url = storage.objects.name
  )
);

-- Add email notification preferences to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'application_confirmation', 'status_update'
  application_id UUID REFERENCES applications(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'sent' -- 'sent', 'failed'
);

-- Enable RLS on email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own email logs
CREATE POLICY "Users can view their own email logs"
ON email_logs FOR SELECT
USING (
  recipient_email = (
    SELECT email FROM profiles WHERE id = auth.uid()
  )
);

-- Create function to trigger email notifications on application status changes
CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if status actually changed and is not pending
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status != 'pending' THEN
    -- Insert into email_logs to track the notification
    INSERT INTO email_logs (
      recipient_email,
      subject,
      email_type,
      application_id
    ) VALUES (
      COALESCE(NEW.applicant_email, (SELECT email FROM profiles WHERE id = NEW.student_id)),
      CASE 
        WHEN NEW.status = 'accepted' THEN 'Job Application Accepted'
        WHEN NEW.status = 'rejected' THEN 'Job Application Update'
        ELSE 'Job Application Status Update'
      END,
      'status_update',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application status changes
DROP TRIGGER IF EXISTS application_status_change_trigger ON applications;
CREATE TRIGGER application_status_change_trigger
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_status_change();
