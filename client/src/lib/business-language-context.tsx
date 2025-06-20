import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBusinessContext } from '@/hooks/use-business-context';

interface Translation {
  id: number;
  traduction_id: number;
  traduction: string;
  language: string;
}

interface Traduction {
  id: number;
  string: string;
}

interface BusinessLanguageContextType {
  translations: Record<string, string>;
  isLoading: boolean;
  getTranslation: (text: string) => string;
  refreshTranslations: () => Promise<void>;
}

const BusinessLanguageContext = createContext<BusinessLanguageContextType | null>(null);

export function useBusinessLanguage() {
  const context = useContext(BusinessLanguageContext);
  if (!context) {
    throw new Error('useBusinessLanguage must be used within a BusinessLanguageProvider');
  }
  return context;
}

export function BusinessLanguageProvider({ children }: { children: React.ReactNode }) {
  const { selectedBusinessId, selectedBusinessLanguage } = useBusinessContext();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadBulkTranslations = async (language: string) => {
    if (!selectedBusinessId || !language) return;

    setIsLoading(true);
    try {
      console.log(`Loading bulk translations for language: ${language}`);
      
      const response = await fetch(`/api/translations/bulk/${language}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'x-selected-business-id': selectedBusinessId.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Loaded ${data.length} translations for ${language}`);
        
        // Create translation map from English string to translated text
        const translationMap: Record<string, string> = {};
        
        data.forEach((item: any) => {
          if (item.traduction && item.traduction_string) {
            translationMap[item.traduction_string] = item.traduction;
          }
        });
        
        setTranslations(translationMap);
      } else {
        console.error('Failed to load bulk translations:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading bulk translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load translations when business language changes
  useEffect(() => {
    if (selectedBusinessLanguage && selectedBusinessLanguage !== 'en') {
      loadBulkTranslations(selectedBusinessLanguage);
    } else {
      // Clear translations for English
      setTranslations({});
    }
  }, [selectedBusinessLanguage, selectedBusinessId]);

  const getTranslation = (text: string): string => {
    // Return translation if available, otherwise return original text
    return translations[text] || text;
  };

  const refreshTranslations = async () => {
    if (selectedBusinessLanguage && selectedBusinessLanguage !== 'en') {
      await loadBulkTranslations(selectedBusinessLanguage);
    }
  };

  return (
    <BusinessLanguageContext.Provider
      value={{
        translations,
        isLoading,
        getTranslation,
        refreshTranslations,
      }}
    >
      {children}
    </BusinessLanguageContext.Provider>
  );
}