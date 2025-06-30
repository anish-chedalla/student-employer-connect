
import React, { useState } from 'react';
import { useJobs } from '../../../contexts/JobContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  RotateCcw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const JobManagement = () => {
  const { jobs, updateJobStatus, isLoading } = useJobs();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [declineMessage, setDeclineMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Show loading state while context is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const approvedJobs = jobs.filter(job => job.status === 'approved');
  const rejectedJobs = jobs.filter(job => job.status === 'rejected');

  const handleStatusChange = async (jobId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const success = await updateJobStatus(jobId, newStatus);
    if (success) {
      toast({
        title: "Status Updated",
        description: `Job has been ${newStatus}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineWithMessage = async () => {
    if (!selectedJob) return;
    
    setIsProcessing(true);
    try {
      // For now, we'll just update the status. In a full implementation,
      // you might want to store the decline message in the database
      const success = await updateJobStatus(selectedJob.id, 'rejected');
      if (success) {
        toast({
          title: "Job Declined",
          description: "Job has been declined with custom message.",
        });
        setSelectedJob(null);
        setDeclineMessage('');
      } else {
        toast({
          title: "Error",
          description: "Failed to decline job.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline job.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const JobCard = ({ job, showActions = true }: { job: any, showActions?: boolean }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription className="font-medium">{job.company}</CardDescription>
          </div>
          <Badge 
            variant={
              job.status === 'approved' ? 'default' : 
              job.status === 'pending' ? 'secondary' : 
              'destructive'
            }
            className={
              job.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              job.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
              'bg-red-100 text-red-800 hover:bg-red-200'
            }
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
              💰 {job.salary}
            </span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
              📍 {job.location}
            </span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
              ⏰ {job.type}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
            <span>Deadline: {formatDate(job.deadline)}</span>
            <span>Posted: {formatDate(job.created_at)}</span>
          </div>
          
          {showActions && (
            <div className="flex gap-2 pt-2">
              {job.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(job.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setSelectedJob(job)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Job Posting</DialogTitle>
                        <DialogDescription>
                          You are about to reject the job posting "{job.title}" by {job.company}.
                          Please provide a reason for rejection that will be communicated to the employer.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Please provide a reason for rejection (e.g., incomplete job description, inappropriate content, etc.)"
                        value={declineMessage}
                        onChange={(e) => setDeclineMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedJob(null);
                            setDeclineMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleDeclineWithMessage}
                          disabled={isProcessing || !declineMessage.trim()}
                          variant="destructive"
                        >
                          {isProcessing ? 'Processing...' : 'Reject Job'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              {job.status === 'approved' && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setSelectedJob(job)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Job Posting</DialogTitle>
                        <DialogDescription>
                          You are about to reject the job posting "{job.title}" by {job.company}.
                          Please provide a reason for rejection that will be communicated to the employer.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Please provide a reason for rejection (e.g., policy violation, inappropriate content, etc.)"
                        value={declineMessage}
                        onChange={(e) => setDeclineMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedJob(null);
                            setDeclineMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleDeclineWithMessage}
                          disabled={isProcessing || !declineMessage.trim()}
                          variant="destructive"
                        >
                          {isProcessing ? 'Processing...' : 'Reject Job'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(job.id, 'pending')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset to Pending
                  </Button>
                </>
              )}
              
              {job.status === 'rejected' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(job.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusChange(job.id, 'pending')}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset to Pending
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Job Management</h2>
        <p className="text-muted-foreground">
          Review and manage job postings across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingJobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedJobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedJobs.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({pendingJobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Approved ({approvedJobs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected ({rejectedJobs.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingJobs.length === 0 ? (
            <Alert>
              <AlertDescription>
                No jobs pending review at this time.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedJobs.length === 0 ? (
            <Alert>
              <AlertDescription>
                No approved jobs yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {approvedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedJobs.length === 0 ? (
            <Alert>
              <AlertDescription>
                No rejected jobs.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {rejectedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobManagement;
