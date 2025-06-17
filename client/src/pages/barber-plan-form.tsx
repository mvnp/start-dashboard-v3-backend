import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BarberPlan } from "@shared/schema";
import { useBusinessContext } from "@/lib/business-context";

interface BarberPlanFormData {
  title: string;
  subtitle: string;
  benefits: string[];
  image1: string;
  image2: string;
  price1m: string;
  price3m: string;
  price12m: string;
  payment_link: string;
}

export default function BarberPlanForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const { selectedBusinessId } = useBusinessContext();
  const isEdit = !!params.id;
  const planId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<BarberPlanFormData>({
    title: "",
    subtitle: "",
    benefits: [""],
    image1: "",
    image2: "",
    price1m: "0",
    price3m: "0",
    price12m: "0",
    payment_link: "",
  });

  const { data: planData, isLoading } = useQuery({
    queryKey: ["/api/barber-plans", planId, selectedBusinessId],
    enabled: isEdit && !!planId,
    select: (data: BarberPlan) => data,
  });

  const createMutation = useMutation({
    mutationFn: (data: BarberPlanFormData) => apiRequest("POST", "/api/barber-plans", {
      ...data,
      business_id: selectedBusinessId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans", selectedBusinessId] });
      toast({
        title: "Success",
        description: "Barber plan created successfully",
      });
      setLocation("/plans");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create barber plan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BarberPlanFormData) => apiRequest("PUT", `/api/barber-plans/${planId}`, {
      ...data,
      business_id: selectedBusinessId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans", selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans", planId, selectedBusinessId] });
      toast({
        title: "Success",
        description: "Barber plan updated successfully",
      });
      setLocation("/plans");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update barber plan",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (planData && isEdit) {
      setFormData({
        title: planData.title || "",
        subtitle: planData.subtitle || "",
        benefits: planData.benefits || [""],
        image1: planData.image1 || "",
        image2: planData.image2 || "",
        price1m: planData.price1m || "0",
        price3m: planData.price3m || "0",
        price12m: planData.price12m || "0",
        payment_link: planData.payment_link || "",
      });
    }
  }, [planData, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form submission - selectedBusinessId:', selectedBusinessId);
    console.log('Form submission - sessionStorage selectedBusinessId:', sessionStorage.getItem('selectedBusinessId'));
    
    if (!selectedBusinessId) {
      toast({
        title: "Error",
        description: "Please select a business first",
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

  const handleInputChange = (field: keyof BarberPlanFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), ""]
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: (prev.benefits || []).map((benefit, i) => i === index ? value : benefit)
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/plans")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
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
        <Button variant="ghost" size="sm" onClick={() => setLocation("/plans")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? "Edit Barber Plan" : "Create New Barber Plan"}
          </h1>
          <p className="text-slate-600">
            {isEdit ? "Update the subscription plan details" : "Create a new subscription plan for barbershops"}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Plan Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Plan Title</Label>
                <Input
                  id="title"
                  placeholder="Enter plan title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Plan Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Enter plan subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image1">Primary Image URL</Label>
                <Input
                  id="image1"
                  placeholder="Enter primary image URL"
                  value={formData.image1}
                  onChange={(e) => handleInputChange('image1', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image2">Secondary Image URL</Label>
                <Input
                  id="image2"
                  placeholder="Enter secondary image URL"
                  value={formData.image2}
                  onChange={(e) => handleInputChange('image2', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price1m">1 Month Price (cents)</Label>
                <Input
                  id="price1m"
                  type="number"
                  placeholder="Enter 1 month price in cents"
                  value={formData.price1m}
                  onChange={(e) => handleInputChange('price1m', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price3m">3 Month Price (cents)</Label>
                <Input
                  id="price3m"
                  type="number"
                  placeholder="Enter 3 month price in cents"
                  value={formData.price3m}
                  onChange={(e) => handleInputChange('price3m', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price12m">12 Month Price (cents)</Label>
                <Input
                  id="price12m"
                  type="number"
                  placeholder="Enter 12 month price in cents"
                  value={formData.price12m}
                  onChange={(e) => handleInputChange('price12m', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="payment_link">Payment Link</Label>
                <Input
                  id="payment_link"
                  placeholder="Enter payment link URL"
                  value={formData.payment_link}
                  onChange={(e) => handleInputChange('payment_link', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Plan Benefits</Label>
                <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
              <div className="space-y-3">
                {formData.benefits?.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Benefit ${index + 1}`}
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      required
                    />
                    {formData.benefits && formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : isEdit ? (
                  "Update Plan"
                ) : (
                  "Create Plan"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/plans")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}