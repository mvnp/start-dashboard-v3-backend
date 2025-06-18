import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessContext } from './business-context';

interface EditionContextType {
  isEditionMode: boolean;
  toggleEditionMode: () => void;
  currentLanguage: string;
}

const EditionContext = createContext<EditionContextType | undefined>(undefined);

export function EditionProvider({ children }: { children: ReactNode }) {
  const [isEditionMode, setIsEditionMode] = useState(false);
  const { selectedBusinessId } = useBusinessContext();

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

  const toggleEditionMode = () => {
    setIsEditionMode(!isEditionMode);
  };

  return (
    <EditionContext.Provider value={{
      isEditionMode,
      toggleEditionMode,
      currentLanguage: settings?.language || 'en',
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