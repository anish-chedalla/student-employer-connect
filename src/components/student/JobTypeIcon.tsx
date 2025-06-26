
import { 
  Code, 
  Briefcase, 
  Stethoscope, 
  Calculator, 
  Palette, 
  Wrench, 
  ShoppingCart, 
  Users, 
  Building2,
  GraduationCap,
  Truck,
  Coffee
} from 'lucide-react';

interface JobTypeIconProps {
  jobTitle: string;
  company: string;
  className?: string;
}

/**
 * JobTypeIcon component automatically selects appropriate icons based on job title and company
 * Uses keyword matching to determine the most relevant icon for each job posting
 * Provides visual cues to help users quickly identify job categories
 */
const JobTypeIcon = ({ jobTitle, company, className = "h-6 w-6" }: JobTypeIconProps) => {
  // Convert job title and company to lowercase for keyword matching
  const searchText = `${jobTitle} ${company}`.toLowerCase();
  
  // Icon mapping based on keywords found in job titles/companies
  // Each category includes multiple keywords to improve matching accuracy
  const getJobIcon = () => {
    // Technology & Programming
    if (searchText.includes('software') || searchText.includes('developer') || 
        searchText.includes('programmer') || searchText.includes('tech') ||
        searchText.includes('coding') || searchText.includes('web')) {
      return <Code className={`${className} text-blue-600`} />;
    }
    
    // Healthcare & Medical
    if (searchText.includes('medical') || searchText.includes('nurse') || 
        searchText.includes('doctor') || searchText.includes('health') ||
        searchText.includes('hospital') || searchText.includes('clinic')) {
      return <Stethoscope className={`${className} text-red-600`} />;
    }
    
    // Finance & Accounting
    if (searchText.includes('finance') || searchText.includes('accounting') || 
        searchText.includes('bank') || searchText.includes('analyst') ||
        searchText.includes('bookkeeper') || searchText.includes('tax')) {
      return <Calculator className={`${className} text-green-600`} />;
    }
    
    // Design & Creative
    if (searchText.includes('design') || searchText.includes('creative') || 
        searchText.includes('artist') || searchText.includes('graphic') ||
        searchText.includes('marketing') || searchText.includes('brand')) {
      return <Palette className={`${className} text-purple-600`} />;
    }
    
    // Trades & Manual Labor
    if (searchText.includes('mechanic') || searchText.includes('construction') || 
        searchText.includes('electrician') || searchText.includes('plumber') ||
        searchText.includes('maintenance') || searchText.includes('repair')) {
      return <Wrench className={`${className} text-orange-600`} />;
    }
    
    // Retail & Sales
    if (searchText.includes('retail') || searchText.includes('sales') || 
        searchText.includes('cashier') || searchText.includes('store') ||
        searchText.includes('customer service') || searchText.includes('shop')) {
      return <ShoppingCart className={`${className} text-pink-600`} />;
    }
    
    // Education & Training
    if (searchText.includes('teacher') || searchText.includes('tutor') || 
        searchText.includes('education') || searchText.includes('school') ||
        searchText.includes('instructor') || searchText.includes('training')) {
      return <GraduationCap className={`${className} text-indigo-600`} />;
    }
    
    // Transportation & Logistics
    if (searchText.includes('driver') || searchText.includes('delivery') || 
        searchText.includes('transport') || searchText.includes('logistics') ||
        searchText.includes('shipping') || searchText.includes('warehouse')) {
      return <Truck className={`${className} text-yellow-600`} />;
    }
    
    // Food Service & Hospitality
    if (searchText.includes('restaurant') || searchText.includes('server') || 
        searchText.includes('chef') || searchText.includes('food') ||
        searchText.includes('hospitality') || searchText.includes('hotel')) {
      return <Coffee className={`${className} text-amber-600`} />;
    }
    
    // Human Resources & Management
    if (searchText.includes('manager') || searchText.includes('hr') || 
        searchText.includes('human resources') || searchText.includes('admin') ||
        searchText.includes('coordinator') || searchText.includes('supervisor')) {
      return <Users className={`${className} text-teal-600`} />;
    }
    
    // Default business/office icon for unmatched categories
    return <Briefcase className={`${className} text-gray-600`} />;
  };

  return getJobIcon();
};

export default JobTypeIcon;
