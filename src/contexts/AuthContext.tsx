
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  name: string;
  verified2FA: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string, twoFactorCode?: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'student' | 'employer') => Promise<boolean>;
  send2FACode: (email: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - TODO: Replace with real backend
const mockUsers = [
  {
    id: '1',
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin' as const,
    name: 'System Administrator',
    verified2FA: true
  },
  {
    id: '2',
    email: 'student@school.edu',
    password: 'student123',
    role: 'student' as const,
    name: 'John Student',
    verified2FA: true
  },
  {
    id: '3',
    email: 'employer@company.com',
    password: 'employer123',
    role: 'employer' as const,
    name: 'Jane Employer',
    verified2FA: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: string, twoFactorCode?: string): Promise<boolean> => {
    setIsLoading(true);
    
    // TODO: Replace with real API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
      );
      
      if (foundUser) {
        // Simulate 2FA verification
        if (twoFactorCode && twoFactorCode === '123456') {
          const userSession = {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role,
            name: foundUser.name,
            verified2FA: true
          };
          
          setUser(userSession);
          localStorage.setItem('currentUser', JSON.stringify(userSession));
          return true;
        } else if (!twoFactorCode) {
          // First step of login - send 2FA code
          return false; // Indicates 2FA code needed
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'employer'): Promise<boolean> => {
    setIsLoading(true);
    
    // TODO: Replace with real API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return false;
      }
      
      // Create new user (in real app, this would be stored in database)
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        role,
        name,
        verified2FA: false
      };
      
      mockUsers.push(newUser);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const send2FACode = async (email: string): Promise<boolean> => {
    // TODO: Replace with real API call to send 2FA code
    console.log(`Sending 2FA code to ${email}`);
    // Mock: In real implementation, this would send an email with code "123456"
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    signup,
    send2FACode,
    isLoading
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
