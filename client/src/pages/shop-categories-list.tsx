import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trash2, Edit, Plus, Copy, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TranslatableText } from "@/components/translatable-text";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

interface ShopCategory {
  id: number;
  name: string;
  description: string | null;
  order: number;
  featured: boolean;
  business_id: number;
  created_at: string;
  updated_at: string;
}

export default function ShopCategoriesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery<ShopCategory[]>({
    queryKey: ["/api/shop-categories", selectedBusinessId],
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/shop-categories/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-categories"] });
      toast({
        title: "Success",
        description: "Shop category deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete shop category",
        variant: "destructive",
      });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (originalCategory: ShopCategory) => {
      return apiRequest("POST", "/api/shop-categories", {
        name: `${originalCategory.name} (Copy)`,
        description: originalCategory.description,
        order: Math.max(...(categories as ShopCategory[]).map((c: ShopCategory) => c.order), 0) + 1,
        featured: false,
        business_id: selectedBusinessId || originalCategory.business_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-categories"] });
      toast({
        title: "Success",
        description: "Shop category cloned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to clone shop category",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shop category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClone = (category: ShopCategory) => {
    cloneMutation.mutate(category);
  };

  const filteredCategories = categories.filter((category: ShopCategory) => {
    if (onlyFeatured && !category.featured) return false;
    if (searchTerm && !category.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <TranslatableText>Loading...</TranslatableText>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64 text-red-500">
          <TranslatableText>Error loading shop categories</TranslatableText>
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
            <TranslatableText>Shop Categories</TranslatableText>
          </h1>
          <p className="text-white/80">
            <TranslatableText>Organize your products into categories for better navigation</TranslatableText>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="featured-only"
            checked={onlyFeatured}
            onCheckedChange={setOnlyFeatured}
          />
          <Label htmlFor="featured-only">
            <TranslatableText>Featured only</TranslatableText>
          </Label>
        </div>
        <Link href="/shop-categories/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <TranslatableText>Add Category</TranslatableText>
          </Button>
        </Link>
      </div>

      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              <TranslatableText>No shop categories found</TranslatableText>
            </h3>
            <p className="text-muted-foreground mb-4">
              <TranslatableText>Get started by creating your first product category.</TranslatableText>
            </p>
            <Link href="/shop-categories/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>Add First Category</TranslatableText>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category: ShopCategory) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  {category.featured && (
                    <Badge variant="secondary" className="ml-2">
                      <TranslatableText>Featured</TranslatableText>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>
                    <TranslatableText>Order</TranslatableText>: {category.order}
                  </span>
                  <span>
                    <TranslatableText>ID</TranslatableText>: {category.id}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClone(category)}
                    disabled={cloneMutation.isPending}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={`/shop-categories/edit/${category.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}