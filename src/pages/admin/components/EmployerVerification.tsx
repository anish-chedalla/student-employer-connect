
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Calendar
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EmployerProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  verified: boolean;
  verification_requested_at: string | null;
  created_at: string;
  updated_at: string;
}

const EmployerVerification = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employer')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch employers.",
          variant: "destructive",
        });
        return;
      }

      setEmployers(data || []);
    } catch (error) {
      console.error('Error fetching employers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchEmployers();
    }
  }, [profile]);

  const handleVerificationStatusChange = async (employerId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verified,
          verification_requested_at: verified ? null : new Date().toISOString()
        })
        .eq('id', employerId);

      if (error) {
        console.error('Error updating verification status:', error);
        toast({
          title: "Error",
          description: "Failed to update verification status.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status Updated",
        description: `Employer has been ${verified ? 'verified' : 'unverified'}.`,
      });

      // Refresh the employers list
      await fetchEmployers();
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const unverifiedEmployers = employers.filter(emp => !emp.verified);
  const verifiedEmployers = employers.filter(emp => emp.verified);

  const EmployerCard = ({ employer }: { employer: EmployerProfile }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {employer.full_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {employer.email}
            </CardDescription>
          </div>
          <Badge 
            variant={employer.verified ? 'default' : 'secondary'}
            className={
              employer.verified 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }
          >
            {employer.verified ? 'Verified' : 'Pending'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined: {formatDate(employer.created_at)}
            </span>
            {employer.verification_requested_at && (
              <span>Last updated: {formatDate(employer.verification_requested_at)}</span>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            {!employer.verified ? (
              <>
                <Button 
                  size="sm" 
                  onClick={() => handleVerificationStatusChange(employer.id, true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify Employer
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleVerificationStatusChange(employer.id, false)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Keep Pending
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleVerificationStatusChange(employer.id, false)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Revoke Verification
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Employer Verification</h2>
        <p className="text-muted-foreground">
          Review and verify employer accounts to ensure platform quality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{unverifiedEmployers.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Employers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedEmployers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active verified accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {unverifiedEmployers.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-4">Pending Verification</h3>
            {unverifiedEmployers.map(employer => (
              <EmployerCard key={employer.id} employer={employer} />
            ))}
          </div>
        </div>
      )}

      {verifiedEmployers.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-4">Verified Employers</h3>
            {verifiedEmployers.map(employer => (
              <EmployerCard key={employer.id} employer={employer} />
            ))}
          </div>
        </div>
      )}

      {employers.length === 0 && (
        <Alert>
          <AlertDescription>
            No employer accounts found.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmployerVerification;
