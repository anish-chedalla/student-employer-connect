
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      const result = await signUp(email, password, fullName, 'student');
      if (result.error) {
        setError(result.error);
      } else {
        toast({
          title: "Account Created",
          description: "Please check your email to confirm your account."
        });
        setIsSignup(false);
      }
    } else {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3 mb-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
            </div>
            <p className="text-gray-600">Launch your career with exclusive job opportunities</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                {isSignup ? 'Create Student Account' : 'Student Login'}
              </CardTitle>
              <CardDescription>
                {isSignup 
                  ? 'Join thousands of students finding their dream jobs'
                  : 'Welcome back! Ready to explore new opportunities?'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@school.edu"
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

                <Button 
                  type="submit" 
                  className="w-full h-11 font-semibold" 
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
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
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
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Student studying"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Your Future Awaits</h2>
          <p className="text-blue-100 max-w-md">Connect with top employers and discover career opportunities tailored to your ambitions and skills.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
