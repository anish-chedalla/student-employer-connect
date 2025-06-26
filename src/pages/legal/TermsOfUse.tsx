
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">SchoolConnect</span>
          </div>
          <h1 className="text-4xl font-bold">Terms of Use</h1>
          <p className="text-blue-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using SchoolConnect, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Platform Purpose</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SchoolConnect is designed to connect students with local employment opportunities. The platform serves three types of users:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Students:</strong> Can browse and apply for job opportunities</li>
              <li><strong>Employers:</strong> Can post job opportunities and review applications</li>
              <li><strong>Administrators:</strong> Oversee and manage platform operations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Users agree to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of their account credentials</li>
              <li>Use the platform for legitimate career and employment purposes only</li>
              <li>Respect the rights and privacy of other users</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Users may not:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Engage in discriminatory practices based on protected characteristics</li>
              <li>Use the platform for solicitation or spam</li>
              <li>Attempt to gain unauthorized access to other user accounts</li>
              <li>Interfere with the proper functioning of the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              Users retain ownership of the content they submit but grant SchoolConnect a non-exclusive license to use, 
              display, and distribute such content for platform operations. SchoolConnect reserves all rights to its 
              proprietary content, including but not limited to the platform design, features, and functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your personal information. By using SchoolConnect, you consent to the collection 
              and use of your information as outlined in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              SchoolConnect provides the platform "as is" without warranties of any kind. We are not responsible 
              for the accuracy of job postings, the conduct of users, or the outcome of employment relationships 
              formed through the platform. Users engage with employers and job opportunities at their own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              SchoolConnect reserves the right to suspend or terminate user accounts at our discretion, 
              particularly in cases of violation of these terms. Users may also deactivate their accounts 
              at any time through their account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Users will be notified of significant 
              changes, and continued use of the platform constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Use, please contact us through the platform's 
              support channels or reach out to your school's career services department.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
