import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { insertBusinessSchema, type InsertBusiness, type Business } from "@shared/schema";

interface BusinessFormProps {
  businessId?: number;
}

export default function BusinessForm({ businessId }: BusinessFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Extract ID from URL parameters if not passed as prop
  const [match, params] = useRoute("/businesses/:id/edit");
  const actualBusinessId = businessId || (params?.id ? parseInt(params.id) : undefined);
  const isEditing = Boolean(actualBusinessId);

  const { data: business } = useQuery<Business>({
    queryKey: ["/api/businesses", actualBusinessId],
    enabled: isEditing,
  });

  const form = useForm<InsertBusiness>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: {
      user_id: 1, // Default to first user, should be dynamic based on current user
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      tax_id: "",
    },
  });

  // Update form when business data loads
  if (business && isEditing) {
    form.reset({
      user_id: business.user_id,
      name: business.name,
      description: business.description || "",
      address: business.address || "",
      phone: business.phone || "",
      email: business.email || "",
      tax_id: business.tax_id || "",
    });
  }

  const mutation = useMutation({
    mutationFn: async (data: InsertBusiness) => {
      const url = isEditing ? `/api/businesses/${businessId}` : "/api/businesses";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} business`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["/api/businesses", businessId] });
      }
      toast({
        title: "Success",
        description: `Business ${isEditing ? "updated" : "created"} successfully`,
      });
      navigate("/businesses");
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} business`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBusiness) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Link href="/businesses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Businesses
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Business" : "Add New Business"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update business information" : "Create a new business location"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Enter the details for this business location
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
                    <FormLabel>Business Name *</FormLabel>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business"
                        className="min-h-[100px]"
                        {...field}
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter business address"
                        {...field}
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contact@business.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax identification number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner User ID</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter user ID"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  {mutation.isPending 
                    ? (isEditing ? "Updating..." : "Creating...") 
                    : (isEditing ? "Update Business" : "Create Business")
                  }
                </Button>
                <Link href="/businesses">
                  <Button type="button" variant="outline">
                    Cancel
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