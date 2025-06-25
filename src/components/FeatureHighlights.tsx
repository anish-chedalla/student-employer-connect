
import { Shield, Smartphone, Clock, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureHighlights = () => {
  const features = [
    {
      icon: FileCheck,
      title: 'Real-time Posting Approval',
      description: 'Job postings are reviewed and approved instantly by our admin team for quality assurance.',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: '2FA-Enabled Login System',
      description: 'Multi-tier authentication system with role-based access for students, employers, and administrators.',
      color: 'text-green-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive Design',
      description: 'Fully optimized experience across all devices - desktop, tablet, and mobile.',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Easy Application Tracking',
      description: 'Track your job applications in real-time with status updates and notifications.',
      color: 'text-orange-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with user-friendly design to deliver 
            the best career services experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
