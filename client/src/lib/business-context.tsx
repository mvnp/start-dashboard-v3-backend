import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { safeGetLocalStorage, safeSetLocalStorage, safeRemoveLocalStorage } from "./safe-storage";

interface BusinessContextType {
  selectedBusinessId: number | null;
  selectedBusiness: Business | null;
  userBusinesses: Business[];
  setSelectedBusinessId: (businessId: number | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusinessContext must be used within a BusinessProvider");
  }
  return context;
}

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<number | null>(null);

  // Fetch user businesses - Super Admin gets all businesses, others get their assigned businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: user?.isSuperAdmin ? ["/api/businesses"] : ["/api/user-businesses"],
    enabled: !!user,
  });

  // Auto-select first business when user has businesses
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0 && !selectedBusinessId) {
      const firstBusiness = userBusinesses[0];
      console.log(`Auto-selecting business ${firstBusiness.name} (ID: ${firstBusiness.id}) for ${user.email}`);
      
      setSelectedBusinessIdState(firstBusiness.id);
      safeSetLocalStorage(`selectedBusinessId_${user.email}`, firstBusiness.id.toString());
      
      // Force query invalidation to refresh data with business context
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 100);
    }
  }, [user, userBusinesses, isLoading, selectedBusinessId]);

  // Clear business selection when user logs out
  useEffect(() => {
    if (!user) {
      setSelectedBusinessIdState(null);
      // Clear all user-specific business data on logout
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('selectedBusinessId_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [user?.userId]);

  const setSelectedBusinessId = (businessId: number | null) => {
    console.log(`Setting business ID to: ${businessId} for user: ${user?.email}`);
    setSelectedBusinessIdState(businessId);
    if (businessId && user) {
      safeSetLocalStorage(`selectedBusinessId_${user.email}`, businessId.toString());
    } else if (user) {
      safeRemoveLocalStorage(`selectedBusinessId_${user.email}`);
    }
    
    // Force refresh of queries that depend on business context
    queryClient.invalidateQueries();
  };

  // Find selected business object
  const selectedBusiness = userBusinesses.find(b => b.id === selectedBusinessId) || null;

  const contextValue: BusinessContextType = {
    selectedBusinessId,
    selectedBusiness,
    userBusinesses,
    setSelectedBusinessId,
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
    </BusinessContext.Provider>
  );
}