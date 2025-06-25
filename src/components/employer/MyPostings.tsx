
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { Building2, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export const MyPostings = () => {
  const { user } = useAuth();
  const { getJobsByEmployer } = useJobs();

  const employerJobs = getJobsByEmployer(user?.id || '');

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
                    <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1`}>
                      {getStatusIcon(job.status)}
                      <span className="capitalize">{job.status}</span>
                    </Badge>
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

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Posted:</span> {formatDate(job.created_at)}
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
