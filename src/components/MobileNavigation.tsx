
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'job-postings', label: 'Job Postings', href: '#job-postings' },
    { id: 'submit-job', label: 'Submit a Job', href: '/employer/login' },
    { id: 'apply', label: 'Apply', href: '/student/login' },
    { id: 'admin', label: 'Admin', href: '/admin/login' },
    { id: 'about', label: 'About', href: '#about' }
  ];

  if (!isMobile) {
    return null; // Let desktop navigation handle non-mobile screens
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">SchoolConnect</span>
        </div>
        
        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center space-x-3 mb-8">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">SchoolConnect</span>
              </div>
              
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-lg font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="text-lg font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNavigation;
