
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { JobProvider } from "./contexts/JobContext";
import Index from "./pages/Index";
import StudentLogin from "./pages/auth/StudentLogin";
import EmployerLogin from "./pages/auth/EmployerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TermsOfUse from "./pages/legal/TermsOfUse";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <JobProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Authentication Routes */}
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/employer/login" element={<EmployerLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Legal Routes */}
              <Route path="/legal/terms" element={<TermsOfUse />} />
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />
              
              {/* Protected Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected Employer Routes */}
              <Route path="/employer/dashboard" element={
                <ProtectedRoute allowedRoles={['employer']}>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </JobProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
