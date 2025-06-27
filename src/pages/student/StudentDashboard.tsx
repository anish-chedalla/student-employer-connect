
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from '../../components/StudentSidebar';
import JobSearch from './components/JobSearch';
import MyApplications from './components/MyApplications';
import { ResumeUpload } from '../../components/student/ResumeUpload';
import MobileStudentDropdown from '../../components/MobileStudentDropdown';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('job-search');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case 'job-search':
        return <JobSearch />;
      case 'my-applications':
        return <MyApplications />;
      case 'resume-upload':
        return <ResumeUpload />;
      default:
        return <JobSearch />;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <MobileStudentDropdown 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <div className="pt-16 p-6">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <StudentSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SidebarInset>
          <div className="p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
