
import { useState } from 'react';
import { Menu, Shield, UserCheck, FileText, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '../contexts/AuthContext';

interface MobileAdminDropdownProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileAdminDropdown = ({ activeSection, onSectionChange }: MobileAdminDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, profile } = useAuth();

  const menuItems = [
    {
      title: "Employer Verification",
      id: "employer-verification",
      icon: UserCheck,
    },
    {
      title: "Job Management",
      id: "job-management", 
      icon: FileText,
    },
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
            <span className="sr-only">Open admin menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center space-x-2 py-4 border-b">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Admin</h2>
                <p className="text-sm text-gray-600">{profile?.full_name}</p>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 px-2 mb-4">Administration</p>
                {menuItems.map((item) => (
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

export default MobileAdminDropdown;
