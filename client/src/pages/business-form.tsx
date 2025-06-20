import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Building2, ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { insertBusinessSchema, type InsertBusiness, type Business, type User } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";

interface BusinessFormProps {
  businessId?: number;
}

export default function BusinessForm({ businessId }: BusinessFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Import translation helper
  const { t } = useTranslationHelper();
  
  // Create validation schema with translated messages
  const businessFormSchema = useMemo(() => {
    return insertBusinessSchema.extend({
      name: z.string().min(1, t("Business name is required")),
      phone: z.string().min(1, t("Phone number is required")),
      email: z.string().email(t("Valid email is required")).min(1, t("Email is required")),
      tax_id: z.string().min(1, t("Tax ID is required")),
      user_id: z.number().min(1, t("Owner is required")),
    });
  }, [t]);

  type BusinessFormData = z.infer<typeof businessFormSchema>;
  
  // Extract ID from URL parameters if not passed as prop
  const [match, params] = useRoute("/businesses/:id/edit");
  const actualBusinessId = businessId || (params?.id ? parseInt(params.id) : undefined);
  const isEditing = Boolean(actualBusinessId);

  const { data: business, isLoading: businessLoading } = useQuery<Business>({
    queryKey: ["/api/businesses", actualBusinessId],
    queryFn: async () => {
      if (!actualBusinessId) throw new Error("No business ID");
      const response = await fetch(`/api/businesses/${actualBusinessId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch business: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isEditing && !!actualBusinessId,
  });

  // Query for merchant users (role_id = 2)
  const { data: merchantUsers } = useQuery<User[]>({
    queryKey: ["/api/users/by-role"],
    queryFn: async () => {
      const response = await fetch("/api/users/by-role?role=merchant", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch merchant users: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      user_id: 0,
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      tax_id: "",
    },
  });

  // Formatting functions
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const formatTaxId = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      // CPF format: 020.393.261-70
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ format: 33.240.999.0001/03
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3.$4/$5');
    }
  };

  const stripFormatting = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Update form when business data loads
  useEffect(() => {
    console.log("Form loading effect:", { business, isEditing, merchantUsersLength: merchantUsers?.length });
    
    if (business && isEditing) {
      console.log("Loading business data into form:", business);
      
      // Find first merchant user of this business as default, or use business owner
      const businessOwner = merchantUsers?.find(user => user.id === business.user_id);
      const firstMerchant = businessOwner || merchantUsers?.[0];
      
      const formData = {
        user_id: firstMerchant?.id || business.user_id || 0,
        name: business.name,
        description: business.description || "",
        address: business.address || "",
        phone: formatPhoneNumber(business.phone || ""),
        email: business.email || "",
        tax_id: formatTaxId(business.tax_id || ""),
      };
      
      console.log("Setting form data:", formData);
      form.reset(formData);
    }
  }, [business, isEditing, merchantUsers, form]);

  const mutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      // Strip formatting from phone and tax_id before sending
      const submitData = {
        ...data,
        phone: stripFormatting(data.phone),
        tax_id: stripFormatting(data.tax_id),
      };

      const url = isEditing ? `/api/businesses/${actualBusinessId}` : "/api/businesses";
      const method = isEditing ? "PUT" : "POST";
      return apiRequest(method, url, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["/api/businesses", actualBusinessId] });
      }
      toast({
        title: t("Success"),
        description: `Business ${isEditing ? t("updated") : t("created")} successfully`,
      });
      navigate("/businesses");
    },
    onError: async (error: any) => {
      // Handle email uniqueness error
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, handle generic error
      }
      
      if (errorData?.error === "Email exists on database") {
        setErrors({ email: t("Email already exists") });
        form.setError("email", { 
          type: "manual", 
          message: t("Email already exists")
        });
        return;
      }
      
      const errorMessage = errorData?.error || `Failed to ${isEditing ? "update" : "create"} business`;
      toast({
        title: t("Error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    setErrors({});
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mb-6">
        <Link href="/businesses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <TranslatableText>Back to Businesses</TranslatableText>
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <TranslatableText tag="h1" className="text-3xl font-bold">
              {isEditing ? "Edit Business" : "Add New Business"}
            </TranslatableText>
            <TranslatableText tag="p" className="text-muted-foreground">
              {isEditing ? "Update business information" : "Create a new business location"}
            </TranslatableText>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle><TranslatableText>Business Information</TranslatableText></CardTitle>
          <CardDescription>
            <TranslatableText>Enter the details for this business location</TranslatableText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Business Name *</TranslatableText></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Description</TranslatableText></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Address</TranslatableText></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter business address"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Phone Number *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Email *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contact@business.com" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Tax ID *</TranslatableText></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00 or 00.000.000/0000-00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const formatted = formatTaxId(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.tax_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatableText>Owner *</TranslatableText>
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select merchant owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {merchantUsers?.map((user: User) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {errors.user_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  <TranslatableText>
                    {mutation.isPending 
                      ? (isEditing ? "Updating..." : "Creating...") 
                      : (isEditing ? "Update Business" : "Create Business")
                    }
                  </TranslatableText>
                </Button>
                <Link href="/businesses">
                  <Button type="button" variant="outline">
<TranslatableText>Cancel</TranslatableText>
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}