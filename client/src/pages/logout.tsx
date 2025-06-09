import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);

    // Mock logout process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
      setLocation("/login");
    }, 500);
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900">Sign Out</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to sign out of your account?
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isLoading ? "Signing out..." : "Yes, Sign Out"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-barber-primary"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
