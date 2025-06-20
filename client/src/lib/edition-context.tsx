import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EditionContextType {
  isEditionMode: boolean;
  setIsEditionMode: (enabled: boolean) => void;
  toggleEditionMode: () => void;
  currentLanguage: string;
  canEdit: boolean;
}

const EditionContext = createContext<EditionContextType | undefined>(undefined);

export function useEdition() {
  const context = useContext(EditionContext);
  if (context === undefined) {
    throw new Error('useEdition must be used within an EditionProvider');
  }
  return context;
}

export function EditionProvider({ children }: { children: ReactNode }) {
  const [isEditionMode, setIsEditionMode] = useState(() => {
    // Restore edition mode from localStorage on initialization
    const saved = localStorage.getItem('editionMode');
    return saved === 'true';
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current language from settings
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) return null;
      const settingsData = await response.json();
      
      // Cache language setting in localStorage
      if (settingsData?.language) {
        localStorage.setItem('currentLanguage', settingsData.language);
      }
      
      return settingsData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Get cached language while settings are loading
  const getCachedLanguage = () => {
    const cached = localStorage.getItem('currentLanguage');
    return cached || 'en';
  };

  // Check if user is Super Admin (Role ID: 1)
  const canEdit = user?.roleId === 1;

  // Current language determination
  const currentLanguage = settings?.language || getCachedLanguage();

  // Save edition mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('editionMode', isEditionMode.toString());
  }, [isEditionMode]);

  // Debug logging for language detection
  useEffect(() => {
    console.log('EditionContext language detection:', {
      cachedLanguage: getCachedLanguage(),
      currentLanguage,
    });
  }, [currentLanguage]);

  const toggleEditionMode = () => {
    setIsEditionMode(!isEditionMode);
  };

  const contextValue: EditionContextType = {
    isEditionMode,
    setIsEditionMode,
    toggleEditionMode,
    currentLanguage,
    canEdit,
  };

  return (
    <EditionContext.Provider value={contextValue}>
      {children}
    </EditionContext.Provider>
  );
}