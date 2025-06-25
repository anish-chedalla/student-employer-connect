
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Search, MapPin, Clock, DollarSign, Building2, FileText, Send, Calendar, Users, Filter, ChevronDown } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import { JobApplicationForm } from '../../components/student/JobApplicationForm';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { getApprovedJobs, getStudentApplications, refreshJobs } = useJobs();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [activeSection, setActiveSection] = useState('job-search');
  const [statusFilters, setStatusFilters] = useState({
    accepted: true,
    rejected: true,
    reviewed: true,
    pending: true
  });

  const approvedJobs = getApprovedJobs();
  const studentApplications = getStudentApplications();
  
  const filteredJobs = approvedJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort applications: accepted first, then rejected, then reviewed, then pending
  const sortedApplications = studentApplications.sort((a, b) => {
    const statusOrder = { accepted: 0, rejected: 1, reviewed: 2, pending: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Filter applications based on selected status filters
  const filteredApplications = sortedApplications.filter(app => statusFilters[app.status]);

  // Get section titles
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'job-search':
        return 'Job Search';
      case 'my-applications':
        return 'My Applications';
      default:
        return 'Dashboard';
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

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewed': return 'secondary';
      default: return 'outline';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'job-search':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
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

            {/* Job Listings */}
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

      case 'my-applications':
        return (
          <div className="space-y-6">
            {/* Header with filters */}
            <div className="sticky top-0 z-10 bg-white pb-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex-shrink-0">
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                </div>
                
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter Status</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.accepted}
                        onCheckedChange={() => toggleStatusFilter('accepted')}
                      >
                        Accepted
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.rejected}
                        onCheckedChange={() => toggleStatusFilter('rejected')}
                      >
                        Rejected
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.reviewed}
                        onCheckedChange={() => toggleStatusFilter('reviewed')}
                      >
                        Reviewed
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={statusFilters.pending}
                        onCheckedChange={() => toggleStatusFilter('pending')}
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Applications Grid */}
            <div className="pt-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {studentApplications.length === 0 ? 'No applications yet' : 'No applications match your filters'}
                    </h3>
                    <p className="text-gray-600">
                      {studentApplications.length === 0 
                        ? 'Applications you submit will appear here'
                        : 'Try adjusting your status filters to see more applications'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApplications.map((application) => (
                    <Card key={application.id} className="h-fit">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {getJobTitle(application.job_id)}
                              </h3>
                              <p className="text-md text-gray-700 mb-2">
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

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
          <div className="p-6">
            {/* Section Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
              <p className="text-gray-600 mt-2">
                {activeSection === 'job-search' && 'Browse and apply to available job opportunities'}
                {activeSection === 'my-applications' && 'Track your submitted applications and their status'}
              </p>
            </div>

            {/* Main Content */}
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
