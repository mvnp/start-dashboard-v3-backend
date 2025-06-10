import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  email: string;
  roleId: number;
  businessIds: number[];
  isSuperAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  switchUser: (userId: number) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const response = await apiRequest('GET', '/api/user');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to get current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (userId: number) => {
    try {
      const response = await apiRequest('POST', '/api/switch-user', { userId });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to switch user:', error);
      throw error;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, switchUser, getCurrentUser }}>
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