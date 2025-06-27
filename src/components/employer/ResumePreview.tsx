
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Download } from 'lucide-react';

interface ResumePreviewProps {
  resumeUrl: string;
  applicantName: string;
  onDownload: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeUrl,
  applicantName,
  onDownload
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    if (!resumeUrl) {
      toast({
        title: "No Resume",
        description: "This applicant hasn't uploaded a resume",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) {
        console.error('Error downloading resume for preview:', error);
        toast({
          title: "Preview Failed",
          description: "Could not load the resume for preview",
          variant: "destructive"
        });
        return;
      }

      // Create a blob URL and open in new tab
      const url = URL.createObjectURL(data);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        toast({
          title: "Preview Blocked",
          description: "Please allow popups for this site to preview resumes",
          variant: "destructive"
        });
      }

      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('Error previewing resume:', error);
      toast({
        title: "Preview Failed",
        description: "Could not load the resume for preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePreview}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        <Eye className="h-4 w-4" />
        <span>{isLoading ? 'Loading...' : 'Preview'}</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onDownload}
        className="flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Download</span>
      </Button>
    </div>
  );
};
