
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2 } from 'lucide-react';

export const PostJobs = () => {
  const { user } = useAuth();
  const { submitJob } = useJobs();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New job form state
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    salary: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
    deadline: '',
    location: ''
  });

  const handleSubmitJob = async () => {
    if (!user) return;
    
    // Basic validation
    if (!newJob.title || !newJob.description || !newJob.company || !newJob.salary || !newJob.deadline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const success = await submitJob(newJob);
    
    if (success) {
      toast({
        title: "Job Posted",
        description: "Your job posting has been submitted for review."
      });
      setNewJob({
        title: '',
        description: '',
        company: '',
        salary: '',
        type: 'full-time',
        deadline: '',
        location: ''
      });
    } else {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your job posting. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Plus className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600">Create a new job posting for review</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill in the job information that will be reviewed before publication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                placeholder="e.g., Software Developer Intern"
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={newJob.company}
                onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                placeholder="Your company name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary">Compensation *</Label>
              <Input
                id="salary"
                value={newJob.salary}
                onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                placeholder="e.g., $15-20/hour, $500/week"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                placeholder="e.g., Remote, Downtown Office"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Job Type *</Label>
              <select
                id="type"
                value={newJob.type}
                onChange={(e) => setNewJob({...newJob, type: e.target.value as 'full-time' | 'part-time' | 'internship' | 'contract'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <Label htmlFor="deadline">Application Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={newJob.deadline}
                onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmitJob}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
