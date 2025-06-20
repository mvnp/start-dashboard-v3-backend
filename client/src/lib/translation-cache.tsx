import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';

interface TranslationCache {
  [language: string]: Record<string, string>;
}

interface TranslationCacheContextType {
  translations: TranslationCache;
  loadTranslations: (language: string) => Promise<void>;
  isLoading: boolean;
}

const TranslationCacheContext = createContext<TranslationCacheContextType | undefined>(undefined);

export function TranslationCacheProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<TranslationCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadTranslations = async (language: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !language || translations[language]) {
      return; // Already loaded or no token
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/translations/bulk/${language}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTranslations(prev => ({
          ...prev,
          [language]: data,
        }));
      }
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TranslationCacheContextType = {
    translations,
    loadTranslations,
    isLoading,
  };

  return (
    <TranslationCacheContext.Provider value={contextValue}>
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