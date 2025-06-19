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
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<number | null>(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [isInitialSelection, setIsInitialSelection] = useState(false);
  const [modalShownForUser, setModalShownForUser] = useState<number | null>(null);

  // Fetch user businesses - Super Admin gets all businesses, others get their assigned businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: user?.isSuperAdmin ? ["/api/businesses"] : ["/api/user-businesses"],
    enabled: !!user,
    staleTime: 0, // Force fresh requests to debug caching issue
    cacheTime: 0, // Disable caching temporarily for debugging
    onSuccess: (data) => {
      console.log('Business query result for user:', user?.email, 'isSuperAdmin:', user?.isSuperAdmin, 'businesses found:', data?.length, data);
    }
  });

  // Check if business selection is required - for all users with multiple businesses (Super Admin, Merchant, Employee)
  const isBusinessSelectionRequired = 
    !!user && 
    userBusinesses.length > 1 && 
    !selectedBusinessId;

  // Initialize selected business from localStorage immediately when component mounts
  useEffect(() => {
    if (user) {
      const savedBusinessId = safeGetLocalStorage("selectedBusinessId");
      console.log('Checking for saved business ID:', savedBusinessId, 'for user:', user.email);
      if (savedBusinessId && !isNaN(parseInt(savedBusinessId))) {
        const businessId = parseInt(savedBusinessId);
        setSelectedBusinessIdState(businessId);
        console.log('Restored selected business from localStorage:', businessId, 'for user:', user.email);
      } else {
        console.log('No valid saved business ID found for user:', user.email);
      }
    }
  }, [user]);

  // Handle business selection for all users (Super Admin, Merchant, Employee)
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0) {
      const savedBusinessId = safeGetLocalStorage("selectedBusinessId");
      
      // If user has only one business, automatically select it
      if (userBusinesses.length === 1) {
        const singleBusiness = userBusinesses[0];
        setSelectedBusinessIdState(singleBusiness.id);
        safeSetLocalStorage("selectedBusinessId", singleBusiness.id.toString());
        console.log('Auto-selected single business for', user.email, ':', singleBusiness.name);
        return;
      }
      
      // For users with multiple businesses
      if (userBusinesses.length > 1) {
        // If we have a saved business ID, validate and restore it
        if (savedBusinessId && !selectedBusinessId) {
          const savedId = parseInt(savedBusinessId);
          const businessExists = userBusinesses.some(b => b.id === savedId);
          
          if (businessExists) {
            setSelectedBusinessIdState(savedId);
            setModalShownForUser(user.userId); // Mark modal as shown when restoring
            console.log('Restored business selection for', user.email, ':', savedId);
            return;
          } else {
            // Saved business no longer exists, clear it
            console.log('Saved business not found for', user.email, ', clearing selection');
            safeRemoveLocalStorage("selectedBusinessId");
            setSelectedBusinessIdState(null);
          }
        }
        
        // Show modal only if no valid selection exists and modal hasn't been shown for this user
        if (!selectedBusinessId && modalShownForUser !== user.userId && !showBusinessModal) {
          console.log('Showing business selection modal for', user.email, 'with multiple businesses. Role ID:', user.roleId);
          setIsInitialSelection(true);
          setShowBusinessModal(true);
          setModalShownForUser(user.userId);
        }
      }
    }
  }, [user, userBusinesses, isLoading, modalShownForUser, showBusinessModal, selectedBusinessId]);

  // Clear business selection only when user logs out
  useEffect(() => {
    if (!user) {
      setSelectedBusinessIdState(null);
      setShowBusinessModal(false);
      setModalShownForUser(null);
      safeRemoveLocalStorage("selectedBusinessId");
      safeRemoveLocalStorage("lastUserId");
    } else {
      // When user logs in, only clear business selection if it's a different user
      const currentUserId = user.userId;
      const lastUserId = safeGetLocalStorage("lastUserId");
      
      // Only clear if we have a different user ID stored
      if (lastUserId && lastUserId !== currentUserId.toString()) {
        console.log('Different user logged in, clearing business selection for user:', user.email);
        safeRemoveLocalStorage("selectedBusinessId");
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
    if (businessId) {
      safeSetLocalStorage("selectedBusinessId", businessId.toString());
      console.log('Saved business ID to localStorage:', businessId);
    } else {
      safeRemoveLocalStorage("selectedBusinessId");
      console.log('Removed business ID from localStorage');
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