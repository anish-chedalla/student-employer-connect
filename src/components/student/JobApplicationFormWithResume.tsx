
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, FileText, AlertCircle } from 'lucide-react';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, profile } = useAuth();
  const { applyToJob } = useJobs();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setApplicantName(profile.full_name || '');
      setApplicantEmail(profile.email || '');
    }
  }, [profile]);

  useEffect(() => {
    checkForResume();
  }, [user, isOpen]);

  const checkForResume = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(`${user.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error checking resume:', error);
        return;
      }

      if (data && data.length > 0) {
        setHasResume(true);
        setResumeFileName(data[0].name);
      } else {
        setHasResume(false);
        setResumeFileName(null);
      }
    } catch (error) {
      console.error('Error checking resume:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a cover letter for your application",
        variant: "destructive"
      });
      return;
    }

    if (!applicantName.trim() || !applicantEmail.trim()) {
      toast({
        title: "Contact information required",
        description: "Please provide your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create application with additional data
      const { error } = await supabase.from('applications').insert([
        {
          job_id: jobId,
          student_id: user?.id,
          cover_letter: coverLetter,
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          additional_comments: additionalComments || null,
          resume_url: hasResume ? `${user?.id}/${resumeFileName}` : null,
        },
      ]);

      if (error) {
        throw error;
      }

      // Send confirmation email
      await sendConfirmationEmail();

      toast({
        title: "Application submitted successfully",
        description: `Your application for ${jobTitle} has been submitted${hasResume ? ' with your resume attached' : ''}`,
      });

      onSuccess();
      onClose();
      resetForm();

    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Already applied",
          description: "You have already applied for this position",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Application failed",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: applicantEmail,
          subject: 'Job Application Confirmation',
          type: 'application_confirmation',
          data: {
            applicantName,
            jobTitle,
            hasResume
          }
        }
      });

      if (error) {
        console.error('Error sending confirmation email:', error);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const resetForm = () => {
    setCoverLetter('');
    setAdditionalComments('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Complete your application below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicant-name">Full Name *</Label>
              <Input
                id="applicant-name"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="applicant-email">Email Address *</Label>
              <Input
                id="applicant-email"
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Resume Status */}
          <Card className={hasResume ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
            <CardContent className="pt-4">
              <div className="flex items-center space-x-3">
                {hasResume ? (
                  <>
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Resume attached</p>
                      <p className="text-sm text-green-600">{resumeFileName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">No resume uploaded</p>
                      <p className="text-sm text-yellow-600">Go to your profile to upload a resume</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <div>
            <Label htmlFor="cover-letter">Cover Letter *</Label>
            <Textarea
              id="cover-letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a compelling cover letter explaining why you're interested in this position and what makes you a great fit..."
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Additional Comments */}
          <div>
            <Label htmlFor="additional-comments">Additional Comments (Optional)</Label>
            <Textarea
              id="additional-comments"
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder="Any additional information you'd like to share..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
