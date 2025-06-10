import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Person, Business, Role } from "@shared/schema";

interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tax_id: string;
  type: string;
  address: string;
  business_id: string;
  role_id: string;
}

export default function ClientForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const clientId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tax_id: "",
    type: "customer",
    address: "",
    business_id: "",
    role_id: "",
  });

  const { data: clientMember, isLoading } = useQuery({
    queryKey: ["/api/clients", clientId],
    enabled: isEdit && !!clientId,
    select: (data: Person) => data,
  });

  // Query for businesses
  const { data: businesses } = useQuery({
    queryKey: ["/api/businesses"],
    select: (data: Business[]) => data,
  });

  // Query for roles
  const { data: roles } = useQuery({
    queryKey: ["/api/roles"],
    select: (data: Role[]) => data,
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (clientMember && isEdit) {
      setFormData({
        first_name: clientMember.first_name || "",
        last_name: clientMember.last_name || "",
        email: "",
        phone: clientMember.phone || "",
        tax_id: clientMember.tax_id || "",
        type: "customer",
        address: "",
        business_id: "",
        role_id: "",
      });
    }
  }, [clientMember, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  placeholder="Enter tax identification number"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Client Type</Label>
                <Select onValueChange={(value) => handleInputChange('type', value)} value={formData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="business">Business</Label>
                <Select onValueChange={(value) => handleInputChange('business_id', value)} value={formData.business_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses?.map((business) => (
                      <SelectItem key={business.id} value={business.id.toString()}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role_id', value)} value={formData.role_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.type.charAt(0).toUpperCase() + role.type.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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