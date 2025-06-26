
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
import { JobPosting } from '@/contexts/JobContext';

interface AdvancedJobFilterProps {
  jobs: JobPosting[];
  onFilteredJobsChange: (filteredJobs: JobPosting[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

interface FilterState {
  searchTerm: string;
  jobType: string[];
  location: string;
  minHourlyRate: number;
  maxHourlyRate: number;
  datePosted: string;
  company: string[];
}

/**
 * AdvancedJobFilter provides comprehensive filtering capabilities for job postings
 * Features include: text search, job type filtering, location filter, hourly rate range, 
 * date posted filter, and company-specific filtering
 * Real-time filtering with visual feedback and filter count display
 */
const AdvancedJobFilter = ({ 
  jobs, 
  onFilteredJobsChange, 
  searchTerm, 
  onSearchChange 
}: AdvancedJobFilterProps) => {
  // Filter state management - tracks all active filter criteria
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: searchTerm,
    jobType: [],
    location: 'any',
    minHourlyRate: 0,
    maxHourlyRate: 100,
    datePosted: 'all',
    company: []
  });

  // UI state for showing/hiding advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Derived data for filter options - extracted from available jobs
  const availableJobTypes = [...new Set(jobs.map(job => job.type))];
  const availableLocations = [...new Set(jobs.map(job => job.location))];
  const availableCompanies = [...new Set(jobs.map(job => job.company))];

  /**
   * Comprehensive job filtering logic that applies multiple criteria simultaneously
   * Each filter is applied only if it has a meaningful value set
   */
  const applyFilters = () => {
    let filtered = jobs;

    // Text search across title, company, description, and location
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
      );
    }

    // Job type filter - supports multiple selections
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => filters.jobType.includes(job.type));
    }

    // Location filter - exact match or contains (only if not 'any')
    if (filters.location && filters.location !== 'any') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Company filter - supports multiple selections
    if (filters.company.length > 0) {
      filtered = filtered.filter(job => filters.company.includes(job.company));
    }

    // Hourly rate filter - extracts numeric values from salary strings and converts to hourly
    if (filters.minHourlyRate > 0 || filters.maxHourlyRate < 100) {
      filtered = filtered.filter(job => {
        // Extract numeric values from salary string (handles various formats)
        const salaryNumbers = job.salary.match(/\d+/g);
        if (salaryNumbers && salaryNumbers.length > 0) {
          let hourlyRate = parseInt(salaryNumbers[0]);
          
          // Convert annual salary to hourly (assuming 40 hours/week, 52 weeks/year)
          if (job.salary.toLowerCase().includes('year') || job.salary.toLowerCase().includes('annual')) {
            hourlyRate = Math.round(hourlyRate / (40 * 52));
          }
          
          return hourlyRate >= filters.minHourlyRate && hourlyRate <= filters.maxHourlyRate;
        }
        return true; // Include jobs where we can't parse salary
      });
    }

    // Date posted filter - filters based on job creation date
    if (filters.datePosted !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.datePosted) {
        case '24h':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(job => 
        new Date(job.created_at) >= cutoffDate
      );
    }

    onFilteredJobsChange(filtered);
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters, jobs]);

  // Sync external search term changes
  useEffect(() => {
    if (searchTerm !== filters.searchTerm) {
      setFilters(prev => ({ ...prev, searchTerm }));
    }
  }, [searchTerm]);

  // Handle search term changes from input
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  // Toggle job type filter selection
  const toggleJobType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }));
  };

  // Toggle company filter selection
  const toggleCompany = (company: string) => {
    setFilters(prev => ({
      ...prev,
      company: prev.company.includes(company)
        ? prev.company.filter(c => c !== company)
        : [...prev.company, company]
    }));
  };

  // Clear all active filters
  const clearAllFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      jobType: [],
      location: 'any',
      minHourlyRate: 0,
      maxHourlyRate: 100,
      datePosted: 'all',
      company: []
    };
    setFilters(clearedFilters);
    onSearchChange('');
  };

  // Count active filters for display
  const activeFilterCount = 
    (filters.jobType.length > 0 ? 1 : 0) +
    (filters.location && filters.location !== 'any' ? 1 : 0) +
    (filters.minHourlyRate > 0 || filters.maxHourlyRate < 100 ? 1 : 0) +
    (filters.datePosted !== 'all' ? 1 : 0) +
    (filters.company.length > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs by title, company, or description..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </CardTitle>
            <CardDescription>
              Refine your job search with detailed filtering options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Job Type</Label>
              <div className="flex flex-wrap gap-2">
                {availableJobTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.jobType.includes(type)}
                      onCheckedChange={() => toggleJobType(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="capitalize">
                      {type.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.jobType.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {filters.jobType.map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any location</SelectItem>
                  {availableLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hourly Rate Filter - Two separate sliders */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Hourly Rate Range</span>
              </Label>
              <div className="space-y-4">
                {/* Minimum Hourly Rate Slider */}
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">
                    Minimum: ${filters.minHourlyRate}/hr
                  </Label>
                  <Slider
                    value={[filters.minHourlyRate]}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      minHourlyRate: Math.min(value[0], prev.maxHourlyRate)
                    }))}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                {/* Maximum Hourly Rate Slider */}
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">
                    Maximum: ${filters.maxHourlyRate}/hr
                  </Label>
                  <Slider
                    value={[filters.maxHourlyRate]}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      maxHourlyRate: Math.max(value[0], prev.minHourlyRate)
                    }))}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 pt-2">
                  <span>${filters.minHourlyRate}/hr</span>
                  <span>to</span>
                  <span>${filters.maxHourlyRate}/hr</span>
                </div>
              </div>
            </div>

            {/* Date Posted Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Date Posted</span>
              </Label>
              <Select
                value={filters.datePosted}
                onValueChange={(value) => setFilters(prev => ({ ...prev, datePosted: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Company</span>
              </Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {availableCompanies.map(company => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={filters.company.includes(company)}
                      onCheckedChange={() => toggleCompany(company)}
                    />
                    <Label htmlFor={`company-${company}`} className="text-sm">
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
              {filters.company.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {filters.company.map(company => (
                    <Badge key={company} variant="secondary" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedJobFilter;
