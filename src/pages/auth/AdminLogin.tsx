
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
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>
              Secure access to the career services administration panel
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {isLoading ? 'Logging in...' : 'Admin Login'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Credentials</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Email:</strong> admin@schoolconnect.edu</p>
                <p><strong>Password:</strong> SchoolConnect2024!</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These credentials are provided for school administration access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
