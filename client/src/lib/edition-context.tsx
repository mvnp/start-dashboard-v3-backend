import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './auth';
import { useBusinessContext } from './business-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EditionContextType {
  isEditionMode: boolean;
  toggleEditionMode: () => void;
  currentLanguage: string;
  canEdit: boolean;
  selectedBusinessId: number | null;
}

const EditionContext = createContext<EditionContextType | undefined>(undefined);

export function EditionProvider({ children }: { children: ReactNode }) {
  const [isEditionMode, setIsEditionMode] = useState(() => {
    // Restore edition mode from localStorage on initialization
    const saved = localStorage.getItem('editionMode');
    return saved === 'true';
  });
  const { user } = useAuth();
  const { selectedBusinessId } = useBusinessContext();
  const queryClient = useQueryClient();

  // Get current language from business settings with caching
  const { data: settings } = useQuery({
    queryKey: ['settings', selectedBusinessId],
    queryFn: async () => {
      if (!selectedBusinessId) return null;
      const response = await fetch('/api/settings', {
        headers: {
          'business-id': selectedBusinessId.toString(),
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) return null;
      const settingsData = await response.json();
      
      // Cache language setting in localStorage for persistence across page reloads
      if (settingsData?.language) {
        localStorage.setItem(`businessLanguage_${selectedBusinessId}`, settingsData.language);
      }
      
      return settingsData;
    },
    enabled: !!selectedBusinessId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Get cached language while settings are loading
  const getCachedLanguage = () => {
    if (selectedBusinessId) {
      const cached = localStorage.getItem(`businessLanguage_${selectedBusinessId}`);
      if (cached) {
        console.log('Found cached language:', cached, 'for business:', selectedBusinessId);
        return cached;
      }
    }
    return 'en';
  };

  // Check if user is Super Admin (Role ID: 1)
  const canEdit = user?.roleId === 1;

  const toggleEditionMode = () => {
    if (canEdit) {
      const newMode = !isEditionMode;
      setIsEditionMode(newMode);
      // Persist edition mode to localStorage
      localStorage.setItem('editionMode', newMode.toString());
    }
  };

  // Use effect to ensure language updates when business ID changes
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  useEffect(() => {
    const newLanguage = settings?.language || getCachedLanguage();
    if (newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);
      console.log('Language updated:', newLanguage, 'for business:', selectedBusinessId);
      
      // Force invalidate TranslatableText queries to re-fetch with new language
      queryClient.invalidateQueries({ queryKey: ['translation'] });
    }
  }, [settings?.language, selectedBusinessId, queryClient]);
  
  console.log('EditionContext language detection:', {
    settingsLanguage: settings?.language,
    cachedLanguage: getCachedLanguage(),
    currentLanguage,
    selectedBusinessId
  });

  return (
    <EditionContext.Provider value={{
      isEditionMode: isEditionMode && canEdit,
      toggleEditionMode,
      currentLanguage,
      canEdit,
      selectedBusinessId,
    }}>
      {children}
    </EditionContext.Provider>
  );
}

export function useEdition() {
  const context = useContext(EditionContext);
  if (context === undefined) {
    throw new Error('useEdition must be used within an EditionProvider');
  }
  return context;
}