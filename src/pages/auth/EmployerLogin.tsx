
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
      <div className="min-h-screen flex">
        {/* Left side - Verification Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
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
                  className="w-full bg-green-600 hover:bg-green-700 h-11 font-semibold"
                >
                  Back to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex flex-1 relative">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Professional office"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-emerald-900/20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Employer Portal</h1>
            </div>
            <p className="text-gray-600">Connect with top talent and grow your team</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                {isSignup ? 'Create Employer Account' : 'Employer Login'}
              </CardTitle>
              <CardDescription>
                {isSignup 
                  ? 'Partner with us to access exceptional student talent'
                  : 'Welcome back! Ready to find your next great hire?'
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
                      className="h-11"
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
                    className="h-11"
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
                    className="h-11"
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
                  className="w-full bg-green-600 hover:bg-green-700 h-11 font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : isSignup 
                    ? 'Create Account' 
                    : 'Sign In'
                  }
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
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

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Professional team meeting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-emerald-900/20"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Find Exceptional Talent</h2>
          <p className="text-green-100 max-w-md">Access a curated pool of ambitious students and recent graduates ready to make an impact at your company.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
