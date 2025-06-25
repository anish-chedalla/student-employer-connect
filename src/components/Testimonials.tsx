
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'High School Senior',
      quote: 'SchoolConnect helped me find my first part-time job at a local marketing firm. The application process was so simple and the guidance counselors were incredibly supportive throughout.',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      isHighlighted: true
    },
    {
      name: 'Michael Rodriguez',
      role: 'Local Business Owner',
      quote: 'As a small business owner, finding reliable student workers used to be challenging. This platform connects us with motivated students who are eager to learn and contribute.',
      avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=150&h=150&fit=crop&crop=face',
      isHighlighted: false
    },
    {
      name: 'Emma Thompson',
      role: 'Junior Student',
      quote: 'I love how easy it is to track my applications and see new job postings. The mobile app works perfectly and I can apply on the go between classes.',
      avatar: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=150&h=150&fit=crop&crop=face',
      isHighlighted: false
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students and employers who have found success through SchoolConnect
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-100 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group cursor-pointer ${
                testimonial.isHighlighted 
                  ? 'scale-105 shadow-lg shadow-blue-100 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-200' 
                  : 'hover:ring-2 hover:ring-blue-200'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className={`w-12 h-12 rounded-full object-cover mr-4 transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-300 group-hover:ring-offset-2 ${
                      testimonial.isHighlighted ? 'ring-2 ring-blue-300 ring-offset-2' : ''
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                      {testimonial.role}
                    </Badge>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic group-hover:text-gray-700 transition-colors duration-300">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
