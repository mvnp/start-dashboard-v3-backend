import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './auth';
import { safeGetSessionStorage } from './safe-storage';

interface EditionContextType {
  isEditionMode: boolean;
  toggleEditionMode: () => void;
  currentLanguage: string;
  canEdit: boolean;
}

const EditionContext = createContext<EditionContextType | undefined>(undefined);

export function EditionProvider({ children }: { children: ReactNode }) {
  const [isEditionMode, setIsEditionMode] = useState(() => {
    // Restore edition mode from localStorage on initialization
    const saved = localStorage.getItem('editionMode');
    return saved === 'true';
  });
  const { user } = useAuth();

  // Get current language from session storage (default to 'en')
  const currentLanguage = 'en'; // Default to English for now, can be enhanced later

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

  return (
    <EditionContext.Provider value={{
      isEditionMode: isEditionMode && canEdit,
      toggleEditionMode,
      currentLanguage,
      canEdit,
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