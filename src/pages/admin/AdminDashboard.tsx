
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import JobManagement from './components/JobManagement';
import EmployerVerification from './components/EmployerVerification';
import { 
  Briefcase,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const { profile, logout } = useAuth();
  const { jobs } = useJobs();
  const [activeSection, setActiveSection] = useState('overview');
  const [employerCount, setEmployerCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const approvedJobs = jobs.filter(job => job.status === 'approved');
  const rejectedJobs = jobs.filter(job => job.status === 'rejected');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count verified employers
        const { count: employerCountResult } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'employer')
          .eq('verified', true);

        // Count students
        const { count: studentCountResult } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'student');

        setEmployerCount(employerCountResult || 0);
        setStudentCount(studentCountResult || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BarChart3,
    },
    {
      id: 'jobs',
      title: 'Job Management',
      icon: Briefcase,
    },
    {
      id: 'employers',
      title: 'Employer Verification',
      icon: Users,
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
              <p className="text-muted-foreground">
                Welcome back, {profile?.full_name}. Here's what's happening today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All job postings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Shield className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{pendingJobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedJobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Live on platform
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <Shield className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{rejectedJobs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Not approved
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingJobs.slice(0, 5).map(job => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    ))}
                    {pendingJobs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending jobs to review
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>
                    Real-time platform metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Active Students</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{studentCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Verified Employers</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{employerCount}</span>
                  </div>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveSection('jobs')}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Review Jobs
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveSection('employers')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Verify Employers
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'jobs':
        return <JobManagement />;
      case 'employers':
        return <EmployerVerification />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">JobHub Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold">
                  {menuItems.find(item => item.id === activeSection)?.title || 'Dashboard'}
                </h1>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4 pt-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
