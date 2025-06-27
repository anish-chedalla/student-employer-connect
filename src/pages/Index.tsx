
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Briefcase, Shield, Search, CheckCircle, Star } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🎓 Connecting Students with Opportunities
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Gateway to 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Dream Jobs</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Connect talented students with forward-thinking employers. 
            Whether you're seeking your first opportunity or looking to hire the next generation of talent.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/student/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Find Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/employer/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-8 py-4 text-lg"
              >
                Post Jobs
                <Briefcase className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'students'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                For Students
              </button>
              <button
                onClick={() => setActiveTab('employers')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'employers'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Briefcase className="inline-block w-4 h-4 mr-2" />
                For Employers
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'students' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Search className="h-10 w-10 text-blue-600 mb-4" />
                  <CardTitle>Smart Job Search</CardTitle>
                  <CardDescription>
                    Advanced filtering and search capabilities to find opportunities that match your skills and interests.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                  <CardTitle>Easy Applications</CardTitle>
                  <CardDescription>
                    Streamlined application process with resume management and real-time status tracking.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Star className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Quality Opportunities</CardTitle>
                  <CardDescription>
                    All job postings are reviewed and verified to ensure legitimate, quality opportunities.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {activeTab === 'employers' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-600 mb-4" />
                  <CardTitle>Talented Pool</CardTitle>
                  <CardDescription>
                    Access to a curated network of motivated students and recent graduates across various fields.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-10 w-10 text-green-600 mb-4" />
                  <CardTitle>Verified Profiles</CardTitle>
                  <CardDescription>
                    All student profiles are verified through our institutional partnerships for authenticity.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Briefcase className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Easy Management</CardTitle>
                  <CardDescription>
                    Comprehensive dashboard to manage job postings, review applications, and communicate with candidates.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of students and employers already using our platform.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up as Student
              </Button>
            </Link>
            <Link to="/employer/login">
              <Button size="lg" variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
                Sign Up as Employer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
