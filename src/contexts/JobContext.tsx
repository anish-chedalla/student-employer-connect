
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  company: string;
  pay: string;
  deadline: string;
  contactEmail: string;
  contactPhone?: string;
  location: string;
  requirements: string[];
  benefits: string[];
  employerId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  applications: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  message: string;
  resumeUrl?: string;
  appliedAt: string;
}

interface JobContextType {
  jobs: JobPosting[];
  applications: JobApplication[];
  submitJob: (job: Omit<JobPosting, 'id' | 'status' | 'createdAt' | 'applications'>) => Promise<boolean>;
  updateJobStatus: (jobId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  applyToJob: (application: Omit<JobApplication, 'id' | 'appliedAt'>) => Promise<boolean>;
  getJobsByEmployer: (employerId: string) => JobPosting[];
  getApprovedJobs: () => JobPosting[];
  deleteJob: (jobId: string) => Promise<boolean>;
  getAnalytics: () => { total: number; approved: number; pending: number; rejected: number };
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock job data - TODO: Replace with real backend
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    description: 'Join our development team as a software engineering intern. Work on real projects and gain valuable experience in web development, mobile apps, and cloud technologies.',
    company: 'TechCorp Solutions',
    pay: '$18-22/hour',
    deadline: '2024-08-15',
    contactEmail: 'hr@techcorp.com',
    contactPhone: '(555) 123-4567',
    location: 'Remote/Hybrid',
    requirements: ['Currently enrolled in CS/IT program', 'Basic knowledge of JavaScript/Python', 'Strong problem-solving skills'],
    benefits: ['Flexible hours', 'Mentorship program', 'Tech stipend'],
    employerId: '3',
    status: 'approved',
    createdAt: '2024-06-01',
    applications: []
  },
  {
    id: '2',
    title: 'Marketing Assistant',
    description: 'Support our marketing team with social media management, content creation, and campaign analysis. Perfect for students interested in digital marketing.',
    company: 'Creative Marketing Agency',
    pay: '$15-18/hour',
    deadline: '2024-07-30',
    contactEmail: 'jobs@creativeagency.com',
    location: 'Downtown Office',
    requirements: ['Strong communication skills', 'Social media savvy', 'Creative mindset'],
    benefits: ['Creative environment', 'Portfolio building', 'Team events'],
    employerId: '3',
    status: 'approved',
    createdAt: '2024-06-05',
    applications: []
  },
  {
    id: '3',
    title: 'Data Entry Clerk',
    description: 'Part-time position for detail-oriented student to help with data entry and administrative tasks.',
    company: 'Local Business Solutions',
    pay: '$14/hour',
    deadline: '2024-08-01',
    contactEmail: 'admin@localbiz.com',
    location: 'On-site',
    requirements: ['Attention to detail', 'Basic computer skills', 'Reliable schedule'],
    benefits: ['Flexible scheduling', 'Experience certificate'],
    employerId: '3',
    status: 'pending',
    createdAt: '2024-06-10',
    applications: []
  }
];

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const submitJob = async (jobData: Omit<JobPosting, 'id' | 'status' | 'createdAt' | 'applications'>): Promise<boolean> => {
    // TODO: Replace with real API call
    try {
      const newJob: JobPosting = {
        ...jobData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        applications: []
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      return true;
    } catch (error) {
      console.error('Error submitting job:', error);
      return false;
    }
  };

  const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    // TODO: Replace with real API call
    try {
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status } : job
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating job status:', error);
      return false;
    }
  };

  const applyToJob = async (applicationData: Omit<JobApplication, 'id' | 'appliedAt'>): Promise<boolean> => {
    // TODO: Replace with real API call
    try {
      const newApplication: JobApplication = {
        ...applicationData,
        id: Date.now().toString(),
        appliedAt: new Date().toISOString()
      };
      
      setApplications(prevApps => [...prevApps, newApplication]);
      
      // Add application to job
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === applicationData.jobId 
            ? { ...job, applications: [...job.applications, newApplication] }
            : job
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      return false;
    }
  };

  const deleteJob = async (jobId: string): Promise<boolean> => {
    // TODO: Replace with real API call
    try {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  };

  const getJobsByEmployer = (employerId: string) => {
    return jobs.filter(job => job.employerId === employerId);
  };

  const getApprovedJobs = () => {
    return jobs.filter(job => job.status === 'approved');
  };

  const getAnalytics = () => {
    return {
      total: jobs.length,
      approved: jobs.filter(job => job.status === 'approved').length,
      pending: jobs.filter(job => job.status === 'pending').length,
      rejected: jobs.filter(job => job.status === 'rejected').length
    };
  };

  const value = {
    jobs,
    applications,
    submitJob,
    updateJobStatus,
    applyToJob,
    getJobsByEmployer,
    getApprovedJobs,
    deleteJob,
    getAnalytics
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
