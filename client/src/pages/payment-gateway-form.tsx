import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PaymentGateway } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";

interface PaymentGatewayFormData {
  name: string;
  type: string;
  api_url: string;
  api_key: string;
  token: string;
  email: string;
  staff_id: number;
  is_active: boolean;
}

export default function PaymentGatewayForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const gatewayId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<PaymentGatewayFormData>({
    name: "",
    type: "",
    api_url: "",
    api_key: "",
    token: "",
    email: "",
    staff_id: 0,
    is_active: true,
  });

  const { data: gatewayData, isLoading } = useQuery({
    queryKey: ["/api/payment-gateways", gatewayId],
    enabled: isEdit && !!gatewayId,
    select: (data: PaymentGateway) => data,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Staff[]) => data,
  });

  const createMutation = useMutation({
    mutationFn: (data: PaymentGatewayFormData) => apiRequest("POST", "/api/payment-gateways", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-gateways"] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Payment gateway created successfully</TranslatableText>,
      });
      setLocation("/payment-gateways");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to create payment gateway</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PaymentGatewayFormData) => apiRequest("PUT", `/api/payment-gateways/${gatewayId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-gateways"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-gateways", gatewayId] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Payment gateway updated successfully</TranslatableText>,
      });
      setLocation("/payment-gateways");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to update payment gateway</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (gatewayData && isEdit) {
      setFormData({
        name: gatewayData.name,
        type: gatewayData.type,
        api_url: gatewayData.api_url,
        api_key: gatewayData.api_key,
        token: gatewayData.token,
        email: gatewayData.email,
        staff_id: gatewayData.staff_id,
        is_active: gatewayData.is_active,
      });
    }
  }, [gatewayData, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.staff_id === 0) {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Please select a staff member</TranslatableText>,
        variant: "destructive",
      });
      return;
    }

    if (!formData.type) {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Please select a payment gateway type</TranslatableText>,
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

  const handleInputChange = (field: keyof PaymentGatewayFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getDefaultApiUrl = (type: string) => {
    switch (type) {
      case "Mercado Pago":
        return "https://api.mercadopago.com";
      case "Asaas":
        return "https://www.asaas.com/api/v3";
      case "Pagbank":
        return "https://ws.pagseguro.uol.com.br";
      default:
        return "";
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type,
      api_url: getDefaultApiUrl(type)
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/payment-gateways")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
              <TranslatableText>Back to Payment Gateways</TranslatableText>
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
        <Button variant="ghost" size="sm" onClick={() => setLocation("/payment-gateways")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText>Back to Payment Gateways</TranslatableText>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? <TranslatableText>Edit Payment Gateway</TranslatableText> : <TranslatableText>Create New Payment Gateway</TranslatableText>}
          </h1>
          <p className="text-slate-600">
            {isEdit ? <TranslatableText>Update the payment gateway details</TranslatableText> : <TranslatableText>Add a new payment processing system</TranslatableText>}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            <TranslatableText>Gateway Information</TranslatableText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name"><TranslatableText>Gateway Name</TranslatableText></Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Mercado Pago"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type"><TranslatableText>Gateway Type</TranslatableText></Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleTypeChange(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mercado Pago"><TranslatableText>Mercado Pago</TranslatableText></SelectItem>
                    <SelectItem value="Asaas"><TranslatableText>Asaas</TranslatableText></SelectItem>
                    <SelectItem value="Pagbank"><TranslatableText>Pagbank</TranslatableText></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="api_url"><TranslatableText>API URL</TranslatableText></Label>
                <Input
                  id="api_url"
                  placeholder="https://api.example.com"
                  value={formData.api_url}
                  onChange={(e) => handleInputChange('api_url', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email"><TranslatableText>Email</TranslatableText></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="gateway@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="api_key"><TranslatableText>API Key</TranslatableText></Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="Enter your API key"
                  value={formData.api_key}
                  onChange={(e) => handleInputChange('api_key', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="token"><TranslatableText>Token</TranslatableText></Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter your token"
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="staff_id"><TranslatableText>Assigned Staff</TranslatableText></Label>
                <Select 
                  value={formData.staff_id ? formData.staff_id.toString() : ""} 
                  onValueChange={(value) => handleInputChange('staff_id', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
                        {staffMember.first_name} {staffMember.last_name} - {staffMember.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', !!checked)}
                />
                <Label htmlFor="is_active">
                  <TranslatableText>Gateway is active</TranslatableText>
                </Label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <TranslatableText>Saving...</TranslatableText>
                ) : isEdit ? (
                  <TranslatableText>Update Gateway</TranslatableText>
                ) : (
                  <TranslatableText>Create Gateway</TranslatableText>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/payment-gateways")}
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