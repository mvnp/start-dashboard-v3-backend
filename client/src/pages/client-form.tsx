import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@shared/schema";

interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tax_id?: string;
  address?: string;
}

interface ClientWithUser extends Person {
  user?: {
    email: string;
  };
}

export default function ClientForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/clients/edit/:id");
  const [createMatch] = useRoute("/clients/new");
  const { toast } = useToast();
  const isEdit = !!match;
  const isCreating = !!createMatch;
  const clientId = params?.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tax_id: "",
    address: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: clientMember, isLoading, error } = useQuery({
    queryKey: ["/api/clients", clientId],
    enabled: isEdit && !!clientId,
    select: (data: ClientWithUser) => data,
  });

  console.log("Query state:", { 
    isEdit, 
    clientId, 
    enabled: isEdit && !!clientId,
    isLoading, 
    error,
    hasData: !!clientMember 
  });

  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => apiRequest("POST", "/api/clients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client created",
        description: "The new client has been successfully added.",
      });
      setLocation("/clients");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Failed to create client";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Handle validation errors
      if (error?.response?.data?.details) {
        const validationErrors: Record<string, string> = {};
        error.response.data.details.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => apiRequest("PUT", `/api/clients/${clientId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId] });
      toast({
        title: "Client updated",
        description: "The client has been successfully updated.",
      });
      setLocation("/clients");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || "Failed to update client";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Handle validation errors
      if (error?.response?.data?.details) {
        const validationErrors: Record<string, string> = {};
        error.response.data.details.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
    },
  });

  useEffect(() => {
    console.log("Client form debug:", { isEdit, clientId, clientMember, match, params });
    if (clientMember && isEdit) {
      console.log("Loading client data:", clientMember);
      setFormData({
        first_name: clientMember.first_name || "",
        last_name: clientMember.last_name || "",
        email: clientMember.user?.email || "",
        phone: clientMember.phone || "",
        tax_id: clientMember.tax_id || "",
        address: clientMember.address || "",
      });
    }
  }, [clientMember, isEdit, clientId, match, params]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    if (isEdit) {
      updateClientMutation.mutate(formData);
    } else {
      createClientMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const isSubmitting = createClientMutation.isPending || updateClientMutation.isPending;

  if (isEdit && isLoading) {
    console.log("Showing loading state for client edit");
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isEdit && !isLoading && !clientMember) {
    console.log("No client member data found");
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're trying to edit could not be found.</p>
          <Button onClick={() => setLocation("/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/clients")}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? "Edit Client" : "Add New Client"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isEdit ? "Update client information" : "Enter details for the new client"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  placeholder="Enter tax identification number (optional)"
                  value={formData.tax_id || ""}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address (optional)"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/clients")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-barber-primary hover:bg-barber-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting 
                  ? (isEdit ? "Updating..." : "Creating...") 
                  : (isEdit ? "Update Client" : "Create Client")
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}