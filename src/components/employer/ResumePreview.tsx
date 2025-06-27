
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Download, X } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

      // Create a blob URL for preview
      const url = URL.createObjectURL(data);
      setPreviewUrl(url);
      setIsOpen(true);
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

  const handleClose = () => {
    setIsOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <>
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

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{applicantName}'s Resume</span>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] border rounded-lg"
                title={`${applicantName}'s Resume`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
