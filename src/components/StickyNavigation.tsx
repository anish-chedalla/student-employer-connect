
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronDown } from 'lucide-react';

const StickyNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'job-postings', 'features', 'testimonials', 'about'];
      const scrollPosition = window.scrollY + 100;
      
      // Check if scrolled past hero section
      setIsScrolled(window.scrollY > 50);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'job-postings', label: 'Job Postings', href: '#job-postings' },
    { id: 'submit-job', label: 'Submit a Job', href: '/employer/login' },
    { id: 'apply', label: 'Apply', href: '/student/login' },
    { id: 'admin', label: 'Admin', href: '/admin/login' },
    { id: 'about', label: 'About', href: '#about' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-full mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo - Almost Far Left */}
          <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
            <GraduationCap className={`h-6 w-6 transition-colors duration-300 ${
              isScrolled ? 'text-blue-600' : 'text-white'
            }`} />
            <span className={`text-lg font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              SchoolConnect
            </span>
          </div>
          
          {/* Navigation Items - Close to Right */}
          <div className="hidden md:flex items-center space-x-8 mr-2">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? activeSection === item.id 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                      : activeSection === item.id
                        ? 'text-blue-300'
                        : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`text-base font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Legal Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsLegalDropdownOpen(true)}
              onMouseLeave={() => setIsLegalDropdownOpen(false)}
            >
              <button
                className={`flex items-center text-base font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Legal
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  isLegalDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isLegalDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/legal/terms"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Terms of Use
                  </Link>
                  <Link
                    to="/legal/privacy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNavigation;
