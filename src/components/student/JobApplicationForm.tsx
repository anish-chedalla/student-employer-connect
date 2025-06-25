
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';

interface JobApplicationFormProps {
  job: any;
  onSubmit: (applicationData: {
    coverLetter: string;
    applicantName: string;
    applicantEmail: string;
    additionalComments: string;
    resumeUrl?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const JobApplicationForm = ({ job, onSubmit, onCancel, isSubmitting }: JobApplicationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    coverLetter: '',
    additionalComments: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF or Word document",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile || !user) return null;
    
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload failed",
          description: "Failed to upload document. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      return fileName;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicantName || !formData.applicantEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    let resumeUrl: string | undefined;
    
    if (selectedFile) {
      resumeUrl = await uploadFile() || undefined;
      if (selectedFile && !resumeUrl) {
        // Upload failed, don't submit
        return;
      }
    }

    onSubmit({
      ...formData,
      resumeUrl
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Apply for {job?.title}</DialogTitle>
        <DialogDescription className="text-lg">
          {job?.company} • {job?.location}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{job?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Compensation</h4>
                  <p className="text-gray-700">{job?.salary}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Job Type</h4>
                  <p className="text-gray-700 capitalize">{job?.type}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Application Deadline</h4>
                <p className="text-gray-700">{job?.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Application</CardTitle>
            <CardDescription>Please provide your information and application details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Full Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicantEmail">Email Address *</Label>
                <Input
                  id="applicantEmail"
                  type="email"
                  value={formData.applicantEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicantEmail: e.target.value }))}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Tell the employer why you're interested in this position..."
                rows={4}
              />
            </div>

            {/* Resume Upload */}
            <div>
              <Label htmlFor="resume">Resume/CV</Label>
              <div className="mt-2">
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="resume" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload</span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </label>
                      <input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">PDF, DOC, or DOCX up to 5MB</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Comments */}
            <div>
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
                placeholder="Any additional information you'd like to share..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Submitting Application...' : 
             isUploading ? 'Uploading Document...' : 
             'Submit Application'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
