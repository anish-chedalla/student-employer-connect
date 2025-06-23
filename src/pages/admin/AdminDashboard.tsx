
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  LogOut,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { jobs, updateJobStatus } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);

  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const approvedJobs = jobs.filter(job => job.status === 'approved');
  const rejectedJobs = jobs.filter(job => job.status === 'rejected');

  const handleApprove = (jobId: string) => {
    updateJobStatus(jobId, 'approved');
  };

  const handleReject = (jobId: string) => {
    updateJobStatus(jobId, 'rejected');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const JobCard = ({ job, showActions = true }: { job: any, showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <Badge 
            variant={
              job.status === 'approved' ? 'default' : 
              job.status === 'pending' ? 'secondary' : 
              'destructive'
            }
          >
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{job.description}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-blue-100 px-2 py-1 rounded">💰 {job.salary}</span>
            <span className="bg-green-100 px-2 py-1 rounded">📍 {job.location}</span>
            <span className="bg-purple-100 px-2 py-1 rounded">⏰ {job.type}</span>
          </div>
          <p className="text-xs text-gray-500">
            Deadline: {formatDate(job.deadline)} | Posted: {formatDate(job.postedDate)}
          </p>
          
          {showActions && job.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button 
                size="sm" 
                onClick={() => handleApprove(job.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleReject(job.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedJob(job)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingJobs.length}</div>
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

        {/* Job Management Tabs */}
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

          <TabsContent value="pending" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Jobs Pending Review</h3>
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
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Approved Jobs</h3>
              {approvedJobs.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No approved jobs yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {approvedJobs.map(job => (
                    <JobCard key={job.id} job={job} showActions={false} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Rejected Jobs</h3>
              {rejectedJobs.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No rejected jobs.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {rejectedJobs.map(job => (
                    <JobCard key={job.id} job={job} showActions={false} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
