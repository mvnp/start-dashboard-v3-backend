import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TranslatableText } from "@/components/translatable-text";
import { useBusinessContext } from "@/lib/business-context";
import { apiRequest } from "@/lib/queryClient";
import { useTranslationHelper } from "@/lib/translation-helper";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().min(0),
  status: z.boolean(),
  order: z.number().min(0),
  featured: z.boolean(),
  category_id: z.number().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShopProductsFormProps {
  productId?: string;
}

interface ShopCategory {
  id: number;
  name: string;
}

export default function ShopProductsForm({ productId }: ShopProductsFormProps) {
  const [, setLocation] = useLocation();
  const { selectedBusinessId } = useBusinessContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslationHelper();
  const isEdit = !!productId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: 0,
      status: true,
      order: 0,
      featured: false,
      category_id: null,
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/shop-products", productId],
    enabled: !!productId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/shop-categories", selectedBusinessId],
    enabled: true,
  });

  useEffect(() => {
    if (product && isEdit) {
      form.reset({
        name: product.name,
        description: product.description || "",
        image: product.image || "",
        price: product.price,
        status: product.status,
        order: product.order,
        featured: product.featured,
        category_id: product.category_id,
      });
    }
  }, [product, form, isEdit]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const url = isEdit ? `/api/shop-products/${productId}` : "/api/shop-products";
      const method = isEdit ? "PUT" : "POST";

      return apiRequest(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(selectedBusinessId && { "x-selected-business-id": selectedBusinessId.toString() }),
        },
        body: JSON.stringify({
          ...data,
          business_id: selectedBusinessId,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-products"] });
      toast({
        title: t("Success"),
        description: isEdit 
          ? t("Shop product updated successfully")
          : t("Shop product created successfully"),
      });
      setLocation("/shop-products");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.response?.data?.error || t("Failed to save shop product"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!selectedBusinessId && productId) {
      toast({
        title: t("Error"),
        description: t("Please select a business first"),
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  if (isEdit && isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <TranslatableText>Loading...</TranslatableText>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-4 mb-6 bg-barber-primary text-white p-4 rounded-lg">
        <div className="p-2 bg-white/20 rounded-lg">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? (
              <TranslatableText>Edit Shop Product</TranslatableText>
            ) : (
              <TranslatableText>Add Shop Product</TranslatableText>
            )}
          </h1>
          <p className="text-white/80">
            <TranslatableText>Manage your shop inventory and product details</TranslatableText>
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Button
          variant="outline"
          onClick={() => setLocation("/shop-products")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back to Products</TranslatableText>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? (
                <TranslatableText>Product Details</TranslatableText>
              ) : (
                <TranslatableText>New Product</TranslatableText>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Product Name</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("e.g., Premium Hair Oil, Styling Gel")} {...field} />
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
                      <FormLabel>
                        <TranslatableText>Description</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("Detailed description of your product...")}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Image URL</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t("https://example.com/product-image.jpg")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <TranslatableText>Price</TranslatableText>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            placeholder={t("0.00")}
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <TranslatableText>Display Order</TranslatableText>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder={t("0")}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Category</TranslatableText>
                      </FormLabel>
                      <Select 
                        value={field.value?.toString() || ""} 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select a category")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">
                            <TranslatableText>No Category</TranslatableText>
                          </SelectItem>
                          {categories.map((category: ShopCategory) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>
                            <TranslatableText>Active Status</TranslatableText>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            <TranslatableText>Make this product available for purchase</TranslatableText>
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>
                            <TranslatableText>Featured Product</TranslatableText>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            <TranslatableText>Highlight this product in your shop</TranslatableText>
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1"
                  >
                    {mutation.isPending ? (
                      <TranslatableText>Saving...</TranslatableText>
                    ) : isEdit ? (
                      <TranslatableText>Update Product</TranslatableText>
                    ) : (
                      <TranslatableText>Create Product</TranslatableText>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/shop-products")}
                  >
                    <TranslatableText>Cancel</TranslatableText>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}