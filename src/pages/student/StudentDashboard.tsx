import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Search, MapPin, Clock, DollarSign, Building2, FileText, Send, Calendar, Users } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { getApprovedJobs, getStudentApplications, applyToJob } = useJobs();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [activeSection, setActiveSection] = useState('job-search');

  const approvedJobs = getApprovedJobs();
  const studentApplications = getStudentApplications();
  const acceptedApplications = studentApplications.filter(app => app.status === 'accepted');
  
  const filteredJobs = approvedJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = async () => {
    if (!selectedJob || !user) return;
    
    setIsApplying(true);
    
    const success = await applyToJob(selectedJob.id, applicationMessage);
    
    if (success) {
      toast({
        title: "Application Submitted",
        description: `Your application for ${selectedJob.title} has been sent successfully.`
      });
      setApplicationMessage('');
      setSelectedJob(null);
    } else {
      toast({
        title: "Application Failed", 
        description: "You may have already applied to this job or there was an error.",
        variant: "destructive"
      });
    }
    
    setIsApplying(false);
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

  const renderContent = () => {
    switch (activeSection) {
      case 'job-search':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
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
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="flex items-center justify-between">
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
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">{selectedJob?.title}</DialogTitle>
                              <DialogDescription className="text-lg">
                                {selectedJob?.company} • {selectedJob?.location}
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedJob && (
                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Job Description</h4>
                                  <p className="text-gray-700">{selectedJob.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Compensation</h4>
                                    <p className="text-gray-700">{selectedJob.salary}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Job Type</h4>
                                    <p className="text-gray-700 capitalize">{selectedJob.type}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Application Deadline</h4>
                                  <p className="text-gray-700">{formatDate(selectedJob.deadline)}</p>
                                </div>

                                <div className="border-t pt-6">
                                  <h4 className="font-semibold mb-2">Apply for this position</h4>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="message">Cover Message (Optional)</Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Tell the employer why you're interested in this position..."
                                        value={applicationMessage}
                                        onChange={(e) => setApplicationMessage(e.target.value)}
                                        rows={4}
                                      />
                                    </div>
                                    
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                      <div className="flex items-center space-x-2 text-yellow-800">
                                        <FileText className="h-4 w-4" />
                                        <p className="text-sm">
                                          Resume upload feature coming soon. For now, mention your key qualifications in the message above.
                                        </p>
                                      </div>
                                    </div>

                                    <Button 
                                      onClick={handleApply}
                                      disabled={isApplying}
                                      className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                      {isApplying ? 'Submitting Application...' : 'Submit Application'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'my-applications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            
            {studentApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">
                    Applications you submit will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {studentApplications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {getJobTitle(application.job_id)}
                          </h3>
                          <p className="text-lg text-gray-700 mb-2">
                            {getJobCompany(application.job_id)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Applied on {formatDate(application.applied_at)}
                          </p>
                        </div>
                        <Badge variant={
                          application.status === 'accepted' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 
                          application.status === 'reviewed' ? 'secondary' : 
                          'outline'
                        }>
                          {application.status}
                        </Badge>
                      </div>
                      
                      {application.cover_letter && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Cover Letter</h4>
                          <p className="text-sm text-gray-700">{application.cover_letter}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'application-status':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Application Status</h2>
            
            {studentApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Track your progress</h3>
                  <p className="text-gray-600">
                    Status updates for your applications will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {studentApplications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            application.status === 'accepted' ? 'bg-green-500' :
                            application.status === 'rejected' ? 'bg-red-500' :
                            application.status === 'reviewed' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{getJobTitle(application.job_id)}</p>
                            <p className="text-sm text-gray-600">{getJobCompany(application.job_id)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            application.status === 'accepted' ? 'default' : 
                            application.status === 'rejected' ? 'destructive' : 
                            application.status === 'reviewed' ? 'secondary' : 
                            'outline'
                          }>
                            {application.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(application.applied_at)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <SidebarTrigger />
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-sm text-gray-600">Welcome back, {profile?.full_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">{approvedJobs.length}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications Sent</p>
                        <p className="text-2xl font-bold text-gray-900">{studentApplications.length}</p>
                      </div>
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Acceptances</p>
                        <p className="text-2xl font-bold text-gray-900">{acceptedApplications.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
