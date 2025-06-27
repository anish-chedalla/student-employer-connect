
import { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { JobApplicationForm } from './JobApplicationFormWithResume';

interface MobileJobSearchProps {
  jobs: any[];
  onApplyClick: (jobId: string, jobTitle: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onApplicationSuccess: () => void;
  selectedJobId: string | null;
  selectedJobTitle: string;
  isApplicationFormOpen: boolean;
  setIsApplicationFormOpen: (open: boolean) => void;
}

const MobileJobSearch = ({ 
  jobs, 
  onApplyClick, 
  searchTerm, 
  onSearchChange, 
  onApplicationSuccess,
  selectedJobId,
  selectedJobTitle,
  isApplicationFormOpen,
  setIsApplicationFormOpen
}: MobileJobSearchProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Mobile Search Bar */}
      <div className="sticky top-0 z-10 bg-white pb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filter Jobs</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">Advanced filters coming soon!</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Available Jobs</h2>
        <Badge variant="secondary">
          {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
        </Badge>
      </div>

      {/* Mobile Job Cards */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'New opportunities will appear here when posted'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Job Title & Company */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-md text-gray-700">{job.company}</p>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
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
                      <span>Due: {formatDate(job.deadline)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

                  {/* Apply Button */}
                  <Button 
                    onClick={() => onApplyClick(job.id, job.title)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    View & Apply
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
          onSuccess={onApplicationSuccess}
        />
      )}
    </div>
  );
};

export default MobileJobSearch;
