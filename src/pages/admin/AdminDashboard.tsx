
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from '../../components/AdminSidebar';
import EmployerVerification from './components/EmployerVerification';
import JobManagement from './components/JobManagement';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('employer-verification');

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
            {/* Main Content */}
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
