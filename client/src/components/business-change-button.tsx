import { Button } from "@/components/ui/button";
import { Building2, ChevronDown } from "lucide-react";
import { useBusinessContext } from "@/lib/business-context";
import { useAuth } from "@/lib/auth";
import { TranslatableText } from "@/components/translatable-text";

export default function BusinessChangeButton() {
  const { user } = useAuth();
  
  // Handle case where component renders before BusinessProvider is ready
  let businessContext;
  try {
    businessContext = useBusinessContext();
  } catch (error) {
    // BusinessProvider not available, return null
    return null;
  }
  
  const { selectedBusiness, userBusinesses, changeBusiness } = businessContext;

  // Don't show button if user has no businesses
  if (!user || userBusinesses.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={changeBusiness}
      className="flex items-center gap-2"
    >
      <Building2 className="w-4 h-4" style={{ color: 'var(--barber-primary)' }} />
      <TranslatableText tag="span" className="max-w-32 truncate">
        {selectedBusiness?.name || "Select Business"}
      </TranslatableText>
      <ChevronDown className="w-4 h-4" />
    </Button>
  );
}