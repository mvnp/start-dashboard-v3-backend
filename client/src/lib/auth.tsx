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
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, try to refresh
          await refreshAccessToken();
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUser(data.user);
      console.log('Successfully restored user session:', data.user.email);
    } catch (error) {
      console.error('Failed to get current user:', error);
      setUser(null);
      // Clear tokens if authentication fails
      safeRemoveLocalStorage('accessToken');
      safeRemoveLocalStorage('refreshToken');
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
    // Clear all localStorage data
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Could not clear localStorage:', error);
      // Fallback: remove specific keys
      safeRemoveLocalStorage('accessToken');
      safeRemoveLocalStorage('refreshToken');
      safeRemoveLocalStorage('lastUserId');
      // Remove all business-specific keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('selectedBusinessId_') || key.startsWith('businessLanguage_') || key.startsWith('editionMode')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Clear all sessionStorage data
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Could not clear sessionStorage:', error);
    }
    
    setUser(null);
    queryClient.clear();
    console.log('Logout completed - all storage cleared');
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

  // Initialize authentication - restore session if valid tokens exist
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      const accessToken = safeGetLocalStorage('accessToken');
      const refreshToken = safeGetLocalStorage('refreshToken');
      
      if (accessToken && refreshToken) {
        // Try to restore user session with existing tokens
        try {
          await getCurrentUser();
        } catch (error) {
          console.error('Failed to restore session:', error);
          // Clear invalid tokens but preserve business selection
          safeRemoveLocalStorage('accessToken');
          safeRemoveLocalStorage('refreshToken');
          setUser(null);
        }
      } else {
        // No tokens found, user needs to login
        setUser(null);
      }
      
      setLoading(false);
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