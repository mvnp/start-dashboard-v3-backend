import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Business } from "@shared/schema";

export default function BusinessList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

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
        title: "Success",
        description: "Business deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this business?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading businesses...</div>;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Business Management</h1>
          <p className="text-muted-foreground">Manage your business locations and details</p>
        </div>
        <Link href="/businesses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
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
                    <strong>Address:</strong> {business.address}
                  </p>
                )}
                {business.phone && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Phone:</strong> {business.phone}
                  </p>
                )}
                {business.email && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> {business.email}
                  </p>
                )}
                {business.tax_id && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Tax ID:</strong> {business.tax_id}
                  </p>
                )}
                <div className="pt-2">
                  <Badge variant="secondary">
                    Owner ID: {business.user_id}
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
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first business.</p>
            <Link href="/businesses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Business
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}