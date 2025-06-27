
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  X, 
  MessageSquare, 
  Eye,
  Download,
  FileText,
  Calendar,
  User,
  Mail,
  AlertCircle
} from 'lucide-react';

interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  employer_message?: string;
  student_name?: string;
  student_email?: string;
  job_title?: string;
}

export const Applications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [employerMessage, setEmployerMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewResumeUrl, setPreviewResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      // First get all jobs by this employer
      const { data: employerJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id);

      if (jobsError) {
        console.error('Error fetching employer jobs:', jobsError);
        return;
      }

      if (!employerJobs || employerJobs.length === 0) {
        setApplications([]);
        setIsLoading(false);
        return;
      }

      const jobIds = employerJobs.map(job => job.id);

      // Then get applications for those jobs with student and job details
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_student_id_fkey (
            full_name,
            email
          ),
          jobs (
            title
          )
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error Loading Applications",
          description: "Failed to load job applications. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const formattedApplications = (data || []).map(app => ({
        ...app,
        student_name: app.profiles?.full_name || 'Unknown',
        student_email: app.profiles?.email || '',
        job_title: app.jobs?.title || 'Unknown Position'
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while loading applications.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'reviewed' | 'accepted' | 'rejected', message?: string) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          employer_message: message || null
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update application status. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Application Updated",
        description: `Application has been ${status}.`,
      });

      await fetchApplications();
      setSelectedApplication(null);
      setEmployerMessage('');
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while updating the application.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadResume = async (resumeUrl: string, studentName: string) => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${studentName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Resume download has started.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const previewResume = (resumeUrl: string) => {
    setPreviewResumeUrl(resumeUrl);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const reviewed = applications.filter(app => app.status === 'reviewed').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;

    return { total, pending, reviewed, accepted, rejected };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading applications...</span>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards for Mobile and Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">
              Applications will appear here once students start applying to your job postings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      {application.job_title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {application.student_name}
                      </span>
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {application.student_email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(application.applied_at)}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Cover Letter */}
                {application.cover_letter && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Cover Letter</Label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resume Actions */}
                {application.resume_url && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Resume</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => previewResume(application.resume_url!)}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview Resume</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadResume(application.resume_url!, application.student_name!)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Resume</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Previous Employer Message */}
                {application.employer_message && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Previous Message</Label>
                    <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        {application.employer_message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {application.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                      disabled={isUpdating}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Mark as Reviewed
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Accept Application</DialogTitle>
                        <DialogDescription>
                          Accept {application.student_name}'s application for {application.job_title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message to Student (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Congratulations! We'd like to move forward with your application..."
                            value={employerMessage}
                            onChange={(e) => setEmployerMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => updateApplicationStatus(application.id, 'accepted', employerMessage)}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isUpdating ? 'Accepting...' : 'Accept Application'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                          Reject {application.student_name}'s application for {application.job_title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="message">Message to Student (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Thank you for your interest. Unfortunately, we decided to move forward with other candidates..."
                            value={employerMessage}
                            onChange={(e) => setEmployerMessage(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => updateApplicationStatus(application.id, 'rejected', employerMessage)}
                            disabled={isUpdating}
                            variant="destructive"
                          >
                            {isUpdating ? 'Rejecting...' : 'Reject Application'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resume Preview Dialog */}
      <Dialog open={!!previewResumeUrl} onOpenChange={() => setPreviewResumeUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewResumeUrl && (
              <iframe
                src={previewResumeUrl}
                className="w-full h-[600px] border-0"
                title="Resume Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
