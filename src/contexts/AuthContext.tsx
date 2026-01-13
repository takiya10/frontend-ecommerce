import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetcher } from '@/lib/api-client';
import { toast } from 'sonner';
import { User } from '@/types';

interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: Record<string, string>) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data on mount
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: Record<string, string>) => {
    try {
      const response = await fetcher<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      
      toast.success(response.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      console.error("Login error:", error);
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: Record<string, string>) => {
    try {
      const response = await fetcher<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      toast.success(response.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed";
      console.error("Register error:", error);
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
