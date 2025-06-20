import { useState, useEffect } from 'react';
import { useEdition } from '@/lib/edition-context';

export function useBusinessContext() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const { updateLanguage } = useEdition();

  useEffect(() => {
    // Get business ID from localStorage on initialization
    const storedBusinessId = localStorage.getItem('x-selected-business-id');
    if (storedBusinessId) {
      const businessId = parseInt(storedBusinessId);
      setSelectedBusinessId(businessId);
      // Auto-load language settings on app initialization
      fetchBusinessSettings(businessId);
    }
  }, []);

  const fetchBusinessSettings = async (businessId: number) => {
    try {
      // Add a small delay to ensure business context is properly set
      setTimeout(async () => {
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'x-selected-business-id': businessId.toString(),
          },
        });
        
        if (response.ok) {
          const settings = await response.json();
          if (settings?.language) {
            // Update the language in the edition context
            updateLanguage(settings.language);
            console.log('Auto-loaded language from business settings:', settings.language);
          }
        }
      }, 100);
    } catch (error) {
      console.error('Failed to fetch business settings:', error);
    }
  };

  const updateSelectedBusiness = (businessId: number) => {
    setSelectedBusinessId(businessId);
    localStorage.setItem('x-selected-business-id', businessId.toString());
    sessionStorage.setItem('x-selected-business-id', businessId.toString());
    
    // Automatically load business language settings
    fetchBusinessSettings(businessId);
  };

  const clearSelectedBusiness = () => {
    setSelectedBusinessId(null);
    localStorage.removeItem('x-selected-business-id');
    sessionStorage.removeItem('x-selected-business-id');
  };

  return {
    selectedBusinessId,
    updateSelectedBusiness,
    clearSelectedBusiness,
    hasSelectedBusiness: selectedBusinessId !== null
  };
}