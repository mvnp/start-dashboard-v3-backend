import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown } from "lucide-react";
import { Business } from "@shared/schema";
import BusinessSelectorModal from "./business-selector-modal";
import { useAuth } from "@/lib/auth";

interface BusinessChangeButtonProps {
  currentBusinessId?: number;
  onBusinessChange: (businessId: number) => void;
}

export default function BusinessChangeButton({ 
  currentBusinessId, 
  onBusinessChange 
}: BusinessChangeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();

  // Fetch user businesses
  const { data: userBusinesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
    enabled: !!user,
  });

  // Don't show button for Super Admin or if user has only one business
  if (!user || user.isSuperAdmin || userBusinesses.length <= 1) {
    return null;
  }

  const currentBusiness = userBusinesses.find(b => b.id === currentBusinessId);

  const handleBusinessChange = (businessId: number) => {
    setIsModalOpen(false);
    onBusinessChange(businessId);
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    logout();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Building2 className="w-4 h-4" style={{ color: 'var(--barber-primary)' }} />
        <span className="max-w-32 truncate">
          {currentBusiness?.name || "Select Business"}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      <BusinessSelectorModal
        isOpen={isModalOpen}
        onBusinessSelected={handleBusinessChange}
        onLogout={handleLogout}
      />
    </>
  );
}