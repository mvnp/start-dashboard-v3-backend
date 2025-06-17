import { Button } from "@/components/ui/button";
import { Building2, ChevronDown } from "lucide-react";
import { useBusinessContext } from "@/lib/business-context";
import { useAuth } from "@/lib/auth";

export default function BusinessChangeButton() {
  const { user } = useAuth();
  const { selectedBusiness, userBusinesses, changeBusiness } = useBusinessContext();

  // Don't show button for Super Admin or if user has only one business
  if (!user || user.isSuperAdmin || userBusinesses.length <= 1) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={changeBusiness}
      className="flex items-center gap-2"
    >
      <Building2 className="w-4 h-4" style={{ color: 'var(--barber-primary)' }} />
      <span className="max-w-32 truncate">
        {selectedBusiness?.name || "Select Business"}
      </span>
      <ChevronDown className="w-4 h-4" />
    </Button>
  );
}