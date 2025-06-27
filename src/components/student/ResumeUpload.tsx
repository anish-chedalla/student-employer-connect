
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, Trash2, Download } from 'lucide-react';

export const ResumeUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState<string | null>(null);

  React.useEffect(() => {
    loadCurrentResume();
  }, [user]);

  const loadCurrentResume = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(`${user.id}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading resume:', error);
        return;
      }

      if (data && data.length > 0) {
        setCurrentResume(data[0].name);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Delete existing resume if any
      if (currentResume) {
        await supabase.storage
          .from('resumes')
          .remove([`${user.id}/${currentResume}`]);
      }

      // Upload new resume
      const fileExt = file.name.split('.').pop();
      const fileName = `resume_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setCurrentResume(fileName);
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been uploaded and will be attached to future applications",
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadResume = async () => {
    if (!currentResume || !user) return;

    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(`${user.id}/${currentResume}`);

      if (error) {
        throw error;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentResume;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "Failed to download resume",
        variant: "destructive"
      });
    }
  };

  const deleteResume = async () => {
    if (!currentResume || !user) return;

    try {
      const { error } = await supabase.storage
        .from('resumes')
        .remove([`${user.id}/${currentResume}`]);

      if (error) {
        throw error;
      }

      setCurrentResume(null);
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed",
      });

    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete resume",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Resume Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentResume ? (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Resume uploaded</p>
                <p className="text-sm text-green-600">{currentResume}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResume}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteResume}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your resume</h3>
              <p className="text-gray-600 mb-4">PDF or Word document, max 5MB</p>
              
              <Label htmlFor="resume-upload">
                <Input
                  id="resume-upload"
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <Button 
                  disabled={uploading}
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </Label>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p>• Your resume will be automatically attached to job applications</p>
          <p>• Only employers of jobs you apply to can access your resume</p>
          <p>• Supported formats: PDF, DOC, DOCX</p>
        </div>
      </CardContent>
    </Card>
  );
};
