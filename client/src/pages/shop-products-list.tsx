import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trash2, Edit, Plus, Copy, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TranslatableText } from "@/components/translatable-text";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

interface ShopProduct {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  status: boolean;
  order: number;
  featured: boolean;
  category_id: number | null;
  business_id: number;
  created_at: string;
  updated_at: string;
}

interface ShopCategory {
  id: number;
  name: string;
}

export default function ShopProductsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyActive, setOnlyActive] = useState(false);
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery<ShopProduct[]>({
    queryKey: ["/api/shop-products", selectedBusinessId],
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const { data: categories = [] } = useQuery<ShopCategory[]>({
    queryKey: ["/api/shop-categories", selectedBusinessId],
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/shop-products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-products"] });
      toast({
        title: "Success",
        description: "Shop product deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete shop product",
        variant: "destructive",
      });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (originalProduct: ShopProduct) => {
      return apiRequest("/api/shop-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(selectedBusinessId && { "x-selected-business-id": selectedBusinessId.toString() }),
        },
        body: JSON.stringify({
          name: `${originalProduct.name} (Copy)`,
          description: originalProduct.description,
          image: originalProduct.image,
          price: originalProduct.price,
          status: true,
          order: Math.max(...products.map((p: ShopProduct) => p.order), 0) + 1,
          featured: false,
          category_id: originalProduct.category_id,
          business_id: selectedBusinessId || originalProduct.business_id,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop-products"] });
      toast({
        title: "Success",
        description: "Shop product cloned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to clone shop product",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shop product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClone = (product: ShopProduct) => {
    cloneMutation.mutate(product);
  };

  const filteredProducts = products.filter((product: ShopProduct) => {
    if (onlyFeatured && !product.featured) return false;
    if (onlyActive && !product.status) return false;
    if (selectedCategory !== "all" && product.category_id !== parseInt(selectedCategory)) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((cat: ShopCategory) => cat.id === categoryId);
    return category?.name || "Unknown Category";
  };

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
          <TranslatableText>Error loading shop products</TranslatableText>
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
            <TranslatableText>Shop Products</TranslatableText>
          </h1>
          <p className="text-white/80">
            <TranslatableText>Manage your shop inventory and product catalog</TranslatableText>
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <TranslatableText>All Categories</TranslatableText>
              </SelectItem>
              {categories.map((category: ShopCategory) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured-only"
              checked={onlyFeatured}
              onCheckedChange={setOnlyFeatured}
            />
            <Label htmlFor="featured-only">
              <TranslatableText>Featured</TranslatableText>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active-only"
              checked={onlyActive}
              onCheckedChange={setOnlyActive}
            />
            <Label htmlFor="active-only">
              <TranslatableText>Active</TranslatableText>
            </Label>
          </div>
          <Link href="/shop-products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <TranslatableText>Add Product</TranslatableText>
            </Button>
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              <TranslatableText>No shop products found</TranslatableText>
            </h3>
            <p className="text-muted-foreground mb-4">
              <TranslatableText>Get started by adding your first product to the shop.</TranslatableText>
            </p>
            <Link href="/shop-products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>Add First Product</TranslatableText>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: ShopProduct) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    {product.featured && (
                      <Badge variant="secondary" className="text-xs">
                        <TranslatableText>Featured</TranslatableText>
                      </Badge>
                    )}
                    <Badge variant={product.status ? "default" : "secondary"} className="text-xs">
                      {product.status ? (
                        <TranslatableText>Active</TranslatableText>
                      ) : (
                        <TranslatableText>Inactive</TranslatableText>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      <TranslatableText>Order</TranslatableText>: {product.order}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <TranslatableText>Category</TranslatableText>: {getCategoryName(product.category_id)}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClone(product)}
                      disabled={cloneMutation.isPending}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Link href={`/shop-products/edit/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}