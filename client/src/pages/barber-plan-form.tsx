import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import type { BarberPlan } from "@shared/schema";

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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  image1: z.string().min(1, "Image 1 URL is required"),
  image2: z.string().min(1, "Image 2 URL is required"),
  price1m: z.string().min(1, "1 month price is required"),
  price3m: z.string().min(1, "3 month price is required"),
  price12m: z.string().min(1, "12 month price is required"),
  payment_link: z.string().min(1, "Payment link is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function BarberPlanForm() {
  const { planId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEdit = !!planId && planId !== 'new';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      benefits: [''],
      image1: '',
      image2: '',
      price1m: '',
      price3m: '',
      price12m: '',
      payment_link: '',
    },
  });

  // Load plan data for editing
  const { data: plan, isLoading: planLoading, error: planError } = useQuery<BarberPlan>({
    queryKey: [`/api/barber-plans/${planId}`],
    enabled: isEdit && !!planId,
    select: (data: BarberPlan) => data,
  });

  // Set form values when editing
  useEffect(() => {
    if (isEdit && plan) {
      form.reset({
        title: plan.title,
        subtitle: plan.subtitle,
        benefits: plan.benefits || [''],
        image1: plan.image1,
        image2: plan.image2,
        price1m: plan.price1m,
        price3m: plan.price3m,
        price12m: plan.price12m,
        payment_link: plan.payment_link,
      });
    }
  }, [isEdit, plan, form]);

  const createMutation = useMutation({
    mutationFn: (data: BarberPlanFormData) => apiRequest("POST", "/api/barber-plans", {
      ...data,
      business_id: 1,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans"] });
      toast({
        title: "Success",
        description: "Plan created successfully",
      });
      setLocation("/barber-plans");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create plan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BarberPlanFormData) => apiRequest("PUT", `/api/barber-plans/${planId}`, {
      ...data,
      business_id: 1,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barber-plans"] });
      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
      setLocation("/barber-plans");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addBenefit = () => {
    const currentBenefits = form.getValues('benefits');
    form.setValue('benefits', [...currentBenefits, '']);
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues('benefits');
    if (currentBenefits.length > 1) {
      form.setValue('benefits', currentBenefits.filter((_, i) => i !== index));
    }
  };

  const updateBenefit = (index: number, value: string) => {
    const currentBenefits = form.getValues('benefits');
    const newBenefits = [...currentBenefits];
    newBenefits[index] = value;
    form.setValue('benefits', newBenefits);
  };

  if (isEdit && planLoading) {
    return <div><TranslatableText>Loading...</TranslatableText></div>;
  }

  if (isEdit && planError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle><TranslatableText>Error</TranslatableText></CardTitle>
            <CardDescription>
              <TranslatableText>Failed to load plan data</TranslatableText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/barber-plans")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? (
            <TranslatableText>Edit Barber Plan</TranslatableText>
          ) : (
            <TranslatableText>Create New Barber Plan</TranslatableText>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Plan Details</TranslatableText>
          </CardTitle>
          <CardDescription>
            <TranslatableText>Fill in the plan information below</TranslatableText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Title</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="Plan title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Subtitle</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="Plan subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Image 1 URL</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image1.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Image 2 URL</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image2.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price1m"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>1 Month Price</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="29.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price3m"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>3 Month Price</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="79.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price12m"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>12 Month Price</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="299.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="payment_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Payment Link</TranslatableText></FormLabel>
                    <FormControl>
                      <Input placeholder="https://payment-provider.com/plan-link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel><TranslatableText>Benefits</TranslatableText></FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <Plus className="h-4 w-4 mr-2" />
                    <TranslatableText>Add Benefit</TranslatableText>
                  </Button>
                </div>
                {form.watch('benefits').map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Benefit description"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1"
                    />
                    {form.watch('benefits').length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <TranslatableText>Saving...</TranslatableText>
                  ) : isEdit ? (
                    <TranslatableText>Update Plan</TranslatableText>
                  ) : (
                    <TranslatableText>Create Plan</TranslatableText>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/barber-plans")}
                >
                  <TranslatableText>Cancel</TranslatableText>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}