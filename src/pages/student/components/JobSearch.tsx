
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdvancedJobFilter from '../../../components/student/AdvancedJobFilter';
import { JobApplicationForm } from '../../../components/student/JobApplicationFormWithResume';
import MobileJobSearch from '../../../components/student/MobileJobSearch';
import { useJobs } from '../../../contexts/JobContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useIsMobile } from '../../../hooks/use-mobile';
import { Search, MapPin, Calendar, DollarSign, Building } from 'lucide-react';

const JobSearch = () => {
  const { getApprovedJobs, refreshJobs } = useJobs();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const isMobile = useIsMobile();

  const jobs = getApprovedJobs();

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setIsApplicationFormOpen(true);
  };

  const handleApplicationSuccess = () => {
    refreshJobs();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'internship': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contract': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isMobile) {
    return (
      <MobileJobSearch 
        jobs={filteredJobs}
        onApplyClick={handleApplyClick}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <AdvancedJobFilter
          jobs={jobs}
          onFilteredJobsChange={() => {}}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new opportunities'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getJobTypeColor(job.type)}`}>
                      {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                  <Button onClick={() => handleApplyClick(job.id, job.title)}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
