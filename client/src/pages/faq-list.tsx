import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Search, Edit, HelpCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Faq } from "@shared/schema";

interface AuthUser {
  user: {
    userId: number;
    email: string;
    roleId: number;
    businessIds: number[];
    isSuperAdmin: boolean;
  };
}

export default function FaqList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user information for role-based access control
  const { data: currentUser } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
  });

  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  // Check if current user is Super Admin (can create, edit, delete FAQs)
  const isSuperAdmin = currentUser?.user?.isSuperAdmin === true;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/faqs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({
        title: "FAQ deleted",
        description: "The FAQ has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the FAQ. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredFaqs = faqs.filter((faq: Faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || (faq.category || '') === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "published" && faq.is_published) ||
      (statusFilter === "draft" && !faq.is_published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFaqStats = () => {
    const total = faqs.length;
    const published = faqs.filter((f: Faq) => f.is_published).length;
    const draft = faqs.filter((f: Faq) => !f.is_published).length;
    const categories = [...new Set(faqs.map((f: Faq) => f.category))].length;
    
    return { total, published, draft, categories };
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(faqs.map((f: Faq) => f.category).filter(Boolean)));
  };

  const stats = getFaqStats();
  const categories = getUniqueCategories();

  if (isLoading) {
    return (
      <div className="p-6">
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">FAQs</h1>
              <p className="text-slate-600">Manage frequently asked questions</p>
            </div>
          </div>
          {isSuperAdmin && (
            <Link href="/faqs/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New FAQ
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total FAQs</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <HelpCircle className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                </div>
                <Eye className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Draft</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                </div>
                <EyeOff className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Categories</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
                </div>
                <HelpCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FAQs Grid */}
      <div className="grid gap-4">
        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first FAQ"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFaqs.map((faq: Faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{faq.question}</h3>
                      <Badge variant={faq.is_published ? "default" : "secondary"}>
                        {faq.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{faq.category}</Badge>
                    </div>
                    <p className="text-slate-600 mb-3 line-clamp-3">{faq.answer}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span><strong>Order:</strong> {faq.order_index}</span>
                      <span><strong>Created:</strong> {new Date(faq.created_at!).toLocaleDateString()}</span>
                      <span><strong>Updated:</strong> {new Date(faq.updated_at!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/faqs/${faq.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(faq.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}