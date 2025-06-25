
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, Shield, Users, Briefcase, Clock } from "lucide-react";
import StickyNavigation from "@/components/StickyNavigation";
import FeatureHighlights from "@/components/FeatureHighlights";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <StickyNavigation />
      
      {/* Hero Section */}
      <div id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Connect Students with
            <span className="text-blue-600"> Career Opportunities</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Our guidance department's job portal connects ambitious students with local employers, 
            creating pathways to meaningful career experiences and professional growth.
          </p>
          
          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-100 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:ring-2 hover:ring-blue-200 group cursor-pointer">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">500+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">Active Students</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-green-100 hover:bg-gradient-to-br hover:from-green-50 hover:to-white hover:ring-2 hover:ring-green-200 group cursor-pointer">
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">150+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">Partner Employers</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-purple-100 hover:bg-gradient-to-br hover:from-purple-50 hover:to-white hover:ring-2 hover:ring-purple-200 group cursor-pointer">
              <div className="flex items-center justify-center space-x-2">
                <Briefcase className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">200+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">Job Placements</p>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div id="job-postings" className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Choose Your Portal
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {/* Student Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:ring-2 hover:ring-blue-200 h-full flex flex-col group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 group-hover:shadow-lg transition-all duration-300">
                  <GraduationCap className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-700 transition-colors duration-300">Student Portal</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors duration-300">Browse job opportunities, submit applications, and track your career</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  ✓ Browse approved job postings<br />
                  ✓ Apply with resume upload<br />
                  ✓ Track application status
                </div>
                <Link to="/student/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300">
                    Student Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Employer Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-br hover:from-green-50 hover:to-white hover:ring-2 hover:ring-green-200 h-full flex flex-col group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 group-hover:shadow-lg transition-all duration-300">
                  <Building2 className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-green-700 transition-colors duration-300">Employer Portal</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors duration-300">
                  Post job opportunities and connect with talented students
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  ✓ Submit job postings<br />
                  ✓ Track posting status<br />
                  ✓ Connect with students
                </div>
                <Link to="/employer/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:shadow-lg transition-all duration-300">
                    Employer Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-br hover:from-purple-50 hover:to-white hover:ring-2 hover:ring-purple-200 h-full flex flex-col group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 group-hover:shadow-lg transition-all duration-300">
                  <Shield className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-purple-700 transition-colors duration-300">Admin Portal</CardTitle>
                <CardDescription className="group-hover:text-gray-700 transition-colors duration-300">
                  Manage job postings and oversee the career services platform
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                  ✓ Review job postings<br />
                  ✓ Platform analytics<br />
                  ✓ User management
                </div>
                <Link to="/admin/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-lg transition-all duration-300">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div id="about" className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose SchoolConnect?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for our school's guidance department
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-xl p-8 shadow-sm border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-100 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:ring-2 hover:ring-blue-200 group cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">For Students</h3>
              <ul className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Real-time job posting updates from verified employers
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Secure application process with resume upload
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Direct connection with guidance counselors
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-green-100 hover:bg-gradient-to-br hover:from-green-50 hover:to-white hover:ring-2 hover:ring-green-200 group cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">For Employers</h3>
              <ul className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                <li className="flex items-start">
                  <GraduationCap className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Access to pre-screened student talent pool
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Streamlined job posting and applicant management
                </li>
                <li className="flex items-start">
                  <Building2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  Partnership with educational institution values
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FeatureHighlights />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
