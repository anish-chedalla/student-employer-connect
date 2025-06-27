import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
  employer_id: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  employer_message?: string;
  // Joined job details
  job_title?: string;
  company_name?: string;
  job_location?: string;
}

interface JobContextType {
  jobs: JobPosting[];
  applications: JobApplication[];
  submitJob: (job: Omit<JobPosting, 'id' | 'status' | 'employer_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateJobStatus: (jobId: string, status: 'approved' | 'rejected' | 'pending') => Promise<boolean>;
  applyToJob: (jobId: string, coverLetter: string) => Promise<boolean>;
  getJobsByEmployer: (employerId: string) => JobPosting[];
  getApprovedJobs: () => JobPosting[];
  getStudentApplications: () => JobApplication[];
  refreshJobs: () => Promise<void>;
  isLoading: boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshJobs = async () => {
    try {
      let query = supabase.from('jobs').select('*');
      
      // Filter based on user role
      if (profile?.role === 'admin') {
        // Admins can see all jobs
      } else if (profile?.role === 'employer') {
        // Employers can see their own jobs and approved jobs
        query = query.or(`employer_id.eq.${user?.id},status.eq.approved`);
      } else {
        // Students can only see approved jobs
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      // Type cast the data to ensure proper types
      const typedJobs = (data || []).map(job => ({
        ...job,
        type: job.type as 'full-time' | 'part-time' | 'internship' | 'contract',
        status: job.status as 'pending' | 'approved' | 'rejected'
      }));

      setJobs(typedJobs);
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshApplications = async () => {
    if (!user) return;

    try {
      // Join applications with jobs to get job details
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            title,
            company,
            location
          )
        `)
        .eq('student_id', user.id);

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }

      // Transform the data to include job details in the application object
      const typedApplications = (data || []).map(app => ({
        ...app,
        status: app.status as 'pending' | 'reviewed' | 'accepted' | 'rejected',
        job_title: app.jobs?.title,
        company_name: app.jobs?.company,
        job_location: app.jobs?.location
      }));

      setApplications(typedApplications);
    } catch (error) {
      console.error('Error refreshing applications:', error);
    }
  };

  useEffect(() => {
    if (profile) {
      refreshJobs();
      if (profile.role === 'student') {
        refreshApplications();
      }
    }
  }, [profile, user]);

  const submitJob = async (jobData: Omit<JobPosting, 'id' | 'status' | 'employer_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.from('jobs').insert([
        {
          ...jobData,
          employer_id: user.id,
        },
      ]);

      if (error) {
        console.error('Error submitting job:', error);
        return false;
      }

      await refreshJobs();
      return true;
    } catch (error) {
      console.error('Error submitting job:', error);
      return false;
    }
  };

  const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status })
        .eq('id', jobId);

      if (error) {
        console.error('Error updating job status:', error);
        return false;
      }

      await refreshJobs();
      return true;
    } catch (error) {
      console.error('Error updating job status:', error);
      return false;
    }
  };

  const applyToJob = async (jobId: string, coverLetter: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if application already exists
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('student_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing application:', checkError);
        return false;
      }

      if (existingApplication) {
        console.log('Application already exists for this job');
        return false;
      }

      const { error } = await supabase.from('applications').insert([
        {
          job_id: jobId,
          student_id: user.id,
          cover_letter: coverLetter,
        },
      ]);

      if (error) {
        console.error('Error applying to job:', error);
        return false;
      }

      await refreshApplications();
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter(job => job.employer_id === employerId);
  };

  const getApprovedJobs = () => {
    return jobs.filter(job => job.status === 'approved');
  };

  const getStudentApplications = () => {
    return applications;
  };

  const value = {
    jobs,
    applications,
    submitJob,
    updateJobStatus,
    applyToJob,
    getJobsByEmployer,
    getApprovedJobs,
    getStudentApplications,
    refreshJobs,
    isLoading,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
