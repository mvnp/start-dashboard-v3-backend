import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';
import { useBusinessContext } from './business-context';

interface TranslationCache {
  [language: string]: Record<string, string>;
}

interface TranslationCacheContextType {
  translations: TranslationCache;
  loadTranslations: (language: string) => Promise<void>;
  getTranslation: (text: string, language: string) => string;
  isLoading: boolean;
}

const TranslationCacheContext = createContext<TranslationCacheContextType | undefined>(undefined);

export function TranslationCacheProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { selectedBusinessId } = useBusinessContext();

  const loadTranslations = async (language: string) => {
    if (!token || !language || translations[language]) {
      return; // Already loaded or no token
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/translations/bulk/${language}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const translationData = await response.json();
        setTranslations(prev => ({
          ...prev,
          [language]: translationData
        }));
      } else {
        console.error('Failed to load translations:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTranslation = (text: string, language: string): string => {
    if (!language || language === 'en') {
      return text; // Return original text for English
    }

    const languageTranslations = translations[language];
    if (!languageTranslations) {
      return text; // Fallback to original text if language not loaded
    }

    return languageTranslations[text] || text; // Return translation or fallback to original
  };

  // Auto-load translations when language changes
  useEffect(() => {
    if (selectedBusinessId && token) {
      // Get language from business settings (this will be handled by EditionContext)
      // For now, we'll load Portuguese as the main non-English language
      loadTranslations('pt');
    }
  }, [selectedBusinessId, token]);

  return (
    <TranslationCacheContext.Provider value={{
      translations,
      loadTranslations,
      getTranslation,
      isLoading
    }}>
      {children}
    </TranslationCacheContext.Provider>
  );
}

export function useTranslationCache() {
  const context = useContext(TranslationCacheContext);
  if (context === undefined) {
    throw new Error('useTranslationCache must be used within a TranslationCacheProvider');
  }
  return context;
}