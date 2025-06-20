import React, { createContext, useContext } from 'react';
import { useBusinessContext } from '@/hooks/use-business-context';

const BusinessContext = createContext<ReturnType<typeof useBusinessContext> | null>(null);

export function useBusinessProvider() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessProvider must be used within a BusinessProvider');
  }
  return context;
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const businessContext = useBusinessContext();

  return (
    <BusinessContext.Provider value={businessContext}>
      {children}
    </BusinessContext.Provider>
  );
}