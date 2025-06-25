
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Mail } from 'lucide-react';

interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  job: {
    title: string;
    company: string;
  };
  student: {
    full_name: string;
    email: string;
  };
}

export const Applications = () => {
  const { user } = useAuth();
  const { getJobsByEmployer } = useJobs();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const employerJobs = getJobsByEmployer(user?.id || '');
  const jobIds = employerJobs.map(job => job.id);

  useEffect(() => {
    const fetchApplications = async () => {
      if (jobIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // First get applications for employer's jobs
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            job_id,
            student_id,
            status,
            cover_letter,
            resume_url,
            applied_at
          `)
          .in('job_id', jobIds);

        if (applicationsError) {
          console.error('Error fetching applications:', applicationsError);
          return;
        }

        if (!applicationsData || applicationsData.length === 0) {
          setApplications([]);
          setIsLoading(false);
          return;
        }

        // Get unique student IDs
        const studentIds = [...new Set(applicationsData.map(app => app.student_id))];

        // Get student profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', studentIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Get job details
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id, title, company')
          .in('id', jobIds);

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          return;
        }

        // Combine the data
        const transformedData: Application[] = applicationsData.map(app => {
          const profile = profilesData?.find(p => p.id === app.student_id);
          const job = jobsData?.find(j => j.id === app.job_id);

          return {
            ...app,
            status: app.status as 'pending' | 'reviewed' | 'accepted' | 'rejected',
            job: {
              title: job?.title || 'Unknown Job',
              company: job?.company || 'Unknown Company'
            },
            student: {
              full_name: profile?.full_name || 'Unknown Student',
              email: profile?.email || 'Unknown Email'
            }
          };
        });

        setApplications(transformedData);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [jobIds.join(',')]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600">Review applications for your job postings</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              Applications will appear here once students start applying to your job postings
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{application.student.full_name}</h3>
                    <p className="text-lg text-gray-700 mb-2">Applied for: {application.job.title}</p>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{application.student.email}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
                      <span className="capitalize">{application.status}</span>
                    </Badge>
                  </div>
                </div>

                {application.cover_letter && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{application.cover_letter}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Applied:</span> {formatDate(application.applied_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
