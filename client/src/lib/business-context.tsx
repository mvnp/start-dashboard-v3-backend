import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import BusinessSelectorModal from "@/components/business-selector-modal";

interface BusinessContextType {
  selectedBusinessId: number | null;
  selectedBusiness: Business | null;
  userBusinesses: Business[];
  setSelectedBusinessId: (businessId: number | null) => void;
  isBusinessSelectionRequired: boolean;
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
  const { user, logout } = useAuth();
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<number | null>(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  // Fetch user businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
    enabled: !!user && !user.isSuperAdmin,
  });

  // Check if business selection is required
  const isBusinessSelectionRequired = 
    !!user && 
    !user.isSuperAdmin && 
    userBusinesses.length > 1 && 
    !selectedBusinessId;

  // Load selected business from sessionStorage on mount
  useEffect(() => {
    const savedBusinessId = sessionStorage.getItem("selectedBusinessId");
    if (savedBusinessId) {
      setSelectedBusinessIdState(parseInt(savedBusinessId));
    }
  }, []);

  // Show modal when user logs in and has multiple businesses
  useEffect(() => {
    if (!isLoading && user && !user.isSuperAdmin && userBusinesses.length > 1) {
      const savedBusinessId = sessionStorage.getItem("selectedBusinessId");
      if (!savedBusinessId) {
        setShowBusinessModal(true);
      }
    }
  }, [user, userBusinesses, isLoading]);

  // Auto-select business if user has only one
  useEffect(() => {
    if (!isLoading && user && !user.isSuperAdmin && userBusinesses.length === 1) {
      const businessId = userBusinesses[0].id;
      setSelectedBusinessIdState(businessId);
      sessionStorage.setItem("selectedBusinessId", businessId.toString());
    }
  }, [user, userBusinesses, isLoading]);

  const setSelectedBusinessId = (businessId: number | null) => {
    setSelectedBusinessIdState(businessId);
    if (businessId) {
      sessionStorage.setItem("selectedBusinessId", businessId.toString());
    } else {
      sessionStorage.removeItem("selectedBusinessId");
    }
  };

  const handleBusinessSelected = (businessId: number) => {
    setSelectedBusinessId(businessId);
    setShowBusinessModal(false);
  };

  const handleLogout = () => {
    setShowBusinessModal(false);
    logout();
  };

  const selectedBusiness = userBusinesses.find(b => b.id === selectedBusinessId) || null;

  const contextValue: BusinessContextType = {
    selectedBusinessId,
    selectedBusiness,
    userBusinesses,
    setSelectedBusinessId,
    isBusinessSelectionRequired,
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
      <BusinessSelectorModal
        isOpen={showBusinessModal}
        onBusinessSelected={handleBusinessSelected}
        onLogout={handleLogout}
      />
    </BusinessContext.Provider>
  );
}