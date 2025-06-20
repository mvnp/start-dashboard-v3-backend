import { useBusinessLanguage } from '@/lib/business-language-context';

// Hook version for use in React components
export const useTranslationHelper = () => {
  const { translations, currentLanguage } = useBusinessLanguage();
  
  const t = (key: string): string => {
    if (currentLanguage === 'en') {
      return key; // Return original English text
    }
    
    // Look up translation in cached translations
    const translation = translations.find(t => t.traduction_string === key);
    return translation?.traduction || key; // Fallback to original if not found
  };
  
  return { t };
};

// Standalone function version for use outside components
export const createTranslationHelper = (translations: any[], currentLanguage: string) => {
  return (key: string): string => {
    if (currentLanguage === 'en') {
      return key;
    }
    
    const translation = translations.find(t => t.traduction_string === key);
    return translation?.traduction || key;
  };
};