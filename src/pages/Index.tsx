import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, Shield, Users, Briefcase, Clock } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SchoolConnect</h1>
                <p className="text-sm text-gray-600">Career Services Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden sm:flex">
                FBLA 2024-25
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Active Students</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">150+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Partner Employers</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center space-x-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">200+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Job Placements</p>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Choose Your Portal
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {/* Student Portal */}
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Student Portal</CardTitle>
                <CardDescription>Browse job opportunities, submit applications, and track your career</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6">
                  ✓ Browse approved job postings<br />
                  ✓ Apply with resume upload<br />
                  ✓ Track application status
                </div>
                <Link to="/student/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Student Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Employer Portal */}
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Employer Portal</CardTitle>
                <CardDescription>
                  Post job opportunities and connect with talented students
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6">
                  ✓ Submit job postings<br />
                  ✓ Track posting status<br />
                  ✓ Connect with students
                </div>
                <Link to="/employer/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Employer Login
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Portal */}
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Admin Portal</CardTitle>
                <CardDescription>
                  Manage job postings and oversee the career services platform
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-1 flex flex-col justify-between">
                <div className="text-sm text-gray-600 mb-6">
                  ✓ Review job postings<br />
                  ✓ Platform analytics<br />
                  ✓ User management
                </div>
                <Link to="/admin/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose SchoolConnect?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built specifically for our school's guidance department
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Students</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  Real-time job posting updates from verified employers
                </li>
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  Secure application process with resume upload
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  Direct connection with guidance counselors
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Employers</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <GraduationCap className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  Access to pre-screened student talent pool
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  Streamlined job posting and applicant management
                </li>
                <li className="flex items-start">
                  <Building2 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  Partnership with educational institution values
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 SchoolConnect Career Services Portal. Built for FBLA Website Coding & Development Competition.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Developed with ❤️ for our school's guidance department
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;