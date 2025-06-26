
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import StickyNavigation from '../StickyNavigation';
import MobileNavigation from '../MobileNavigation';
import Footer from '../Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface SharedLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

/**
 * SharedLayout component provides consistent header/footer across all pages
 * Automatically detects mobile vs desktop and renders appropriate navigation
 * Supports conditional navigation/footer display for special pages
 */
const SharedLayout = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}: SharedLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determine if we're on a dashboard page (different layout requirements)
  const isDashboardPage = location.pathname.includes('/dashboard');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Navigation - mobile vs desktop, dashboard vs regular pages */}
      {showNavigation && !isDashboardPage && (
        <>
          {isMobile ? <MobileNavigation /> : <StickyNavigation />}
        </>
      )}
      
      {/* Main Content Area - flex-1 ensures it takes remaining space */}
      <main className={`flex-1 ${showNavigation && !isDashboardPage ? (isMobile ? 'pt-16' : 'pt-0') : ''}`}>
        {children}
      </main>
      
      {/* Conditional Footer */}
      {showFooter && !isDashboardPage && <Footer />}
    </div>
  );
};

export default SharedLayout;
