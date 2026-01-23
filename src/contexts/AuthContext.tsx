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
  adminUser: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  login: (data: Record<string, string>, isAdmin?: boolean) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: (isAdminLogout?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state synchronously from localStorage to avoid FOUC
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_data');
      if (token && storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("User session corrupt", e);
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState<User | null>(() => {
    try {
      const adminToken = localStorage.getItem('admin_access_token');
      const storedAdmin = localStorage.getItem('admin_user_data');
      if (adminToken && storedAdmin && storedAdmin !== "undefined") {
        return JSON.parse(storedAdmin);
      }
    } catch (e) {
      console.error("Admin session corrupt", e);
    }
    return null;
  });

  // Since we initialize synchronously, we are "loaded" immediately
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: Record<string, string>, isAdminLogin = false) => {
    try {
      const response = await fetcher<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (isAdminLogin && response.user.role !== 'ADMIN') {
        throw new Error("You do not have administrative privileges.");
      }

      if (response.user.role === 'ADMIN') {
        localStorage.setItem('admin_access_token', response.access_token);
        localStorage.setItem('admin_user_data', JSON.stringify(response.user));
        setAdminUser(response.user);
      } else {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        setUser(response.user);
      }

      toast.success(response.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = (isAdminLogout = false) => {
    if (isAdminLogout) {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user_data');
      setAdminUser(null);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      setUser(null);
    }
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{
      user: user,
      adminUser: adminUser,
      isAuthenticated: !!user,
      isAdminAuthenticated: !!adminUser,
      isLoading,
      login,
      register: async (data) => {
        const res = await fetcher<RegisterResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
        toast.success(res.message);
      },
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
