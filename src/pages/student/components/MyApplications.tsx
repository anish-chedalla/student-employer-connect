
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useJobs } from '../../../contexts/JobContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Calendar, MapPin, Building, FileText, ChevronDown, ChevronRight } from 'lucide-react';

const MyApplications = () => {
  const { getStudentApplications } = useJobs();
  const { user } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pending: true,
    accepted: false,
    rejected: false
  });

  const applications = getStudentApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const renderApplicationCard = (application: any) => (
    <Card key={application.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="mb-2">{application.job_title}</CardTitle>
            <CardDescription className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {application.company_name}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {application.job_location}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Applied: {formatDate(application.applied_at)}
            </span>
            {application.resume_url && (
              <span className="text-green-600 text-xs">
                Resume attached
              </span>
            )}
          </div>
          
          {application.cover_letter && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Cover Letter</h4>
              <p className="text-sm text-gray-700 line-clamp-3">
                {application.cover_letter}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              Start applying to jobs to see your applications here
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      <div className="text-sm text-gray-600">
        Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
      </div>

      <div className="space-y-6">
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
    </div>
  );
};

export default MyApplications;
