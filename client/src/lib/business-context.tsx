import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import BusinessSelectorModal from "@/components/business-selector-modal";
import { safeGetSessionStorage, safeSetSessionStorage, safeRemoveSessionStorage } from "./safe-storage";

interface BusinessContextType {
  selectedBusinessId: number | null;
  selectedBusiness: Business | null;
  userBusinesses: Business[];
  setSelectedBusinessId: (businessId: number | null) => void;
  isBusinessSelectionRequired: boolean;
  changeBusiness: () => void;
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
  const [isInitialSelection, setIsInitialSelection] = useState(false);

  // Fetch user businesses - Super Admin gets all businesses, others get their assigned businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: user?.isSuperAdmin ? ["/api/businesses"] : ["/api/user-businesses"],
    enabled: !!user,
  });

  // Check if business selection is required - for all users with multiple businesses
  const isBusinessSelectionRequired = 
    !!user && 
    userBusinesses.length > 1 && 
    !selectedBusinessId;

  // Load selected business from sessionStorage on mount
  useEffect(() => {
    const savedBusinessId = safeGetSessionStorage("selectedBusinessId");
    if (savedBusinessId) {
      setSelectedBusinessIdState(parseInt(savedBusinessId));
    }
  }, []);

  // Handle business selection for all users
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0) {
      const savedBusinessId = safeGetSessionStorage("selectedBusinessId");
      
      // If user has only one business, automatically select it
      if (userBusinesses.length === 1) {
        const singleBusiness = userBusinesses[0];
        setSelectedBusinessIdState(singleBusiness.id);
        safeSetSessionStorage("selectedBusinessId", singleBusiness.id.toString());
        console.log('Auto-selected single business:', singleBusiness.name);
        return;
      }
      
      // If user has multiple businesses and no saved business, show modal immediately (initial selection)
      if (userBusinesses.length > 1 && !savedBusinessId) {
        console.log('Showing business selection modal for user with multiple businesses (initial selection)');
        setIsInitialSelection(true);
        setShowBusinessModal(true);
      }
      
      // If user has multiple businesses but no valid saved business, show modal (initial selection)
      if (userBusinesses.length > 1 && savedBusinessId) {
        const savedId = parseInt(savedBusinessId);
        const businessExists = userBusinesses.some(b => b.id === savedId);
        if (!businessExists) {
          safeRemoveSessionStorage("selectedBusinessId");
          setSelectedBusinessIdState(null);
          setIsInitialSelection(true);
          setShowBusinessModal(true);
        }
      }
    }
  }, [user, userBusinesses, isLoading]);

  // Clear business selection when user changes (logout/login)
  useEffect(() => {
    if (!user) {
      setSelectedBusinessIdState(null);
      setShowBusinessModal(false);
      safeRemoveSessionStorage("selectedBusinessId");
    } else {
      // When user logs in, clear any previous business selection to force new selection
      const currentUserId = user.userId;
      const lastUserId = safeGetSessionStorage("lastUserId");
      
      if (lastUserId && lastUserId !== currentUserId.toString()) {
        // Different user logged in, clear previous business selection
        safeRemoveSessionStorage("selectedBusinessId");
        setSelectedBusinessIdState(null);
      }
      
      safeSetSessionStorage("lastUserId", currentUserId.toString());
    }
  }, [user]);

  // Auto-select business if user has only one
  useEffect(() => {
    if (!isLoading && user && !user.isSuperAdmin && userBusinesses.length === 1) {
      const businessId = userBusinesses[0].id;
      setSelectedBusinessIdState(businessId);
      safeSetSessionStorage("selectedBusinessId", businessId.toString());
    }
  }, [user, userBusinesses, isLoading]);

  const setSelectedBusinessId = (businessId: number | null) => {
    setSelectedBusinessIdState(businessId);
    if (businessId) {
      safeSetSessionStorage("selectedBusinessId", businessId.toString());
    } else {
      safeRemoveSessionStorage("selectedBusinessId");
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

  const changeBusiness = () => {
    if (userBusinesses.length > 1) {
      setIsInitialSelection(false); // This is a voluntary business change, not initial selection
      setShowBusinessModal(true);
    }
  };

  const contextValue: BusinessContextType = {
    selectedBusinessId,
    selectedBusiness,
    userBusinesses,
    setSelectedBusinessId,
    isBusinessSelectionRequired,
    changeBusiness,
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
      <BusinessSelectorModal
        isOpen={showBusinessModal}
        onBusinessSelected={handleBusinessSelected}
        onLogout={handleLogout}
        isInitialSelection={isInitialSelection}
        onCancel={() => {
          if (!isInitialSelection) {
            setShowBusinessModal(false);
          }
        }}
      />
    </BusinessContext.Provider>
  );
}