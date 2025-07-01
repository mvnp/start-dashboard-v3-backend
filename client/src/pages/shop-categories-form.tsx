import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { TranslatableText } from "@/components/translatable-text";
import { useBusinessContext } from "@/hooks/use-business-context";
import { apiRequest } from "@/lib/queryClient";
import { useTranslationHelper } from "@/lib/translation-helper";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  order: z.number().min(0),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ShopCategoriesForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const categoryId = params.categoryId;
  const { selectedBusinessId } = useBusinessContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslationHelper();
  const isEdit = !!categoryId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
      featured: false,
    },
  });

  const { data: category, isLoading } = useQuery<any>({
    queryKey: ["/api/shop-categories", categoryId],
    enabled: isEdit && !!categoryId && !isNaN(Number(categoryId)) && categoryId !== "new",
  });

  useEffect(() => {
    if (category && isEdit) {
      form.reset({
        name: category.name,
        description: category.description || "",
        order: category.order,
        featured: category.featured,
      });
    }
  }, [category, form, isEdit]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const url = isEdit ? `/api/shop-categories/${categoryId}` : "/api/shop-categories";
      const method = isEdit ? "PUT" : "POST";

      return apiRequest(method, url, {
        ...data,
        business_id: selectedBusinessId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-categories"] });
      toast({
        title: t("Success"),
        description: isEdit 
          ? t("Shop category updated successfully")
          : t("Shop category created successfully"),
      });
      setLocation("/shop-categories");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.response?.data?.error || t("Failed to save shop category"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!selectedBusinessId && categoryId) {
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
          <ShoppingCart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? (
              <TranslatableText>Edit Shop Category</TranslatableText>
            ) : (
              <TranslatableText>Add Shop Category</TranslatableText>
            )}
          </h1>
          <p className="text-white/80">
            <TranslatableText>Create and organize categories for your shop products</TranslatableText>
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Button
          variant="outline"
          onClick={() => setLocation("/shop-categories")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back to Categories</TranslatableText>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? (
                <TranslatableText>Category Details</TranslatableText>
              ) : (
                <TranslatableText>New Category</TranslatableText>
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
                        <TranslatableText>Category Name</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t("e.g., Hair Care, Accessories")} {...field} />
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
                          placeholder={t("Brief description of this category...")}
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

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>
                          <TranslatableText>Featured Category</TranslatableText>
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          <TranslatableText>Show this category prominently in your shop</TranslatableText>
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

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1"
                  >
                    {mutation.isPending ? (
                      <TranslatableText>Saving...</TranslatableText>
                    ) : isEdit ? (
                      <TranslatableText>Update Category</TranslatableText>
                    ) : (
                      <TranslatableText>Create Category</TranslatableText>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/shop-categories")}
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