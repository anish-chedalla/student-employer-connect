import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">SchoolConnect</h3>
                <p className="text-sm text-gray-400">Career Services Portal</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting students with meaningful career opportunities through our 
              comprehensive job placement platform.
            </p>
            <p className="text-sm text-gray-500">
              Built for FBLA Website Coding & Development 2025
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Paradise Valley HS</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>ideonise@pvlearners.net</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(602) 449-7000</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>3950 E. Bell Road</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/terms" className="block hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link to="/privacy" className="block hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/student/login" className="block hover:text-white transition-colors">
                Student Portal
              </Link>
              <Link to="/employer/login" className="block hover:text-white transition-colors">
                Employer Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2025 SchoolConnect Career Services Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;