import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EditionContextType {
  isEditionMode: boolean;
  setIsEditionMode: (enabled: boolean) => void;
  currentLanguage: string;
  canEdit: boolean;
  updateLanguage: (language: string) => void;
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
  const [manualLanguage, setManualLanguage] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current language from settings - disabled to prevent conflicts
  // Settings are now fetched directly in business context hook
  const settings = null;

  // Get cached language while settings are loading
  const getCachedLanguage = () => {
    const cached = localStorage.getItem('currentLanguage');
    return cached || 'en';
  };

  // Check if user is Super Admin (Role ID: 1)
  const canEdit = user?.roleId === 1;

  // Method to update language manually (from business context)
  const updateLanguage = (language: string) => {
    setManualLanguage(language);
    localStorage.setItem('currentLanguage', language);
    console.log('Language updated via business context:', language);
    
    // Invalidate translation cache to reload with new language
    queryClient.invalidateQueries({ queryKey: ['translations'] });
  };

  // Current language determination (manual override takes precedence)
  const currentLanguage = manualLanguage || getCachedLanguage();

  // Save edition mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('editionMode', isEditionMode.toString());
  }, [isEditionMode]);

  // Debug logging for language detection
  useEffect(() => {
    console.log('EditionContext language detection:', {
      cachedLanguage: getCachedLanguage(),
      manualLanguage,
      currentLanguage,
    });
  }, [currentLanguage, manualLanguage]);

  const contextValue: EditionContextType = {
    isEditionMode,
    setIsEditionMode,
    currentLanguage,
    canEdit,
    updateLanguage,
  };

  return (
    <EditionContext.Provider value={contextValue}>
      {children}
    </EditionContext.Provider>
  );
}