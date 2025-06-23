
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building2, ArrowLeft, Shield } from 'lucide-react';

const EmployerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup, send2FACode, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      const success = await signup(email, password, name, 'employer');
      if (success) {
        toast({
          title: "Account Created",
          description: "Your employer account has been created successfully. Please log in."
        });
        setIsSignup(false);
      } else {
        setError('Failed to create account. Email may already be in use.');
      }
    } else {
      if (!needsTwoFactor) {
        const success = await login(email, password, 'employer');
        if (success === false && !needsTwoFactor) {
          await send2FACode(email);
          setNeedsTwoFactor(true);
          toast({
            title: "2FA Code Sent",
            description: "Please check your email for the verification code. (Demo code: 123456)"
          });
        } else if (success) {
          navigate('/employer/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        const success = await login(email, password, 'employer', twoFactorCode);
        if (success) {
          navigate('/employer/dashboard');
        } else {
          setError('Invalid verification code');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
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
              {isSignup ? 'Create Employer Account' : needsTwoFactor ? 'Verify Your Identity' : 'Employer Login'}
            </CardTitle>
            <CardDescription>
              {isSignup 
                ? 'Partner with us to connect with talented students'
                : needsTwoFactor 
                ? 'Enter the verification code sent to your email'
                : 'Access your employer dashboard to post job opportunities'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!needsTwoFactor && (
                <>
                  {isSignup && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Contact Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          required
                          placeholder="Enter your company name"
                        />
                      </div>
                    </>
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
                </>
              )}

              {needsTwoFactor && (
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Verification Code</span>
                  </Label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    required
                    placeholder="Enter 6-digit code (demo: 123456)"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-600">
                    Demo: Use code <strong>123456</strong>
                  </p>
                </div>
              )}

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
                  : needsTwoFactor 
                  ? 'Verify & Login'
                  : 'Login'
                }
              </Button>
            </form>

            {!needsTwoFactor && (
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
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">Demo Login:</h4>
              <p className="text-sm text-green-700">
                Email: employer@company.com<br />
                Password: employer123<br />
                2FA Code: 123456
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerLogin;
