
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JobTypeIcon from './JobTypeIcon';

interface JobApplicationFormValidatedProps {
  job: any;
  onSubmit: (data: {
    coverLetter: string;
    applicantName: string;
    applicantEmail: string;
    additionalComments: string;
    resumeUrl?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FormErrors {
  applicantName?: string;
  applicantEmail?: string;
  coverLetter?: string;
}

/**
 * Enhanced Job Application Form with comprehensive validation
 * Features: Real-time validation, email format checking, character limits,
 * required field validation, and user-friendly error messaging
 */
const JobApplicationFormValidated = ({
  job,
  onSubmit,
  onCancel,
  isSubmitting,
}: JobApplicationFormValidatedProps) => {
  const { toast } = useToast();
  
  // Form state management with individual field tracking
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    coverLetter: '',
    additionalComments: '',
    resumeUrl: ''
  });

  // Validation errors state - tracks specific field errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // UI state for form interaction feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Comprehensive form validation with specific rules for each field
   * Returns both overall validity and specific field errors
   */
  const validateForm = (): { isValid: boolean; errors: FormErrors } => {
    const newErrors: FormErrors = {};

    // Name validation - required, minimum length, no numbers
    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Full name is required';
    } else if (formData.applicantName.trim().length < 2) {
      newErrors.applicantName = 'Name must be at least 2 characters';
    } else if (/\d/.test(formData.applicantName)) {
      newErrors.applicantName = 'Name should not contain numbers';
    }

    // Email validation - required, proper format, reasonable length
    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = 'Please enter a valid email address';
    } else if (formData.applicantEmail.length > 100) {
      newErrors.applicantEmail = 'Email address is too long';
    }

    // Cover letter validation - required, minimum/maximum length
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    } else if (formData.coverLetter.length > 1000) {
      newErrors.coverLetter = 'Cover letter must be less than 1000 characters';
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  // Real-time field validation on blur
  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const { errors: validationErrors } = validateForm();
    setErrors(prev => ({
      ...prev,
      [fieldName]: validationErrors[fieldName as keyof FormErrors]
    }));
  };

  // Handle input changes with real-time character counting
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing (if field was previously touched)
    if (touched[field] && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form submission with comprehensive validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allFields = ['applicantName', 'applicantEmail', 'coverLetter'];
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
    
    const { isValid, errors: validationErrors } = validateForm();
    setErrors(validationErrors);

    if (!isValid) {
      toast({
        title: "Form Validation Failed",
        description: "Please fix the errors below before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to get input styling based on validation state
  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full";
    if (!touched[fieldName]) return baseClass;
    
    const hasError = errors[fieldName as keyof FormErrors];
    return `${baseClass} ${hasError ? 'border-red-500 focus:border-red-500' : 'border-green-500 focus:border-green-500'}`;
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader className="space-y-4">
        <div className="flex items-start space-x-4">
          <JobTypeIcon jobTitle={job.title} company={job.company} className="h-8 w-8 mt-1" />
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-700 mt-1">
              {job.company} • {job.location}
            </DialogDescription>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{job.type.replace('-', ' ')}</Badge>
              <Badge variant="secondary">{job.salary}</Badge>
            </div>
          </div>
        </div>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
          </CardContent>
        </Card>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Applicant Name Field */}
        <div className="space-y-2">
          <Label htmlFor="applicantName" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="applicantName"
            type="text"
            placeholder="Enter your full name"
            value={formData.applicantName}
            onChange={(e) => handleInputChange('applicantName', e.target.value)}
            onBlur={() => handleFieldBlur('applicantName')}
            className={getInputClassName('applicantName')}
            maxLength={100}
          />
          {errors.applicantName && touched.applicantName && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.applicantName}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="applicantEmail" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="applicantEmail"
            type="email"
            placeholder="your.email@example.com"
            value={formData.applicantEmail}
            onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
            onBlur={() => handleFieldBlur('applicantEmail')}
            className={getInputClassName('applicantEmail')}
            maxLength={100}
          />
          {errors.applicantEmail && touched.applicantEmail && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.applicantEmail}</span>
            </div>
          )}
        </div>

        {/* Cover Letter Field */}
        <div className="space-y-2">
          <Label htmlFor="coverLetter" className="text-sm font-medium">
            Cover Letter *
          </Label>
          <Textarea
            id="coverLetter"
            placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
            value={formData.coverLetter}
            onChange={(e) => handleInputChange('coverLetter', e.target.value)}
            onBlur={() => handleFieldBlur('coverLetter')}
            className={`${getInputClassName('coverLetter')} min-h-32`}
            maxLength={1000}
          />
          <div className="flex justify-between items-center">
            {errors.coverLetter && touched.coverLetter && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.coverLetter}</span>
              </div>
            )}
            <div className="text-sm text-gray-500 ml-auto">
              {formData.coverLetter.length}/1000 characters
            </div>
          </div>
        </div>

        {/* Additional Comments Field */}
        <div className="space-y-2">
          <Label htmlFor="additionalComments" className="text-sm font-medium">
            Additional Comments <span className="text-gray-500">(Optional)</span>
          </Label>
          <Textarea
            id="additionalComments"
            placeholder="Any additional information you'd like to share..."
            value={formData.additionalComments}
            onChange={(e) => handleInputChange('additionalComments', e.target.value)}
            className="min-h-24"
            maxLength={500}
          />
          <div className="text-sm text-gray-500 text-right">
            {formData.additionalComments.length}/500 characters
          </div>
        </div>

        {/* Form Validation Summary */}
        {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the validation errors above before submitting your application.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default JobApplicationFormValidated;
