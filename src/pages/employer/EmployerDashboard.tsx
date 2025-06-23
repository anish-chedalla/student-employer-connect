
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus, Clock, CheckCircle, XCircle, LogOut, Calendar, Users, Eye } from 'lucide-react';

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const { getJobsByEmployer, submitJob } = useJobs();
  const { toast } = useToast();
  
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New job form state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    pay: '',
    deadline: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    requirements: '',
    benefits: ''
  });

  const employerJobs = getJobsByEmployer(user?.id || '');

  const handleSubmitJob = async () => {
    if (!user) return;
    
    // Basic validation
    if (!newJob.title || !newJob.description || !newJob.company || !newJob.pay || !newJob.deadline || !newJob.contactEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const jobData = {
      ...newJob,
      employerId: user.id,
      requirements: newJob.requirements.split('\n').filter(req => req.trim()),
      benefits: newJob.benefits.split('\n').filter(benefit => benefit.trim())
    };
    
    const success = await submitJob(jobData);
    
    if (success) {
      toast({
        title: "Job Posted",
        description: "Your job posting has been submitted for review."
      });
      setNewJob({
        title: '',
        description: '',
        company: '',
        pay: '',
        deadline: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        requirements: '',
        benefits: ''
      });
      setShowNewJobDialog(false);
    } else {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your job posting. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
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

  const stats = {
    total: employerJobs.length,
    approved: employerJobs.filter(job => job.status === 'approved').length,
    pending: employerJobs.filter(job => job.status === 'pending').length,
    rejected: employerJobs.filter(job => job.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Postings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {employerJobs.reduce((total, job) => total + job.applications.length, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
          
          <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
                <DialogDescription>
                  Create a new job posting that will be reviewed before publication
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      placeholder="e.g., Software Developer Intern"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={newJob.company}
                      onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pay">Compensation *</Label>
                    <Input
                      id="pay"
                      value={newJob.pay}
                      onChange={(e) => setNewJob({...newJob, pay: e.target.value})}
                      placeholder="e.g., $15-20/hour, $500/week"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newJob.location}
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                      placeholder="e.g., Remote, Downtown Office"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={newJob.contactEmail}
                      onChange={(e) => setNewJob({...newJob, contactEmail: e.target.value})}
                      placeholder="hr@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={newJob.contactPhone}
                      onChange={(e) => setNewJob({...newJob, contactPhone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements (one per line)</Label>
                  <Textarea
                    id="requirements"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                    placeholder="Currently enrolled in college&#10;Strong communication skills&#10;Previous experience preferred"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (one per line)</Label>
                  <Textarea
                    id="benefits"
                    value={newJob.benefits}
                    onChange={(e) => setNewJob({...newJob, benefits: e.target.value})}
                    placeholder="Flexible schedule&#10;Professional development&#10;Team events"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitJob}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Job Listings */}
        {employerJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">
                Start by creating your first job posting to connect with talented students
              </p>
              <Button 
                onClick={() => setShowNewJobDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {employerJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      <p className="text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1`}>
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status}</span>
                      </Badge>
                      {job.applications.length > 0 && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{job.applications.length} Applications</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Pay:</span> {job.pay}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {job.location}
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span> {formatDate(job.deadline)}
                    </div>
                    <div>
                      <span className="font-medium">Posted:</span> {formatDate(job.createdAt)}
                    </div>
                  </div>

                  {job.status === 'approved' && job.applications.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Recent Applications</h4>
                      <div className="space-y-2">
                        {job.applications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium">{app.studentName}</span>
                              <span className="text-gray-600 ml-2">({app.studentEmail})</span>
                            </div>
                            <span className="text-gray-500">
                              {formatDate(app.appliedAt)}
                            </span>
                          </div>
                        ))}
                        {job.applications.length > 3 && (
                          <p className="text-sm text-green-700">
                            +{job.applications.length - 3} more applications
                          </p>
                        )}
                      </div>
                    </div>
                  )}

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
    </div>
  );
};

export default EmployerDashboard;
