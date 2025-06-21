import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Business } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useAuth } from "@/lib/auth";

export default function BusinessList() {
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  // Role-based access control
  const isSuperAdmin = user?.isSuperAdmin;
  const isMerchant = user?.roleId === 2;
  const canCreateBusiness = isSuperAdmin;
  const canDeleteBusiness = isSuperAdmin;
  
  const canEditBusiness = (businessId: number) => {
    if (isSuperAdmin) return true;
    if (isMerchant && user?.businessIds.includes(businessId)) return true;
    return false;
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/businesses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete business");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({
        title: t("Success"),
        description: t("Business deleted successfully"),
      });
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to delete business"),
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm(t("Are you sure you want to delete this business?"))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div><TranslatableText>Loading businesses...</TranslatableText></div>;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{backgroundColor: 'var(--barber-primary)'}}
          >
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText tag="h1">Business Management</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage your business locations and details</TranslatableText></p>
          </div>
        </div>
        <Link href="/businesses/new">
          <Button
            style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
          >
            <Plus className="mr-2 h-4 w-4" />
            <TranslatableText>Add Business</TranslatableText>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businesses?.map((business) => (
          <Card key={business.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Building2 className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Link href={`/businesses/${business.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(business.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl">{business.name}</CardTitle>
              <CardDescription>{business.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {business.address && (
                  <p className="text-sm text-muted-foreground">
                    <strong><TranslatableText>Address:</TranslatableText></strong> {business.address}
                  </p>
                )}
                {business.phone && (
                  <p className="text-sm text-muted-foreground">
                    <strong><TranslatableText>Phone:</TranslatableText></strong> {business.phone}
                  </p>
                )}
                {business.email && (
                  <p className="text-sm text-muted-foreground">
                    <strong><TranslatableText>Email:</TranslatableText></strong> {business.email}
                  </p>
                )}
                {business.tax_id && (
                  <p className="text-sm text-muted-foreground">
                    <strong><TranslatableText>Tax ID:</TranslatableText></strong> {business.tax_id}
                  </p>
                )}
                <div className="pt-2">
                  <Badge variant="secondary">
                    <TranslatableText>Owner ID:</TranslatableText> {business.user_id}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {businesses?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2"><TranslatableText>No businesses found</TranslatableText></h3>
            <p className="text-muted-foreground mb-4"><TranslatableText>Get started by creating your first business.</TranslatableText></p>
            <Link href="/businesses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <TranslatableText>Add Business</TranslatableText>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}