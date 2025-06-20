import { useBusinessLanguage } from '@/lib/business-language-context';

// Hook version for use in React components
export const useTranslationHelper = () => {
  const { translations, getTranslation } = useBusinessLanguage();
  
  const t = (key: string): string => {
    return getTranslation(key);
  };
  
  return { t };
};

// Standalone function version for use outside components
export const createTranslationHelper = (translations: Record<string, string>) => {
  return (key: string): string => {
    return translations[key] || key;
  };
};