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
  const [modalShownForUser, setModalShownForUser] = useState<number | null>(null);

  // Fetch user businesses - Super Admin gets all businesses, others get their assigned businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: user?.isSuperAdmin ? ["/api/businesses"] : ["/api/user-businesses"],
    enabled: !!user,
  });

  // Check if business selection is required - for all users with multiple businesses (Super Admin, Merchant, Employee)
  const isBusinessSelectionRequired = 
    !!user && 
    userBusinesses.length > 1 && 
    !selectedBusinessId;

  // Load selected business from sessionStorage on mount with enhanced persistence
  useEffect(() => {
    const savedBusinessId = safeGetSessionStorage("selectedBusinessId");
    if (savedBusinessId && !isNaN(parseInt(savedBusinessId))) {
      const businessId = parseInt(savedBusinessId);
      setSelectedBusinessIdState(businessId);
      console.log('Restored selected business from session:', businessId);
    }
  }, []);

  // Handle business selection for all users (Super Admin, Merchant, Employee)
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0) {
      const savedBusinessId = safeGetSessionStorage("selectedBusinessId");
      
      // If user has only one business, automatically select it
      if (userBusinesses.length === 1) {
        const singleBusiness = userBusinesses[0];
        setSelectedBusinessIdState(singleBusiness.id);
        safeSetSessionStorage("selectedBusinessId", singleBusiness.id.toString());
        console.log('Auto-selected single business for', user.email, ':', singleBusiness.name);
        return;
      }
      
      // For users with multiple businesses, only show modal once per user session
      if (userBusinesses.length > 1 && modalShownForUser !== user.userId) {
        if (!savedBusinessId) {
          console.log('Showing business selection modal for', user.email, 'with multiple businesses (initial selection). Role ID:', user.roleId);
          setIsInitialSelection(true);
          setShowBusinessModal(true);
          setModalShownForUser(user.userId);
          return;
        }
        
        // Check if saved business exists in user's accessible businesses
        const savedId = parseInt(savedBusinessId);
        const businessExists = userBusinesses.some(b => b.id === savedId);
        if (!businessExists) {
          console.log('Saved business not found for', user.email, ', showing selection modal. Role ID:', user.roleId);
          safeRemoveSessionStorage("selectedBusinessId");
          setSelectedBusinessIdState(null);
          setIsInitialSelection(true);
          setShowBusinessModal(true);
          setModalShownForUser(user.userId);
          return;
        }
        
        // If saved business exists, restore it
        setSelectedBusinessIdState(savedId);
        console.log('Restored business selection for', user.email, ':', savedId);
      }
    }
  }, [user, userBusinesses, isLoading, modalShownForUser]);

  // Clear business selection when user changes (logout/login)
  useEffect(() => {
    if (!user) {
      setSelectedBusinessIdState(null);
      setShowBusinessModal(false);
      setModalShownForUser(null);
      safeRemoveSessionStorage("selectedBusinessId");
      safeRemoveSessionStorage("lastUserId");
    } else {
      // When user logs in, clear any previous business selection to force new selection for different users
      const currentUserId = user.userId;
      const lastUserId = safeGetSessionStorage("lastUserId");
      
      if (lastUserId && lastUserId !== currentUserId.toString()) {
        // Different user logged in, clear previous business selection
        console.log('Different user logged in, clearing business selection for user:', user.email);
        safeRemoveSessionStorage("selectedBusinessId");
        setSelectedBusinessIdState(null);
        setShowBusinessModal(false);
        setModalShownForUser(null); // Reset modal tracking
      }
      
      safeSetSessionStorage("lastUserId", currentUserId.toString());
    }
  }, [user]);

  // Auto-select business if user has only one (for all non-Super Admin users)
  useEffect(() => {
    if (!isLoading && user && !user.isSuperAdmin && userBusinesses.length === 1) {
      const businessId = userBusinesses[0].id;
      setSelectedBusinessIdState(businessId);
      safeSetSessionStorage("selectedBusinessId", businessId.toString());
      console.log('Auto-selected single business for user:', businessId);
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