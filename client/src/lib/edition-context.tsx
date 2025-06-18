import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessContext } from './business-context';
import { useAuth } from './auth';

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
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();

  // Get current language from settings
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
      return response.json();
    },
    enabled: !!selectedBusinessId,
  });

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
      currentLanguage: settings?.language || 'en',
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