import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Clock, CheckCircle, XCircle, FileText, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MyPostingsProps {
  onViewApplications?: (jobId: string, jobTitle: string) => void;
}

export const MyPostings = ({ onViewApplications }: MyPostingsProps) => {
  const { user } = useAuth();
  const { getJobsByEmployer, refreshJobs } = useJobs();
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const { toast } = useToast();

  const employerJobs = getJobsByEmployer(user?.id || '');

  useEffect(() => {
    const fetchApplicationCounts = async () => {
      if (employerJobs.length === 0) return;

      const jobIds = employerJobs.map(job => job.id);
      
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('job_id')
          .in('job_id', jobIds);

        if (error) {
          console.error('Error fetching application counts:', error);
          return;
        }

        // Count applications per job
        const counts: Record<string, number> = {};
        jobIds.forEach(jobId => {
          counts[jobId] = data?.filter(app => app.job_id === jobId).length || 0;
        });

        setApplicationCounts(counts);
      } catch (error) {
        console.error('Error fetching application counts:', error);
      }
    };

    fetchApplicationCounts();
  }, [employerJobs.length]);

  const handleDeleteJob = async (jobId: string) => {
    setIsDeleting(jobId);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('Error deleting job:', error);
        toast({
          title: "Error",
          description: "Failed to delete job posting",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Job posting deleted successfully",
      });

      // Close the dialog and refresh jobs
      setDialogOpen(null);
      await refreshJobs();
      
      // Also refresh application counts after successful deletion
      setTimeout(() => {
        setApplicationCounts(prev => {
          const updated = { ...prev };
          delete updated[jobId];
          return updated;
        });
      }, 100);
      
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
          <p className="text-gray-600">Manage and track your posted jobs</p>
        </div>
      </div>

      {employerJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
            <p className="text-gray-600">
              Start by creating your first job posting to connect with talented students
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {employerJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <div className={`${getStatusColor(job.status)} flex items-center space-x-1 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pointer-events-none`}>
                      {getStatusIcon(job.status)}
                      <span className="capitalize">{job.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Salary:</span> {job.salary}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {job.location}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span> {job.type}
                  </div>
                  <div>
                    <span className="font-medium">Deadline:</span> {formatDate(job.deadline)}
                  </div>
                </div>

                {/* Applications count and actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Posted:</span> {formatDate(job.created_at)}
                    </div>
                    
                    {job.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewApplications?.(job.id, job.title)}
                        className="flex items-center space-x-2"
                      >
                        <Users className="h-4 w-4" />
                        <span>{applicationCounts[job.id] || 0} Applications</span>
                      </Button>
                    )}
                  </div>

                  <Dialog open={dialogOpen === job.id} onOpenChange={(open) => setDialogOpen(open ? job.id : null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Job Posting</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{job.title}"? This action cannot be undone and will also delete all applications for this job.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(null)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteJob(job.id)}
                          disabled={isDeleting === job.id}
                        >
                          {isDeleting === job.id ? 'Deleting...' : 'Delete Job'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {job.status === 'rejected' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      This posting was not approved. Please contact the administration for more details or revise and resubmit.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
