import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Business } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { TranslatableText } from "@/components/translatable-text";

interface BusinessSelectorModalProps {
  isOpen: boolean;
  onBusinessSelected: (businessId: number) => void;
  onLogout: () => void;
  isInitialSelection?: boolean;
  onCancel?: () => void;
}

export default function BusinessSelectorModal({ 
  isOpen, 
  onBusinessSelected, 
  onLogout,
  isInitialSelection = true,
  onCancel
}: BusinessSelectorModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

  // Fetch user businesses
  const { data: userBusinesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
    enabled: isOpen && !!user,
  });

  const handleBusinessSelect = (businessId: number) => {
    setSelectedBusinessId(businessId);
  };

  const handleConfirm = () => {
    if (selectedBusinessId) {
      // Store selected business in sessionStorage
      sessionStorage.setItem("selectedBusinessId", selectedBusinessId.toString());
      onBusinessSelected(selectedBusinessId);
      toast({
        title: <TranslatableText>Business Selected</TranslatableText>,
        description: `You're now working with ${userBusinesses.find(b => b.id === selectedBusinessId)?.name}`,
      });
    }
  };

  const handleModalClose = () => {
    // For initial selection, force logout if no business selected
    if (isInitialSelection && !selectedBusinessId) {
      toast({
        title: <TranslatableText>Business Selection Required</TranslatableText>,
        description: <TranslatableText>You must select a business to continue. Logging out...</TranslatableText>,
        variant: "destructive",
      });
      setTimeout(() => {
        onLogout();
      }, 1500);
    }
    // For voluntary business changes, allow canceling
    else if (!isInitialSelection && onCancel) {
      onCancel();
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => handleModalClose()}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <TranslatableText tag="div" className="text-lg">Loading your businesses...</TranslatableText>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => handleModalClose()}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-barber-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <TranslatableText>Select Your Active Business</TranslatableText>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <TranslatableText tag="p" className="text-muted-foreground">
            You have access to multiple businesses. Please select which business you'd like to work with:
          </TranslatableText>
          
          <div className="grid gap-3">
            {userBusinesses.map((business) => (
              <Card 
                key={business.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBusinessId === business.id 
                    ? 'ring-2 ring-barber-primary bg-barber-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleBusinessSelect(business.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{business.name}</h3>
                      {business.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {business.description}
                        </p>
                      )}
                      {business.address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {business.address}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {selectedBusinessId === business.id && (
                        <Badge variant="default" className="bg-barber-primary">
                          <TranslatableText>Selected</TranslatableText>
                        </Badge>
                      )}
                      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                        {selectedBusinessId === business.id && (
                          <div className="w-3 h-3 rounded-full bg-barber-primary"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!selectedBusinessId}
              className="flex-1"
            >
              <TranslatableText>Continue with Selected Business</TranslatableText>
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <TranslatableText>Logout</TranslatableText>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}