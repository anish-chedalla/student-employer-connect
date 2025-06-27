
-- Add foreign key constraint to applications table to reference jobs table
-- This will ensure applications are deleted when a job is deleted
ALTER TABLE applications 
ADD CONSTRAINT fk_applications_job_id 
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
