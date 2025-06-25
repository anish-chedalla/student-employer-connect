
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const StickyNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'job-postings', 'features', 'testimonials', 'about'];
      const scrollPosition = window.scrollY + 100;

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
    { id: 'admin', label: 'Admin Panel', href: '/admin/login' },
    { id: 'about', label: 'About', href: '#about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">SchoolConnect</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeSection === item.id ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyNavigation;
