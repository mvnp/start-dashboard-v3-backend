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
import { Plus, Search, Edit, Trash2, Copy, Settings, Clock, DollarSign, User } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useAuth } from "@/lib/auth";

export default function ServiceList() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();

  const { data: services, isLoading } = useQuery({
    queryKey: user?.isSuperAdmin ? ["/api/services"] : ["/api/services", selectedBusinessId],
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      const queryKey = user?.isSuperAdmin ? ["/api/services"] : ["/api/services", selectedBusinessId];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: t("Success"),
        description: t("Service deleted successfully"),
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to delete service"),
        variant: "destructive",
      });
    },
  });

  const cloneServiceMutation = useMutation({
    mutationFn: async (service: Service) => {
      const clonedService = {
        name: `${service.name} (Copy)`,
        description: service.description,
        price: service.price,
        duration: service.duration,
        is_active: service.is_active,
        business_id: selectedBusinessId
      };
      
      return apiRequest("POST", "/api/services", clonedService);
    },
    onSuccess: () => {
      const queryKey = user?.isSuperAdmin ? ["/api/services"] : ["/api/services", selectedBusinessId];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: t("Success"),
        description: t("Service cloned successfully"),
      });
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to clone service"),
        variant: "destructive",
      });
    },
  });

  const filteredServices = Array.isArray(services) ? services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const formatPrice = (price: string | null) => {
    if (!price) return "$0.00";
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "0min";
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
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
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText tag="h1">Services</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage your barbershop services</TranslatableText></p>
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
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText tag="h1">Services</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage your barbershop services</TranslatableText></p>
          </div>
        </div>
        <Button
          onClick={() => setLocation("/services/new")}
          style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
        >
          <Plus className="w-4 h-4 mr-2" />
          <TranslatableText>New Service</TranslatableText>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  <Badge variant="secondary" className="text-xs">
                    <TranslatableText>ID:</TranslatableText> {service.id}
                  </Badge>
                </div>
                <Badge 
                  variant={service.is_active ? "default" : "secondary"} 
                  className={service.is_active ? "bg-green-100 text-green-800" : ""}
                >
                  <TranslatableText>{service.is_active ? "Active" : "Inactive"}</TranslatableText>
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {service.name}
              </CardTitle>
              <p className="text-sm text-slate-600 line-clamp-2">{service.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">{formatPrice(service.price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600">{formatDuration(service.duration)}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mt-2">
                {service.description || "No description available"}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/services/${service.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  <TranslatableText>Edit</TranslatableText>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cloneServiceMutation.mutate(service)}
                  disabled={cloneServiceMutation.isPending}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2"><TranslatableText>No services found</TranslatableText></h3>
          <p className="text-gray-600 mb-4">
            <TranslatableText>{searchTerm ? "No services match your search criteria." : "Get started by creating your first service."}</TranslatableText>
          </p>
          <Button
            onClick={() => setLocation("/services/new")}
            style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
          >
            <Plus className="w-4 h-4 mr-2" />
            <TranslatableText>Create New Service</TranslatableText>
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <TranslatableText>Delete Service</TranslatableText>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <TranslatableText>Are you sure you want to delete this service? This action cannot be undone.</TranslatableText>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <TranslatableText>Cancel</TranslatableText>
            </AlertDialogCancel>
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