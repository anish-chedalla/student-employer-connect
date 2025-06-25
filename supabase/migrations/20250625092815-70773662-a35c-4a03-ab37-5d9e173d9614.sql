
-- Create a storage bucket for resumes and documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

-- Create RLS policies for the resumes bucket
CREATE POLICY "Students can upload their own documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employers can view documents for their job applications" 
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

-- Update applications table to store additional applicant information
ALTER TABLE applications 
ADD COLUMN applicant_name TEXT,
ADD COLUMN applicant_email TEXT,
ADD COLUMN additional_comments TEXT;
