
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building2, ArrowLeft } from 'lucide-react';

const EmployerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle automatic redirect when user becomes authenticated
  useEffect(() => {
    if (user && profile && profile.role === 'employer' && !isLoading) {
      console.log('User authenticated as employer, redirecting to dashboard');
      navigate('/employer/dashboard');
    }
  }, [user, profile, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        console.log('Attempting signup for employer:', email);
        const result = await signUp(email, password, fullName, 'employer');
        if (result.error) {
          console.error('Signup error:', result.error);
          setError(result.error);
          setIsLoading(false);
        } else {
          toast({
            title: "Account Created",
            description: "Please check your email to confirm your account."
          });
          setIsSignup(false);
          setIsLoading(false);
        }
      } else {
        console.log('Attempting login for employer:', email);
        const result = await login(email, password);
        if (result.error) {
          console.error('Login error:', result.error);
          setError(result.error);
          setIsLoading(false);
        }
        // Note: We don't set isLoading to false here on success
        // because the useEffect will handle the redirect when auth state changes
      }
    } catch (error) {
      console.error('Unexpected error during authentication:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

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
                ? 'Partner with us to connect with talented students'
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
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
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
                disabled={isLoading}
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
