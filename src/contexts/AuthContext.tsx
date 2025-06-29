
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'employer' | 'admin';
  created_at: string;
  updated_at: string;
  verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'employer' | 'admin') => Promise<{ error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Security definer function to fetch user profile (prevents deadlock)
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      if (profileData) {
        const typedProfile: UserProfile = {
          ...profileData,
          role: profileData.role as 'student' | 'employer' | 'admin'
        };
        return typedProfile;
      }
    } catch (error) {
      console.error('Profile fetch exception:', error);
    }
    return null;
  };

  // Function to handle redirects based on user role
  const handleRoleBasedRedirect = (userProfile: UserProfile) => {
    // Only redirect if we're not already on the correct page
    const currentPath = window.location.hash.replace('#/', '');
    
    switch (userProfile.role) {
      case 'admin':
        if (!currentPath.startsWith('admin')) {
          window.location.hash = '#/admin/dashboard';
        }
        break;
      case 'employer':
        if (!currentPath.startsWith('employer')) {
          window.location.hash = '#/employer/dashboard';
        }
        break;
      case 'student':
        if (!currentPath.startsWith('student')) {
          window.location.hash = '#/student/dashboard';
        }
        break;
      default:
        if (currentPath !== '') {
          window.location.hash = '#/';
        }
    }
  };

  useEffect(() => {
    // Clear any potentially corrupted state
    setIsLoading(true);
    
    // Set up auth state listener - ONLY synchronous operations
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profileData => {
              setProfile(profileData);
              setIsLoading(false);
              
              // Only redirect on actual sign-in events, not on page refresh
              if (event === 'SIGNED_IN' && profileData) {
                setTimeout(() => {
                  handleRoleBasedRedirect(profileData);
                }, 100);
              }
            });
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      // Check verification status for employers
      if (data.user) {
        const profileData = await fetchUserProfile(data.user.id);
        if (profileData?.role === 'employer' && !profileData.verified) {
          // Sign out the user immediately
          await supabase.auth.signOut();
          setIsLoading(false);
          return { error: 'Your employer account is pending verification. Please wait for admin approval before logging in.' };
        }
      }

      // Don't set loading to false here - let the auth state change handle it
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'employer' | 'admin') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/#/`,
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      setIsLoading(false);
      return {};
    } catch (error) {
      setIsLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsLoading(false);
      
      // Use hash-based navigation for GitHub Pages compatibility
      window.location.hash = '#/';
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Failed to logout:', error);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    login,
    logout,
    signUp,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
