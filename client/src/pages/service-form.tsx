import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";

interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: string;
  is_active: boolean;
  business_id?: number;
}

export default function ServiceForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const serviceId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: 30,
    price: "0.00",
    is_active: true,
  });

  const { data: serviceData, isLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}`],
    select: (data: Service) => data,
  });

  const createMutation = useMutation({
    mutationFn: (data: ServiceFormData) => apiRequest("POST", "/api/services", {
      ...data,
      business_id: 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Service created successfully</TranslatableText>,
      });
      setLocation("/services");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to create service</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ServiceFormData) => apiRequest("PUT", `/api/services/${serviceId}`, {
      ...data,
      business_id: 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      queryClient.invalidateQueries({ queryKey: [`/api/services/${serviceId}`] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Service updated successfully</TranslatableText>,
      });
      setLocation("/services");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to update service</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (serviceData && isEdit) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        duration: serviceData.duration || 30,
        price: serviceData.price || "0.00",
        is_active: serviceData.is_active ?? true,
      });
    }
  }, [serviceData, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Service name is required</TranslatableText>,
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Price must be greater than 0</TranslatableText>,
        variant: "destructive",
      });
      return;
    }

    if (!formData.duration || formData.duration < 1) {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Duration must be at least 1 minute</TranslatableText>,
        variant: "destructive",
      });
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/services")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            <TranslatableText>Back to Services</TranslatableText>
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/services")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText>Back to Services</TranslatableText>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? <TranslatableText>Edit Service</TranslatableText> : <TranslatableText>Create New Service</TranslatableText>}
          </h1>
          <p className="text-slate-600">
            {isEdit ? <TranslatableText>Update the service details</TranslatableText> : <TranslatableText>Add a new service to your barbershop</TranslatableText>}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <TranslatableText tag="div" className="text-xl font-semibold text-slate-900">
            Service Information
          </TranslatableText>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name"><TranslatableText>Service Name</TranslatableText></Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price"><TranslatableText>Price ($)</TranslatableText></Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter price in dollars"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">
                  <TranslatableText>Duration (minutes)</TranslatableText>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">
                <TranslatableText>Service Description (Optional)</TranslatableText>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter service description (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                <TranslatableText>Service is active and available for booking</TranslatableText>
              </Label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <TranslatableText>Saving...</TranslatableText>
                ) : isEdit ? (
                  <TranslatableText>Update Service</TranslatableText>
                ) : (
                  <TranslatableText>Create Service</TranslatableText>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/services")}
              >
                <TranslatableText>Cancel</TranslatableText>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}