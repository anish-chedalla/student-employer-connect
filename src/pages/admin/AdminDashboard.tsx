
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from '../../components/AdminSidebar';
import { EmployerVerification } from './components/EmployerVerification';
import { JobManagement } from './components/JobManagement';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('employer-verification');

  // Get section titles
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'employer-verification':
        return 'Employer Verification';
      case 'job-management':
        return 'Job Management';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'employer-verification':
        return <EmployerVerification />;
      case 'job-management':
        return <JobManagement />;
      default:
        return <EmployerVerification />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset>
          <div className="p-6">
            {/* Section Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h1>
              <p className="text-gray-600 mt-2">
                {activeSection === 'employer-verification' && 'Review and approve employer registration requests'}
                {activeSection === 'job-management' && 'Manage and moderate job postings'}
              </p>
            </div>

            {/* Main Content */}
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
