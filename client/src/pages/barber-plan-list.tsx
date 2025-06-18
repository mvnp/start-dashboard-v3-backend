import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, ExternalLink, Crown } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BarberPlan } from "@shared/schema";
import { useBusinessContext } from "@/lib/business-context";
import { TranslatableText } from "@/components/translatable-text";

export default function BarberPlanList() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const { selectedBusinessId } = useBusinessContext();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["/api/barber-plans", selectedBusinessId],
    select: (data: BarberPlan[]) => data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/barber-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans", selectedBusinessId] });
      toast({
        title: "Success",
        description: "Barber plan deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete barber plan",
        variant: "destructive",
      });
    },
  });

  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.subtitle && plan.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText tag="h1">Barber Plans</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage subscription plans for barbershops</TranslatableText></p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: 'var(--barber-primary)'}}>
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText tag="h1">Barber Plans</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage subscription plans for barbershops</TranslatableText></p>
          </div>
        </div>
        <Button
          onClick={() => setLocation("/plans/new")}
          style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
        >
          <Plus className="w-4 h-4 mr-2" />
          <TranslatableText>New Plan</TranslatableText>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <Badge variant="secondary" className="text-xs">
                  ID: {plan.id}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {plan.title}
              </CardTitle>
              <p className="text-sm text-slate-600">{plan.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {plan.image1 && (
                  <img
                    src={plan.image1}
                    alt="Plan image 1"
                    className="w-full h-20 object-cover rounded-md"
                  />
                )}
                {plan.image2 && (
                  <img
                    src={plan.image2}
                    alt="Plan image 2"
                    className="w-full h-20 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  {(plan.benefits || []).slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-amber-600 mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                  {(plan.benefits || []).length > 3 && (
                    <li className="text-slate-400">+{(plan.benefits || []).length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-xs text-slate-500">1 Month</div>
                  <div className="font-semibold text-sm">{plan.price1m ? `$${plan.price1m}` : 'N/A'}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-xs text-slate-500">3 Months</div>
                  <div className="font-semibold text-sm">{plan.price3m ? `$${plan.price3m}` : 'N/A'}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <div className="text-xs text-slate-500">12 Months</div>
                  <div className="font-semibold text-sm">{plan.price12m ? `$${plan.price12m}` : 'N/A'}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/plans/${plan.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (plan.payment_link) {
                      window.open(plan.payment_link, '_blank');
                    }
                  }}
                  className="flex-1"
                  disabled={!plan.payment_link}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Pay
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "No plans match your search criteria." : "Get started by creating your first barber plan."}
          </p>
          <Button
            onClick={() => setLocation("/plans/new")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Barber Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this barber plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}