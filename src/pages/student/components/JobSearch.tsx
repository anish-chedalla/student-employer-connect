
import { useState, useEffect } from 'react';
import { useJobs } from '../../../contexts/JobContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useIsMobile } from '../../../hooks/use-mobile';
import { JobApplicationForm } from '../../../components/student/JobApplicationFormWithResume';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, Calendar } from 'lucide-react';
import AdvancedJobFilter from "../../../components/student/AdvancedJobFilter";
import MobileJobSearch from "../../../components/student/MobileJobSearch";
import { useToast } from '@/hooks/use-toast';

const JobSearch = () => {
  const { getApprovedJobs, refreshJobs } = useJobs();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);

  const allJobs = getApprovedJobs();

  useEffect(() => {
    setFilteredJobs(allJobs);
  }, [allJobs]);

  const handleJobApply = (jobId: string, jobTitle: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for jobs.",
        variant: "destructive"
      });
      return;
    }

    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setIsApplicationFormOpen(true);
  };

  const handleApplicationSuccess = () => {
    toast({
      title: "Application Submitted!",
      description: "Your job application has been submitted successfully.",
      variant: "default"
    });
    refreshJobs();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const capitalizeJobType = (type: string) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isMobile) {
    return (
      <MobileJobSearch
        jobs={filteredJobs}
        onApplyClick={handleJobApply}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onApplicationSuccess={handleApplicationSuccess}
        selectedJobId={selectedJobId}
        selectedJobTitle={selectedJobTitle}
        isApplicationFormOpen={isApplicationFormOpen}
        setIsApplicationFormOpen={setIsApplicationFormOpen}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Advanced Job Filter */}
      <AdvancedJobFilter
        jobs={allJobs}
        onFilteredJobsChange={setFilteredJobs}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Results Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
        </Badge>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search filters' : 'New opportunities will appear here when posted by employers'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Job Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-lg text-gray-700">{job.company}</p>
                    </div>
                    <Badge variant="outline" className="pointer-events-none">
                      {capitalizeJobType(job.type)}
                    </Badge>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Apply Button */}
                  <Button 
                    onClick={() => handleJobApply(job.id, job.title)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Form Modal */}
      {selectedJobId && (
        <JobApplicationForm
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
          isOpen={isApplicationFormOpen}
          onClose={() => setIsApplicationFormOpen(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobSearch;
