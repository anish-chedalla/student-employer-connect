
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2, AlertCircle, CheckCircle } from 'lucide-react';

interface JobFormErrors {
  title?: string;
  company?: string;
  description?: string;
  salary?: string;
  location?: string;
  deadline?: string;
}

/**
 * Enhanced PostJobs component with comprehensive form validation
 * Features: Real-time validation, character limits, required field checking,
 * date validation, and user-friendly error messaging
 */
export const PostJobs = () => {
  const { user } = useAuth();
  const { submitJob } = useJobs();
  const { toast } = useToast();
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Job form data with comprehensive state management
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    salary: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
    deadline: '',
    location: ''
  });

  // Validation errors and touched fields for better UX
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Comprehensive form validation with specific business rules
   * Returns both overall validity and detailed field errors
   */
  const validateForm = (): { isValid: boolean; errors: JobFormErrors } => {
    const newErrors: JobFormErrors = {};

    // Job title validation - required, length constraints, professional format
    if (!newJob.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (newJob.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    } else if (newJob.title.length > 100) {
      newErrors.title = 'Job title must be less than 100 characters';
    }

    // Company validation - required, reasonable length
    if (!newJob.company.trim()) {
      newErrors.company = 'Company name is required';
    } else if (newJob.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    } else if (newJob.company.length > 100) {
      newErrors.company = 'Company name must be less than 100 characters';
    }

    // Description validation - required, comprehensive content expected
    if (!newJob.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (newJob.description.trim().length < 100) {
      newErrors.description = 'Job description must be at least 100 characters for quality';
    } else if (newJob.description.length > 2000) {
      newErrors.description = 'Job description must be less than 2000 characters';
    }

    // Salary validation - required, reasonable format
    if (!newJob.salary.trim()) {
      newErrors.salary = 'Compensation information is required';
    } else if (newJob.salary.length > 50) {
      newErrors.salary = 'Compensation description is too long';
    }

    // Location validation - required
    if (!newJob.location.trim()) {
      newErrors.location = 'Job location is required';
    } else if (newJob.location.length > 100) {
      newErrors.location = 'Location description is too long';
    }

    // Deadline validation - required, must be future date
    if (!newJob.deadline) {
      newErrors.deadline = 'Application deadline is required';
    } else {
      const deadlineDate = new Date(newJob.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for date comparison
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be a future date';
      }
      
      // Check if deadline is too far in the future (more than 1 year)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (deadlineDate > oneYearFromNow) {
        newErrors.deadline = 'Deadline cannot be more than 1 year in the future';
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  // Real-time field validation on blur for better UX
  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const { errors: validationErrors } = validateForm();
    setErrors(prev => ({
      ...prev,
      [fieldName]: validationErrors[fieldName as keyof JobFormErrors]
    }));
  };

  // Handle input changes with real-time error clearing
  const handleInputChange = (field: string, value: string) => {
    setNewJob(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing (if field was previously touched)
    if (touched[field] && errors[field as keyof JobFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Enhanced form submission with comprehensive validation
  const handleSubmitJob = async () => {
    if (!user) return;
    
    // Mark all fields as touched for validation display
    const allFields = ['title', 'company', 'description', 'salary', 'location', 'deadline'];
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    const { isValid, errors: validationErrors } = validateForm();
    setErrors(validationErrors);

    if (!isValid) {
      toast({
        title: "Form Validation Failed",
        description: "Please fix the errors below before submitting your job posting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitJob(newJob);
      
      if (success) {
        toast({
          title: "Job Posted Successfully!",
          description: "Your job posting has been submitted for admin review and will be published once approved.",
          variant: "default"
        });
        
        // Reset form after successful submission
        setNewJob({
          title: '',
          description: '',
          company: '',
          salary: '',
          type: 'full-time',
          deadline: '',
          location: ''
        });
        setTouched({});
        setErrors({});
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your job posting. Please check your connection and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Job submission error:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get input styling based on validation state
  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full";
    if (!touched[fieldName]) return baseClass;
    
    const hasError = errors[fieldName as keyof JobFormErrors];
    return `${baseClass} ${hasError ? 'border-red-500 focus:border-red-500' : 'border-green-500 focus:border-green-500'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Enhanced Visual Design */}
      <div className="flex items-center space-x-3">
        <Plus className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600">Create a comprehensive job posting for student review</p>
        </div>
      </div>

      {/* Enhanced Job Posting Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Job Details</span>
          </CardTitle>
          <CardDescription>
            Provide detailed job information that will be reviewed by our admin team before publication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Title and Company Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job Title *
              </Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={() => handleFieldBlur('title')}
                placeholder="e.g., Software Developer Intern"
                className={getInputClassName('title')}
                maxLength={100}
              />
              {errors.title && touched.title && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.title}</span>
                </div>
              )}
              <div className="text-sm text-gray-500 text-right">
                {newJob.title.length}/100 characters
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="company"
                value={newJob.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                onBlur={() => handleFieldBlur('company')}
                placeholder="Your company name"
                className={getInputClassName('company')}
                maxLength={100}
              />
              {errors.company && touched.company && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Job Description *
            </Label>
            <Textarea
              id="description"
              value={newJob.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleFieldBlur('description')}
              placeholder="Provide a comprehensive description including responsibilities, requirements, qualifications, and what makes this opportunity special..."
              rows={6}
              className={getInputClassName('description')}
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              {errors.description && touched.description && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.description}</span>
                </div>
              )}
              <div className="text-sm text-gray-500 ml-auto">
                {newJob.description.length}/2000 characters
              </div>
            </div>
          </div>

          {/* Compensation and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">
                Compensation *
              </Label>
              <Input
                id="salary"
                value={newJob.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                onBlur={() => handleFieldBlur('salary')}
                placeholder="e.g., $15-20/hour, $500/week, Competitive"
                className={getInputClassName('salary')}
                maxLength={50}
              />
              {errors.salary && touched.salary && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.salary}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <Input
                id="location"
                value={newJob.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onBlur={() => handleFieldBlur('location')}
                placeholder="e.g., Remote, Downtown Office, Phoenix AZ"
                className={getInputClassName('location')}
                maxLength={100}
              />
              {errors.location && touched.location && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Type and Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Job Type *
              </Label>
              <select
                id="type"
                value={newJob.type}
                onChange={(e) => handleInputChange('type', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">
                Application Deadline *
              </Label>
              <Input
                id="deadline"
                type="date"
                value={newJob.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                onBlur={() => handleFieldBlur('deadline')}
                className={getInputClassName('deadline')}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
              />
              {errors.deadline && touched.deadline && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.deadline}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Validation Summary */}
          {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the validation errors above before submitting your job posting.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button with Enhanced Feedback */}
          <Button 
            onClick={handleSubmitJob}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 py-3"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting for Review...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Submit for Admin Review</span>
              </div>
            )}
          </Button>
          
          {/* Submission Guidelines */}
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">📋 Submission Guidelines:</p>
            <ul className="space-y-1 text-xs">
              <li>• All job postings are reviewed by our admin team before publication</li>
              <li>• Review process typically takes 1-2 business days</li>
              <li>• Ensure all information is accurate and professional</li>
              <li>• Include clear job requirements and company information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
