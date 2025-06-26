
import { useState } from 'react';
import { Menu, User, Briefcase, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '../contexts/AuthContext';

interface MobileStudentDropdownProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileStudentDropdown = ({ activeSection, onSectionChange }: MobileStudentDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, logout } = useAuth();

  const browseItems = [
    {
      title: "Job Search",
      id: "job-search",
      icon: Briefcase,
    }
  ];

  const applicationItems = [
    {
      title: "Accepted",
      id: "accepted-applications",
      icon: CheckCircle,
    },
    {
      title: "Rejected",
      id: "rejected-applications",
      icon: XCircle,
    },
    {
      title: "Pending",
      id: "pending-applications",
      icon: Clock,
    }
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="bg-white shadow-lg border"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open student menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center space-x-2 py-4 border-b">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Student</h2>
                <p className="text-sm text-gray-600">{profile?.full_name}</p>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 py-4">
              <div className="space-y-4">
                {/* Browse Jobs Section */}
                <div>
                  <p className="text-sm font-medium text-gray-500 px-2 mb-2">Browse Jobs</p>
                  <div className="space-y-1">
                    {browseItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-12"
                        onClick={() => handleSectionChange(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span>{item.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* My Applications Section */}
                <div>
                  <p className="text-sm font-medium text-gray-500 px-2 mb-2">My Applications</p>
                  <div className="space-y-1">
                    {applicationItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start h-12"
                        onClick={() => handleSectionChange(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span>{item.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={logout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-12"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileStudentDropdown;
