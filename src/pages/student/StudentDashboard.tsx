import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Search, MapPin, Clock, DollarSign, Building2, FileText, Send, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import { JobApplicationForm } from '../../components/student/JobApplicationForm';
import MobileJobSearch from '../../components/student/MobileJobSearch';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { getApprovedJobs, getStudentApplications, refreshJobs } = useJobs();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [activeSection, setActiveSection] = useState('job-search');

  const approvedJobs = getApprovedJobs();
  const studentApplications = getStudentApplications();
  
  const filteredJobs = approvedJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter applications by status
  const acceptedApplications = studentApplications.filter(app => app.status === 'accepted');
  const rejectedApplications = studentApplications.filter(app => app.status === 'rejected');
  const pendingApplications = studentApplications.filter(app => app.status === 'pending' || app.status === 'reviewed');

  // Get section titles
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'job-search':
        return 'Job Search';
      case 'accepted-applications':
        return 'Accepted Applications';
      case 'rejected-applications':
        return 'Rejected Applications';
      case 'pending-applications':
        return 'Pending Applications';
      default:
        return 'Dashboard';
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case 'job-search':
        return 'Browse and apply to available job opportunities';
      case 'accepted-applications':
        return 'Applications that have been accepted by employers';
      case 'rejected-applications':
        return 'Applications that were not successful';
      case 'pending-applications':
        return 'Applications awaiting employer review';
      default:
        return '';
    }
  };

  const handleApply = async (applicationData: {
    coverLetter: string;
    applicantName: string;
    applicantEmail: string;
    additionalComments: string;
    resumeUrl?: string;
  }) => {
    if (!selectedJob || !user) return;
    
    setIsApplying(true);
    
    try {
      // Check if application already exists
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', selectedJob.id)
        .eq('student_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing application:', checkError);
        toast({
          title: "Application Failed",
          description: "There was an error processing your application.",
          variant: "destructive"
        });
        return;
      }

      if (existingApplication) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('applications').insert([
        {
          job_id: selectedJob.id,
          student_id: user.id,
          cover_letter: applicationData.coverLetter,
          applicant_name: applicationData.applicantName,
          applicant_email: applicationData.applicantEmail,
          additional_comments: applicationData.additionalComments,
          resume_url: applicationData.resumeUrl,
        },
      ]);

      if (error) {
        console.error('Error applying to job:', error);
        toast({
          title: "Application Failed",
          description: "There was an error submitting your application.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Application Submitted",
        description: `Your application for ${selectedJob.title} has been sent successfully.`
      });
      
      setSelectedJob(null);
      await refreshJobs();
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTitle = (jobId: string) => {
    const job = approvedJobs.find(job => job.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const getJobCompany = (jobId: string) => {
    const job = approvedJobs.find(job => job.id === jobId);
    return job ? job.company : 'Unknown Company';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewed': return 'secondary';
      default: return 'outline';
    }
  };

  const renderApplicationCards = (applications: any[], showMessage: boolean = false) => {
    if (applications.length === 0) {
      const emptyMessages = {
        'accepted-applications': 'No accepted applications yet',
        'rejected-applications': 'No rejected applications yet',
        'pending-applications': 'No pending applications yet'
      };

      return (
        <Card>
          <CardContent className={`${isMobile ? 'p-8' : 'p-12'} text-center`}>
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {emptyMessages[activeSection] || 'No applications found'}
            </h3>
            <p className="text-gray-600">
              Applications will appear here when they match this status
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {applications.map((application) => (
          <Card key={application.id} className="h-fit">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 mb-1`}>
                      {getJobTitle(application.job_id)}
                    </h3>
                    <p className={`${isMobile ? 'text-sm' : 'text-md'} text-gray-700 mb-2`}>
                      {getJobCompany(application.job_id)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(application.status)} className="ml-2">
                    {application.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">
                  Applied on {formatDate(application.applied_at)}
                </p>
                
                {application.cover_letter && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm">Cover Letter</h4>
                    <p className="text-xs text-gray-700 line-clamp-3">{application.cover_letter}</p>
                  </div>
                )}

                {showMessage && application.employer_message && (
                  <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm flex items-center">
                      {application.status === 'accepted' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      Message from Employer
                    </h4>
                    <p className="text-sm text-gray-700">{application.employer_message}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'job-search':
        if (isMobile) {
          return (
            <MobileJobSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filteredJobs={filteredJobs}
              onJobSelect={setSelectedJob}
            />
          );
        }

        return (
          <div className="space-y-6">
            {/* Desktop Search Bar */}
            <div className="sticky top-0 z-10 bg-white pb-4">
              <div className="w-full max-w-2xl">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="search" className="sr-only">Search jobs</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="search"
                            placeholder="Search jobs by title, company, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-96"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Desktop Job Listings */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Opportunities</h2>
                <Badge variant="secondary">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                </Badge>
              </div>

              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search terms' : 'New opportunities will appear here when posted'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                            <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                            <p className="text-gray-600 line-clamp-3">{job.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Due: {formatDate(job.deadline)}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Posted {formatDate(job.created_at)}
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedJob(job)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                View & Apply
                              </Button>
                            </DialogTrigger>
                            {selectedJob && (
                              <JobApplicationForm
                                job={selectedJob}
                                onSubmit={handleApply}
                                onCancel={() => setSelectedJob(null)}
                                isSubmitting={isApplying}
                              />
                            )}
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'accepted-applications':
        return renderApplicationCards(acceptedApplications, true);

      case 'rejected-applications':
        return renderApplicationCards(rejectedApplications, true);

      case 'pending-applications':
        return renderApplicationCards(pendingApplications, false);

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <StudentSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <SidebarInset>
          <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
            {/* Section Header */}
            <div className="mb-8">
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
                {getSectionTitle(activeSection)}
              </h1>
              <p className="text-gray-600 mt-2">{getSectionDescription(activeSection)}</p>
            </div>

            {/* Main Content */}
            {renderContent()}

            {/* Job Application Dialog for Mobile */}
            {selectedJob && (
              <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <JobApplicationForm
                  job={selectedJob}
                  onSubmit={handleApply}
                  onCancel={() => setSelectedJob(null)}
                  isSubmitting={isApplying}
                />
              </Dialog>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
