import { useState, useEffect } from 'react';

export function useBusinessContext() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

  useEffect(() => {
    // Get business ID from localStorage on initialization
    const storedBusinessId = localStorage.getItem('x-selected-business-id');
    if (storedBusinessId) {
      setSelectedBusinessId(parseInt(storedBusinessId));
    }
  }, []);

  const updateSelectedBusiness = (businessId: number) => {
    setSelectedBusinessId(businessId);
    localStorage.setItem('x-selected-business-id', businessId.toString());
    sessionStorage.setItem('x-selected-business-id', businessId.toString());
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