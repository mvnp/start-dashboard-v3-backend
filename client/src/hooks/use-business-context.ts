import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export function useBusinessContext() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [selectedBusinessLanguage, setSelectedBusinessLanguage] = useState<string | null>(null);

  useEffect(() => {
    // Get business ID from localStorage on initialization
    const storedBusinessId = localStorage.getItem('x-selected-business-id');
    const storedBusinessLanguage = localStorage.getItem('x-selected-business-language');
    
    if (storedBusinessId) {
      setSelectedBusinessId(parseInt(storedBusinessId));
    }
    
    if (storedBusinessLanguage) {
      setSelectedBusinessLanguage(storedBusinessLanguage);
    }
  }, []);

  const loadBusinessSettings = async (businessId: number) => {
    try {
      // Temporarily set business ID to make the settings call
      localStorage.setItem('x-selected-business-id', businessId.toString());
      
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'x-selected-business-id': businessId.toString(),
        },
      });

      if (response.ok) {
        const settings = await response.json();
        const businessLanguage = settings.language || 'en';
        
        // Store business language in both localStorage and sessionStorage
        localStorage.setItem('x-selected-business-language', businessLanguage);
        sessionStorage.setItem('x-selected-business-language', businessLanguage);
        setSelectedBusinessLanguage(businessLanguage);
        
        return businessLanguage;
      }
    } catch (error) {
      console.error('Failed to load business settings:', error);
    }
    
    // Fallback to English
    const fallbackLanguage = 'en';
    localStorage.setItem('x-selected-business-language', fallbackLanguage);
    sessionStorage.setItem('x-selected-business-language', fallbackLanguage);
    setSelectedBusinessLanguage(fallbackLanguage);
    return fallbackLanguage;
  };

  const updateSelectedBusiness = async (businessId: number) => {
    setSelectedBusinessId(businessId);
    localStorage.setItem('x-selected-business-id', businessId.toString());
    sessionStorage.setItem('x-selected-business-id', businessId.toString());
    
    // Load business settings to get the default language
    await loadBusinessSettings(businessId);
  };

  const clearSelectedBusiness = () => {
    setSelectedBusinessId(null);
    setSelectedBusinessLanguage(null);
    localStorage.removeItem('x-selected-business-id');
    localStorage.removeItem('x-selected-business-language');
    sessionStorage.removeItem('x-selected-business-id');
    sessionStorage.removeItem('x-selected-business-language');
  };

  const updateBusinessLanguage = (language: string) => {
    setSelectedBusinessLanguage(language);
    localStorage.setItem('x-selected-business-language', language);
    sessionStorage.setItem('x-selected-business-language', language);
  };

  return {
    selectedBusinessId,
    selectedBusinessLanguage,
    updateSelectedBusiness,
    clearSelectedBusiness,
    loadBusinessSettings,
    updateBusinessLanguage,
    hasSelectedBusiness: selectedBusinessId !== null
  };
}