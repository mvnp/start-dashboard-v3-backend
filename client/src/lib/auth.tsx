import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';

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
  setUser: (user: User | null) => void;
  switchUser: (userId: number) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshData: () => void;
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
      // Invalidate all queries when switching users
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Failed to switch user:', error);
      throw error;
    }
  };

  const refreshData = () => {
    queryClient.invalidateQueries();
  };

  // Enhanced setUser that also refreshes data
  const setUserAndRefresh = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      // Small delay to ensure user context is updated before refreshing data
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 100);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      setUser: setUserAndRefresh, 
      switchUser, 
      getCurrentUser, 
      refreshData 
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