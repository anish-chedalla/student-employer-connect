
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react';

const EmployerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  
  const { login, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowVerificationMessage(false);

    if (isSignup) {
      const result = await signUp(email, password, fullName, 'employer');
      if (result.error) {
        setError(result.error);
      } else {
        setShowVerificationMessage(true);
        toast({
          title: "Account Created",
          description: "Your employer account has been created and is pending verification."
        });
        // Clear the form
        setEmail('');
        setPassword('');
        setFullName('');
        setIsSignup(false);
      }
    } else {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/employer/dashboard');
      }
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Account Created Successfully!</CardTitle>
              <CardDescription>
                Your employer account has been submitted for verification
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <Alert>
                <AlertDescription>
                  <strong>Next Steps:</strong><br />
                  1. An administrator will review your employer account<br />
                  2. You'll receive an email once verified<br />
                  3. After verification, you can log in to access your dashboard
                </AlertDescription>
              </Alert>

              <p className="text-sm text-gray-600">
                This process helps us maintain the quality of our platform and ensures students connect with legitimate employers.
              </p>

              <Button 
                onClick={() => setShowVerificationMessage(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Employer Portal</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isSignup ? 'Create Employer Account' : 'Employer Login'}
            </CardTitle>
            <CardDescription>
              {isSignup 
                ? 'Partner with us to connect with talented students. Your account will be reviewed for verification.'
                : 'Access your employer dashboard to post job opportunities'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Contact Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contact@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSignup && (
                <Alert>
                  <AlertDescription>
                    <strong>Note:</strong> All employer accounts require admin verification before you can log in and post jobs.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : isSignup 
                  ? 'Create Account' 
                  : 'Login'
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                {isSignup 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerLogin;
