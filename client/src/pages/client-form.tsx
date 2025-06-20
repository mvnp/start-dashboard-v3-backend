import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute, useParams } from "wouter";
import { ArrowLeft, Save, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";

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
  const params = useParams();
  const [editMatch] = useRoute("/clients/edit/:id");
  const [createMatch] = useRoute("/clients/new");
  const { toast } = useToast();
  const isEdit = !!editMatch;
  const isCreating = !!createMatch;
  const clientId = isEdit && params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tax_id: "",
    address: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Apply mask based on length
    if (numbers.length <= 10) {
      // Format: (48) 9189-3313
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      // Format: (48) 99189-3313
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const formatTaxId = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF format: 020.393.261-70
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ format: 33.240.999.0001/03
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3.$4/$5');
    }
  };

  const { data: clientMember, isLoading, error } = useQuery<ClientWithUser>({
    queryKey: [`/api/clients/${clientId}`, selectedBusinessId] as const,
  });



  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => apiRequest("POST", "/api/clients", {
      ...data,
      business_id: selectedBusinessId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", selectedBusinessId] });
      toast({
        title: <TranslatableText>Client created</TranslatableText>,
        description: <TranslatableText>The new client has been successfully added.</TranslatableText>,
      });
      setLocation("/clients");
    },
    onError: async (error: any) => {
      // Try to extract error from response
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, handle generic error
      }
      
      // Handle email exists error specifically
      if (errorData?.error === "Email already exists" || errorData?.error === "Email exists on database") {
        setErrors({ email: "Email exists on database" });
        return;
      }
      
      // Handle other validation errors
      if (errorData?.details) {
        const validationErrors: Record<string, string> = {};
        errorData.details.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
        return;
      }
      
      const errorMessage = errorData?.error || "Failed to create client";
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => apiRequest("PUT", `/api/clients/${clientId}`, {
      ...data,
      business_id: selectedBusinessId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`, selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId] });
      toast({
        title: <TranslatableText>Client updated</TranslatableText>,
        description: <TranslatableText>The client has been successfully updated.</TranslatableText>,
      });
      setLocation("/clients");
    },
    onError: async (error: any) => {
      // Try to extract error from response
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, handle generic error
      }
      
      // Handle email exists error specifically
      if (errorData?.error === "Email already exists" || errorData?.error === "Email exists on database") {
        setErrors({ email: "Email exists on database" });
        return;
      }
      
      // Handle other validation errors
      if (errorData?.details) {
        const validationErrors: Record<string, string> = {};
        errorData.details.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
        return;
      }
      
      const errorMessage = errorData?.error || "Failed to update client";
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (clientMember && isEdit && 'first_name' in clientMember) {
      setFormData({
        first_name: clientMember.first_name || "",
        last_name: clientMember.last_name || "",
        email: clientMember.user?.email || "",
        phone: clientMember.phone ? formatPhoneNumber(clientMember.phone) : "",
        tax_id: clientMember.tax_id ? formatTaxId(clientMember.tax_id) : "",
        address: clientMember.address || "",
      });
    }
  }, [clientMember, isEdit, clientId]);

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

  const stripFormatting = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission by removing formatting from phone and tax_id
    const submitData = {
      ...formData,
      phone: stripFormatting(formData.phone),
      tax_id: formData.tax_id ? stripFormatting(formData.tax_id) : "",
    };
    
    if (isEdit) {
      updateClientMutation.mutate(submitData);
    } else {
      createClientMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'tax_id') {
      formattedValue = formatTaxId(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
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
          <h2 className="text-xl font-semibold text-red-600 mb-2"><TranslatableText>Client Not Found</TranslatableText></h2>
          <p className="text-gray-600 mb-4"><TranslatableText>The client you're trying to edit could not be found.</TranslatableText></p>
          <Button onClick={() => setLocation("/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            <TranslatableText>Back to Clients</TranslatableText>
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
          <TranslatableText>Back to Clients</TranslatableText>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <TranslatableText tag="h1" className="text-3xl font-bold text-slate-900">
              {isEdit ? "Edit Client" : "Add New Client"}
            </TranslatableText>
            <TranslatableText tag="p" className="text-slate-600 mt-2">
              {isEdit ? "Update client information" : "Enter details for the new client"}
            </TranslatableText>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <TranslatableText>Client Information</TranslatableText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name"><TranslatableText>First Name *</TranslatableText></Label>
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
                <Label htmlFor="last_name"><TranslatableText>Last Name *</TranslatableText></Label>
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
                <Label htmlFor="email"><TranslatableText>Email Address *</TranslatableText></Label>
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
                <Label htmlFor="phone"><TranslatableText>Phone Number *</TranslatableText></Label>
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
                <Label htmlFor="tax_id"><TranslatableText>Tax ID</TranslatableText></Label>
                <Input
                  id="tax_id"
                  placeholder="Enter tax identification number (optional)"
                  value={formData.tax_id || ""}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address"><TranslatableText>Address</TranslatableText></Label>
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
<TranslatableText>Cancel</TranslatableText>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-barber-primary hover:bg-barber-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                <TranslatableText>
                  {isSubmitting 
                    ? (isEdit ? "Updating..." : "Creating...") 
                    : (isEdit ? "Update Client" : "Create Client")
                  }
                </TranslatableText>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}