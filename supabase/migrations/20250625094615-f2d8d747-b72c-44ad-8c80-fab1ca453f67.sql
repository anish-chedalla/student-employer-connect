
-- Add employer_message column to applications table
ALTER TABLE public.applications 
ADD COLUMN employer_message text;
