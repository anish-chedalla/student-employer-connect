import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ResumePreview } from './ResumePreview';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Mail, Check, X, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  applicant_name?: string;
  applicant_email?: string;
  additional_comments?: string;
  job: {
    title: string;
    company: string;
  };
  student: {
    full_name: string;
    email: string;
  };
}

interface ApplicationsProps {
  selectedJobId?: string;
  selectedJobTitle?: string;
  onBackToAllApplications?: () => void;
}

export const Applications = ({ selectedJobId, selectedJobTitle, onBackToAllApplications }: ApplicationsProps) => {
  const { user } = useAuth();
  const { getJobsByEmployer } = useJobs();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pending: true,
    accepted: false,
    rejected: false
  });
  const { toast } = useToast();

  const employerJobs = getJobsByEmployer(user?.id || '');
  const jobIds = selectedJobId ? [selectedJobId] : employerJobs.map(job => job.id);

  useEffect(() => {
    const fetchApplications = async () => {
      if (jobIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Get applications for employer's jobs (or specific job if selectedJobId)
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            id,
            job_id,
            student_id,
            status,
            cover_letter,
            resume_url,
            applied_at,
            applicant_name,
            applicant_email,
            additional_comments
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

  const handleApplicationAction = async (applicationId: string, status: 'accepted' | 'rejected', message: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          employer_message: message 
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application:', error);
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );

      toast({
        title: "Success",
        description: `Application ${status} successfully. Student will be notified via email.`,
      });

    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Error",
        description: "Failed to process application",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedApplication(null);
      setMessage('');
    }
  };

  const downloadResume = async (resumeUrl: string, applicantName: string) => {
    if (!resumeUrl) {
      toast({
        title: "No Resume",
        description: "This applicant hasn't uploaded a resume",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) {
        console.error('Error downloading resume:', error);
        toast({
          title: "Download Failed",
          description: "Could not download the resume file",
          variant: "destructive"
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName.replace(/\s+/g, '_')}_Resume.${resumeUrl.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Resume download has started",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the resume file",
        variant: "destructive"
      });
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
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleSection = (status: string) => {
    setOpenSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const renderApplicationCard = (application: Application) => (
    <Card key={application.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {application.applicant_name || application.student.full_name}
            </h3>
            <p className="text-lg text-gray-700 mb-2">Applied for: {application.job.title}</p>
            <div className="flex items-center text-gray-600 mb-2">
              <Mail className="h-4 w-4 mr-1" />
              <span>{application.applicant_email || application.student.email}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Application Details */}
        <div className="space-y-4">
          {application.cover_letter && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{application.cover_letter}</p>
            </div>
          )}

          {application.additional_comments && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Additional Comments:</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{application.additional_comments}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Resume:</h4>
            {application.resume_url ? (
              <ResumePreview
                resumeUrl={application.resume_url}
                applicantName={application.applicant_name || application.student.full_name}
                onDownload={() => downloadResume(application.resume_url!, application.applicant_name || application.student.full_name)}
              />
            ) : (
              <p className="text-gray-500 text-sm">No resume uploaded</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Applied:</span> {formatDate(application.applied_at)}
          </div>
          
          {application.status === 'pending' && (
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Accept Application</DialogTitle>
                    <DialogDescription>
                      You are about to accept {application.applicant_name || application.student.full_name}'s application for {application.job.title}.
                      Write a message to the applicant:
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Congratulations! We're pleased to inform you that your application has been accepted..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedApplication(null);
                        setMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleApplicationAction(application.id, 'accepted', message)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? 'Processing...' : 'Accept Application'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Decline Application</DialogTitle>
                    <DialogDescription>
                      You are about to decline {application.applicant_name || application.student.full_name}'s application for {application.job.title}.
                      Write a message to the applicant:
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Thank you for your interest in this position. Unfortunately, we have decided to move forward with other candidates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedApplication(null);
                        setMessage('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleApplicationAction(application.id, 'rejected', message)}
                      disabled={isProcessing}
                      variant="destructive"
                    >
                      {isProcessing ? 'Processing...' : 'Decline Application'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        {selectedJobId && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToAllApplications}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Applications</span>
            </Button>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedJobTitle ? `Applications for ${selectedJobTitle}` : 'Applications'}
            </h1>
            <p className="text-gray-600">
              {selectedJobTitle ? 'No applications for this job yet' : 'Applications will appear here once students start applying to your job postings'}
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              {selectedJobTitle ? 'No students have applied to this job yet' : 'Applications will appear here once students start applying to your job postings'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedJobId && (
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToAllApplications}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Applications</span>
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedJobTitle ? `Applications for ${selectedJobTitle}` : 'Applications'}
          </h1>
          <p className="text-gray-600">
            {selectedJobTitle ? `Showing ${applications.length} applications for this job` : 'Review and manage job applications'}
          </p>
        </div>
      </div>

      {/* Pending Applications */}
      <Collapsible open={openSections.pending} onOpenChange={() => toggleSection('pending')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
          <div className="flex items-center space-x-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Pending ({getApplicationsByStatus('pending').length})
            </Badge>
            <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
          </div>
          {openSections.pending ? (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {getApplicationsByStatus('pending').map(renderApplicationCard)}
        </CollapsibleContent>
      </Collapsible>

      {/* Accepted Applications */}
      <Collapsible open={openSections.accepted} onOpenChange={() => toggleSection('accepted')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Accepted ({getApplicationsByStatus('accepted').length})
            </Badge>
            <h2 className="text-xl font-semibold text-gray-900">Accepted Applications</h2>
          </div>
          {openSections.accepted ? (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {getApplicationsByStatus('accepted').map(renderApplicationCard)}
        </CollapsibleContent>
      </Collapsible>

      {/* Rejected Applications */}
      <Collapsible open={openSections.rejected} onOpenChange={() => toggleSection('rejected')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          <div className="flex items-center space-x-3">
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Rejected ({getApplicationsByStatus('rejected').length})
            </Badge>
            <h2 className="text-xl font-semibold text-gray-900">Rejected Applications</h2>
          </div>
          {openSections.rejected ? (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {getApplicationsByStatus('rejected').map(renderApplicationCard)}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
