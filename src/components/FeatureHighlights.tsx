
import { Shield, Smartphone, Clock, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureHighlights = () => {
  const features = [
    {
      icon: FileCheck,
      title: 'Real-time Posting Approval',
      description: 'Job postings are reviewed and approved instantly by our admin team for quality assurance.',
      color: 'text-blue-600',
      hoverColor: 'blue'
    },
    {
      icon: Shield,
      title: '2FA-Enabled Login System',
      description: 'Multi-tier authentication system with role-based access for students, employers, and administrators.',
      color: 'text-green-600',
      hoverColor: 'green'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive Design',
      description: 'Fully optimized experience across all devices - desktop, tablet, and mobile.',
      color: 'text-purple-600',
      hoverColor: 'purple'
    },
    {
      icon: Clock,
      title: 'Easy Application Tracking',
      description: 'Track your job applications in real-time with status updates and notifications.',
      color: 'text-orange-600',
      hoverColor: 'orange'
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
            <Card 
              key={index} 
              className={`text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-${feature.hoverColor}-100 hover:bg-gradient-to-br hover:from-${feature.hoverColor}-50 hover:to-white hover:ring-2 hover:ring-${feature.hoverColor}-200 group cursor-pointer`}
            >
              <CardHeader>
                <div className={`mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${feature.hoverColor}-200 group-hover:shadow-lg transition-all duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <CardTitle className={`text-lg group-hover:text-${feature.hoverColor}-700 transition-colors duration-300`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm group-hover:text-gray-700 transition-colors duration-300">
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
