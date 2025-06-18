import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { safeGetLocalStorage, safeSetLocalStorage, safeRemoveLocalStorage } from './safe-storage';

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
      const token = safeGetLocalStorage('accessToken');
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
      safeRemoveLocalStorage('accessToken');
      safeRemoveLocalStorage('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = safeGetLocalStorage('refreshToken');
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
      safeSetLocalStorage('accessToken', data.accessToken);
      safeSetLocalStorage('refreshToken', data.refreshToken);
      
      // Retry getting current user with new token
      await getCurrentUser();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
      safeRemoveLocalStorage('accessToken');
      safeRemoveLocalStorage('refreshToken');
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
    safeRemoveLocalStorage('accessToken');
    safeRemoveLocalStorage('refreshToken');
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

  // Enhanced initialization with retry logic
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        await getCurrentUser();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        // If initialization fails, try refreshing token once
        const refreshToken = safeGetLocalStorage('refreshToken');
        if (refreshToken) {
          try {
            await refreshAccessToken();
          } catch (refreshError) {
            console.error('Failed to refresh token during initialization:', refreshError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
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