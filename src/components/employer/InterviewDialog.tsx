
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  applicantName: string;
  jobTitle: string;
  onInterviewCreated: () => void;
}

export const InterviewDialog = ({ 
  isOpen, 
  onClose, 
  applicationId, 
  applicantName, 
  jobTitle,
  onInterviewCreated 
}: InterviewDialogProps) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter interview details",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create interview record
      const { error: interviewError } = await supabase
        .from('interviews')
        .insert([{
          application_id: applicationId,
          employer_message: message,
          status: 'scheduled'
        }]);

      if (interviewError) {
        console.error('Error creating interview:', interviewError);
        throw interviewError;
      }

      // Update application interview status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ interview_status: 'scheduled' })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      toast({
        title: "Interview Scheduled",
        description: `Interview has been scheduled for ${applicantName}. They will be notified with the details.`,
      });

      onInterviewCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating interview:', error);
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Create an interview for {applicantName}'s application to {jobTitle}.
            Include details like date, time, and meeting link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Interview Details
            </label>
            <Textarea
              placeholder="Dear [Applicant Name],

Congratulations! We would like to invite you for an interview for the [Job Title] position.

Interview Details:
• Date: [Date]
• Time: [Time]
• Duration: [Duration]
• Format: [In-person/Virtual]
• Location/Meeting Link: [Details]

Please confirm your availability by replying to this message.

Best regards,
[Your Name]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isProcessing || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
