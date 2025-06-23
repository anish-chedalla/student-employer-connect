
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState('');
  
  const { login, send2FACode, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!needsTwoFactor) {
      const success = await login(email, password, 'admin');
      if (success === false && !needsTwoFactor) {
        await send2FACode(email);
        setNeedsTwoFactor(true);
        toast({
          title: "2FA Code Sent",
          description: "Please check your email for the verification code. (Demo code: 123456)"
        });
      } else if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const success = await login(email, password, 'admin', twoFactorCode);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid verification code');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {needsTwoFactor ? 'Verify Admin Access' : 'Administrator Login'}
            </CardTitle>
            <CardDescription>
              {needsTwoFactor 
                ? 'Enter the verification code sent to your email'
                : 'Secure access to the career services administration panel'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!needsTwoFactor && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@school.edu"
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
                      placeholder="Enter admin password"
                    />
                  </div>
                </>
              )}

              {needsTwoFactor && (
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Admin Verification Code</span>
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
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Verifying...' 
                  : needsTwoFactor 
                  ? 'Verify & Access Admin Panel'
                  : 'Admin Login'
                }
              </Button>
            </form>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm font-medium text-purple-900 mb-2">Demo Admin Access:</h4>
              <p className="text-sm text-purple-700">
                Email: admin@school.edu<br />
                Password: admin123<br />
                2FA Code: 123456
              </p>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <Shield className="h-3 w-3 inline mr-1" />
                Admin access is restricted to authorized personnel only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
