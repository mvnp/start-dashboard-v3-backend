import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Business } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import BusinessSelectorModal from "@/components/business-selector-modal";
import { safeGetLocalStorage, safeSetLocalStorage, safeRemoveLocalStorage, safeGetSessionStorage, safeSetSessionStorage, safeRemoveSessionStorage } from "./safe-storage";

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
  const queryClient = useQueryClient();
  
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<number | null>(() => {
    // Initialize from localStorage immediately
    if (typeof window !== 'undefined' && user?.email) {
      const saved = localStorage.getItem(`selectedBusinessId_${user.email}`);
      return saved ? parseInt(saved) : null;
    }
    return null;
  });
  
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

  // Force business selection immediately when data is available
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0) {
      const firstBusiness = userBusinesses[0];
      
      // Always set the first business if no business is selected
      if (!selectedBusinessId) {
        console.log(`Auto-selecting business ${firstBusiness.name} (ID: ${firstBusiness.id}) for ${user.email}`);
        setSelectedBusinessIdState(firstBusiness.id);
        safeSetLocalStorage(`selectedBusinessId_${user.email}`, firstBusiness.id.toString());
        
        // Force immediate query invalidation to refresh data with business context
        setTimeout(() => queryClient.invalidateQueries(), 100);
      }
    }
  }, [user, userBusinesses, isLoading, selectedBusinessId]);

  // Clear business selection only when user logs out
  useEffect(() => {
    if (!user) {
      setSelectedBusinessIdState(null);
      setShowBusinessModal(false);
      setModalShownForUser(null);
      // Clear all user-specific business data on logout
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('selectedBusinessId_') || key.startsWith('businessLanguage_')) {
          localStorage.removeItem(key);
        }
      });
      safeRemoveLocalStorage("lastUserId");
    } else {
      // When user logs in, only clear business selection if it's a different user
      const currentUserId = user.userId;
      const lastUserId = safeGetLocalStorage("lastUserId");
      
      // Only clear if we have a different user ID stored
      if (lastUserId && lastUserId !== currentUserId.toString()) {
        console.log('Different user logged in, clearing business selection for user:', user.email);
        safeRemoveLocalStorage(`selectedBusinessId_${user.email}`);
        setSelectedBusinessIdState(null);
        setShowBusinessModal(false);
        setModalShownForUser(null);
      }
      
      // Always update the last user ID
      safeSetLocalStorage("lastUserId", currentUserId.toString());
    }
  }, [user?.userId]); // Only depend on userId changes, not the entire user object

  // This useEffect is now redundant as single business auto-selection is handled in the main business selection effect above

  const setSelectedBusinessId = (businessId: number | null) => {
    setSelectedBusinessIdState(businessId);
    if (businessId && user) {
      safeSetLocalStorage(`selectedBusinessId_${user.email}`, businessId.toString());
    } else if (user) {
      safeRemoveLocalStorage(`selectedBusinessId_${user.email}`);
    }
    
    // Force refresh of queries that depend on business context
    queryClient.invalidateQueries();
  };

  const handleBusinessSelected = (businessId: number) => {
    setSelectedBusinessId(businessId);
    setShowBusinessModal(false);
    // Ensure modal is marked as shown for this user to prevent duplicate modals
    if (user) {
      setModalShownForUser(user.userId);
    }
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
      // Don't update modalShownForUser here since this is a voluntary change
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