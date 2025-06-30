
-- Create a table to store interview information
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  employer_message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Create policy for employers to manage interviews for their job applications
CREATE POLICY "Employers can manage interviews for their applications" 
  ON public.interviews 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM applications a 
      JOIN jobs j ON a.job_id = j.id 
      WHERE a.id = interviews.application_id 
      AND j.employer_id = auth.uid()
    )
  );

-- Create policy for students to view interviews for their applications
CREATE POLICY "Students can view their interviews" 
  ON public.interviews 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM applications a 
      WHERE a.id = interviews.application_id 
      AND a.student_id = auth.uid()
    )
  );

-- Add interview status to applications table
ALTER TABLE public.applications ADD COLUMN interview_status TEXT DEFAULT 'none';
