import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface User {
  userId: number;
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      // Check if localStorage is available
      if (typeof Storage === "undefined" || !window.localStorage) {
        setUser(null);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Token might be expired, try to refresh
        await refreshAccessToken();
        return;
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to get current user:', error);
      setUser(null);
      // Clear tokens if authentication fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setUser(null);
        return;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Retry getting current user with new token
      await getCurrentUser();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const switchUser = async (userId: number) => {
    // JWT authentication doesn't support user switching in the same way
    // This would require re-authentication with different credentials
    console.warn('User switching not implemented for JWT authentication');
    throw new Error('User switching requires re-authentication with JWT');
  };

  const refreshData = () => {
    queryClient.invalidateQueries();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('selectedBusinessId');
    setUser(null);
    queryClient.clear();
    window.location.href = '/login';
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
      refreshData,
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