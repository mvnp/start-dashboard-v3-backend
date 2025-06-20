import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFaqSchema, type Faq } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { z } from "zod";

interface AuthUser {
  user: {
    userId: number;
    email: string;
    roleId: number;
    businessIds: number[];
    isSuperAdmin: boolean;
  };
}

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  order_index: number;
}

const formSchema = insertFaqSchema;

export default function FaqForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/faqs/:id/edit");
  const [createMatch] = useRoute("/faqs/new");
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const queryClient = useQueryClient();
  
  const faqId = params?.id ? parseInt(params.id) : null;
  const isEditing = !!match;
  const isCreating = !!createMatch;

  // Get current user information for role-based access control
  const { data: currentUser } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  // Check if current user is Super Admin (can create, edit, delete FAQs)
  const isSuperAdmin = currentUser?.user?.isSuperAdmin === true;

  // Redirect non-Super Admin users
  if (currentUser && !isSuperAdmin) {
    setLocation("/faqs");
    return null;
  }

  const form = useForm<FaqFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      is_published: true,
      order_index: 0
    }
  });

  // Load FAQ data for editing
  const { data: faq, isLoading: isFaqLoading } = useQuery<Faq>({
    queryKey: [`/api/faqs/${faqId}`],
    enabled: isEditing && !!faqId,
  });

  // Update form when FAQ data is loaded
  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "",
        is_published: faq.is_published ?? true,
        order_index: faq.order_index ?? 0
      });
    }
  }, [faq, form]);

  const createMutation = useMutation({
    mutationFn: (data: FaqFormData) => apiRequest("POST", "/api/faqs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: t("FAQ created"),
        description: t("The FAQ has been successfully created."),
      });
      setLocation("/faqs");
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to create the FAQ. Please try again."),
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FaqFormData) => apiRequest("PUT", `/api/faqs/${faqId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/faqs", faqId] });
      toast({
        title: t("FAQ updated"),
        description: t("The FAQ has been successfully updated."),
      });
      setLocation("/faqs");
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to update the FAQ. Please try again."),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FaqFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const commonCategories = [
    <TranslatableText>General</TranslatableText>,
    <TranslatableText>Appointments</TranslatableText>,
    <TranslatableText>Services</TranslatableText>,
    <TranslatableText>Pricing</TranslatableText>,
    <TranslatableText>Policies</TranslatableText>,
    <TranslatableText>Payment</TranslatableText>,
    <TranslatableText>Location</TranslatableText>,
    <TranslatableText>Hours</TranslatableText>,
    <TranslatableText>Contact</TranslatableText>,
    <TranslatableText>Products</TranslatableText>,
  ];

  // Show loading state while FAQ data is being fetched
  if (isEditing && isFaqLoading) {
    return (
      <div className="p-6 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/faqs")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText>Back to FAQs</TranslatableText>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEditing ? <TranslatableText>Edit FAQ</TranslatableText> : <TranslatableText>New FAQ</TranslatableText>}
            </h1>
            <p className="text-slate-600">
              {isEditing ? <TranslatableText>Update FAQ details</TranslatableText> : <TranslatableText>Create a new frequently asked question</TranslatableText>}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><TranslatableText>FAQ Details</TranslatableText></CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Question */}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatableText>Question *</TranslatableText>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What is your question?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Answer */}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatableText>Answer *</TranslatableText>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed answer to the question..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category and Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Category *</TranslatableText>
                      </FormLabel>
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commonCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Display Order</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <p className="text-sm text-slate-500">
                        <TranslatableText>Lower numbers appear first (0 = highest priority)</TranslatableText>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Published Status */}
              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        <TranslatableText>Published</TranslatableText>
                      </FormLabel>
                      <div className="text-sm text-slate-500">
                        <TranslatableText>Make this FAQ visible to customers</TranslatableText>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation("/faqs")}
                >
                  <TranslatableText>Cancel</TranslatableText>
                </Button>
                <Button type="submit" disabled={isPending}>
                  <TranslatableText>
                    {isPending ? "Saving..." : isEditing ? "Update FAQ" : "Create FAQ"}
                  </TranslatableText>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle><TranslatableText>Tips for Writing Good FAQs</TranslatableText></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-600">
            <div>
              <strong><TranslatableText>Questions:</TranslatableText></strong> <TranslatableText>Write questions from the customer's perspective. Use clear, simple language.</TranslatableText>
            </div>
            <div>
              <strong><TranslatableText>Answers:</TranslatableText></strong> <TranslatableText>Provide complete, helpful answers. Include relevant details but keep it concise.</TranslatableText>
            </div>
            <div>
              <strong><TranslatableText>Categories:</TranslatableText></strong> <TranslatableText>Group related questions together. Common categories include appointments, services, pricing, and policies.</TranslatableText>
            </div>
            <div>
              <strong><TranslatableText>Order:</TranslatableText></strong> <TranslatableText>Put the most important and frequently asked questions first (lower order numbers).</TranslatableText>
            </div>
            <div>
              <strong><TranslatableText>Publishing:</TranslatableText></strong> <TranslatableText>Use draft status to prepare FAQs before making them visible to customers.</TranslatableText>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}