
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, Shield, Users, Briefcase, Clock, ArrowRight, CheckCircle } from "lucide-react";
import SharedLayout from "@/components/layout/SharedLayout";
import FeatureHighlights from "@/components/FeatureHighlights";
import Testimonials from "@/components/Testimonials";

/**
 * Index (Home) Page - Main landing page for the Paradise Valley Pathways platform
 * Features: Hero section, how-it-works explanation, portal access cards,
 * feature highlights, testimonials, and about section
 * Enhanced with animations and improved visual hierarchy
 */
const Index = () => {
  return (
    <SharedLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section with Enhanced Animations */}
        <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop')"
          }} />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/60" />
          
          {/* Main Hero Content with Fade-in Animation */}
          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your pathway to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Career Opportunities
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
              Explore, connect, and apply—right here at PVHS
            </p>
            
            {/* Enhanced CTA Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/student/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in">
                  Find Your Next Job
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/employer/login">
                <Button size="lg" variant="outline" className="bg-gray-600 border-2 border-gray-600 text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* How It Works Section with Enhanced Visual Design */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Paradise Valley Pathways Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to connect students with meaningful career opportunities</p>
            </div>

            {/* For Students Section */}
            <div className="grid gap-16 lg:grid-cols-2 items-center mb-20">
              <div className="space-y-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">For Students</h3>
                  <p className="text-lg text-gray-600">Discover opportunities and launch your career journey</p>
                </div>
                
                {/* Enhanced Step Cards with Icons */}
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Create Your Profile</h4>
                    <p className="text-gray-600">Set up your student profile with your skills, interests, and career goals.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Browse Opportunities</h4>
                    <p className="text-gray-600">Explore verified job postings from local employers in your area of interest.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Apply & Get Hired</h4>
                    <p className="text-gray-600">Submit applications and track your progress through our streamlined process.</p>
                  </div>
                </div>
              </div>

              {/* Student Image with Enhanced Badge */}
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" alt="Student using laptop" className="rounded-2xl shadow-2xl w-full hover-scale" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">Free</div>
                    <div className="text-sm">For Students</div>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employers Section */}
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              {/* Employer Image with Enhanced Badge */}
              <div className="relative order-2 lg:order-1">
                <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop" alt="Professional workspace" className="rounded-2xl shadow-2xl w-full hover-scale" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">Verified</div>
                    <div className="text-sm">For Employers</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">For Employers</h3>
                  <p className="text-lg text-gray-600">Find talented students for your business needs</p>
                </div>
                
                {/* Enhanced Step Cards for Employers */}
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Post Your Jobs</h4>
                    <p className="text-gray-600">Create detailed job postings with requirements and company information.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Get Verified</h4>
                    <p className="text-gray-600">Our admin team reviews and approves postings for quality assurance.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 hover-scale">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Connect with Talent</h4>
                    <p className="text-gray-600">Review applications and connect with pre-screened student candidates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Portal Access Section */}
        <section id="job-postings" className="bg-white py-20 transition-all duration-500 hover:py-32 hover:shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Portal</h2>
              <p className="text-xl text-gray-600">Access the platform that's right for you</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Enhanced Student Portal Card */}
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-blue-700 transition-colors duration-300">Student Portal</CardTitle>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Discover jobs and launch your career</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="space-y-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Browse verified job postings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Apply with resume upload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Track application status</span>
                    </div>
                  </div>
                  <Link to="/student/login" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300 py-3">
                      Access Student Portal
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Enhanced Employer Portal Card */}
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-green-50 to-white hover:from-green-100 hover:to-green-50 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-green-700 transition-colors duration-300">Employer Portal</CardTitle>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    Find talented students for your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="space-y-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Post job opportunities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Access student talent pool</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Manage applications</span>
                    </div>
                  </div>
                  <Link to="/employer/login" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:shadow-lg transition-all duration-300 py-3">
                      Access Employer Portal
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Enhanced Admin Portal Card */}
              <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white hover:from-purple-100 hover:to-purple-50 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-16 w-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-purple-700 transition-colors duration-300">Admin Portal</CardTitle>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    Manage and oversee the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="space-y-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>Review job postings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>Platform analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span>User management</span>
                    </div>
                  </div>
                  <Link to="/admin/login" className="block">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-lg transition-all duration-300 py-3">
                      Access Admin Portal
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Feature Highlights and Testimonials */}
        <div className="bg-gray-50 transition-all duration-500 hover:bg-gray-100 hover:shadow-lg">
          <FeatureHighlights />
        </div>

        <div className="bg-white transition-all duration-500 hover:bg-gray-50 hover:shadow-lg">
          <Testimonials />
        </div>
        
        {/* Enhanced About Section */}
        <section id="about" className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">About Paradise Valley Pathways</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Built specifically for our school's guidance department to bridge the gap between education and employment
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Paradise Valley Pathways was created to solve a simple problem: connecting talented students with meaningful 
                  employment opportunities in their local community. We believe that every student deserves a chance 
                  to gain real-world experience and launch their career.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Through our comprehensive platform, we've streamlined the job search process for students while 
                  providing employers with access to a motivated, pre-screened talent pool.
                </p>
              </div>
              
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop" alt="Students collaborating" className="rounded-2xl shadow-2xl w-full hover-scale" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </SharedLayout>
  );
};

export default Index;
