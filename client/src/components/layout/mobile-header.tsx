import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessChangeButton from "@/components/business-change-button";
import { useBusinessContext } from "@/lib/business-context";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const { selectedBusinessId, setSelectedBusinessId } = useBusinessContext();

  const handleBusinessChange = (businessId: number) => {
    setSelectedBusinessId(businessId);
  };

  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-3 text-xl font-bold text-slate-900">BarberPro</span>
        </div>
        <div className="flex items-center">
          <BusinessChangeButton
            currentBusinessId={selectedBusinessId || undefined}
            onBusinessChange={handleBusinessChange}
          />
        </div>
      </div>
    </header>
  );
}
