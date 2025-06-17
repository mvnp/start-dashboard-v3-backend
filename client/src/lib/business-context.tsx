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
    if (!isLoading && user && !user.isSuperAdmin) {
      const savedBusinessId = sessionStorage.getItem("selectedBusinessId");
      
      // If user has multiple businesses and no saved business, show modal immediately (initial selection)
      if (userBusinesses.length > 1 && !savedBusinessId) {
        console.log('Showing business selection modal for user with multiple businesses (initial selection)');
        setIsInitialSelection(true);
        setShowBusinessModal(true);
      }
      
      // If user has businesses but no valid saved business, show modal (initial selection)
      if (userBusinesses.length > 1 && savedBusinessId) {
        const savedId = parseInt(savedBusinessId);
        const businessExists = userBusinesses.some(b => b.id === savedId);
        if (!businessExists) {
          sessionStorage.removeItem("selectedBusinessId");
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
      sessionStorage.removeItem("selectedBusinessId");
    } else {
      // When user logs in, clear any previous business selection to force new selection
      const currentUserId = user.userId;
      const lastUserId = sessionStorage.getItem("lastUserId");
      
      if (lastUserId && lastUserId !== currentUserId.toString()) {
        // Different user logged in, clear previous business selection
        sessionStorage.removeItem("selectedBusinessId");
        setSelectedBusinessIdState(null);
      }
      
      sessionStorage.setItem("lastUserId", currentUserId.toString());
    }
  }, [user]);

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