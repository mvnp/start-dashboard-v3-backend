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
  });

  // Check if business selection is required - for all users with multiple businesses (Super Admin, Merchant, Employee)
  const isBusinessSelectionRequired = 
    !!user && 
    userBusinesses.length > 1 && 
    !selectedBusinessId;

  // Restore business ID from localStorage when user becomes available
  useEffect(() => {
    if (user && !selectedBusinessId) {
      const savedBusinessId = safeGetLocalStorage(`selectedBusinessId_${user.email}`);
      if (savedBusinessId && !isNaN(parseInt(savedBusinessId))) {
        const businessId = parseInt(savedBusinessId);
        setSelectedBusinessIdState(businessId);
        console.log('Restored business ID from localStorage:', businessId, 'for user:', user.email);
      }
    }
  }, [user?.email]); // Only trigger when user email changes

  // Handle business selection and restoration in a single effect
  useEffect(() => {
    if (!isLoading && user && userBusinesses.length > 0) {
      const savedBusinessId = safeGetLocalStorage(`selectedBusinessId_${user.email}`);
      console.log('Business selection logic - saved ID:', savedBusinessId, 'current ID:', selectedBusinessId, 'for user:', user.email);
      
      // If user has only one business, automatically select it
      if (userBusinesses.length === 1) {
        const singleBusiness = userBusinesses[0];
        if (selectedBusinessId !== singleBusiness.id) {
          setSelectedBusinessIdState(singleBusiness.id);
          safeSetLocalStorage(`selectedBusinessId_${user.email}`, singleBusiness.id.toString());
          console.log('Auto-selected single business for', user.email, ':', singleBusiness.name);
        }
        return;
      }
      
      // For users with multiple businesses
      if (userBusinesses.length > 1) {
        // If we have a saved business ID and no current selection, validate and restore it
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
            safeRemoveLocalStorage(`selectedBusinessId_${user.email}`);
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
      console.log('Saved business ID to localStorage:', businessId, 'for user:', user.email);
    } else if (user) {
      safeRemoveLocalStorage(`selectedBusinessId_${user.email}`);
      console.log('Removed business ID from localStorage for user:', user.email);
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