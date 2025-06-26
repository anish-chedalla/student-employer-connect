
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">SchoolConnect</span>
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-green-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At SchoolConnect, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We may collect the following personal information:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Name, email address, and contact information</li>
              <li>Educational background and academic records</li>
              <li>Resume and portfolio information</li>
              <li>Employment history and preferences</li>
              <li>Skills and qualifications</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Technical Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We automatically collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and platform interactions</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Facilitate connections between students and employers</li>
              <li>Personalize your experience and job recommendations</li>
              <li>Communicate important updates and notifications</li>
              <li>Improve our platform and develop new features</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We may share your information with:</p>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">Employers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you apply for positions, relevant profile information and application materials are shared with employers.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">School Administration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Aggregated, non-personal data may be shared with school administrators for program evaluation and improvement.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Trusted third-party services that help us operate the platform, subject to strict confidentiality agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We implement robust security measures including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication systems</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your account and associated data</li>
              <li>Control communication preferences</li>
              <li>Opt-out of certain data collection practices</li>
              <li>Request data portability where applicable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
              personalized content. You can control cookie settings through your browser preferences, though some 
              platform features may be limited if cookies are disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to provide our services and comply with 
              legal obligations. Account data is typically retained for the duration of your enrollment and may be 
              archived for a reasonable period thereafter for legitimate business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform may contain links to third-party websites or services. We are not responsible for the 
              privacy practices of these external sites and encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibent text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
              We will notify users of significant changes and update the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your personal information, 
              please contact us through the platform's support channels or reach out to your school's 
              career services department.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
