import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  User,
  UserCheck,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useAuth } from "@/lib/auth";

interface Client extends Person {
  email?: string;
}

export default function ClientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["/api/clients", selectedBusinessId],
    select: (data: Client[]) => data,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    enabled: user?.isSuperAdmin || !!selectedBusinessId, // Super Admin can fetch without business selection
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", selectedBusinessId] });
      toast({
        title: t("Client deleted"),
        description: t("The client has been successfully removed."),
      });
    },
    onError: async (error: any) => {
      // Try to extract error details from response
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, use generic error
      }
      
      // Show specific error message if available
      const errorMessage = errorData?.message || errorData?.error || <TranslatableText>Failed to delete client. Please try again.</TranslatableText>;
      const errorTitle = errorData?.error === <TranslatableText>Cannot delete client with existing appointments</TranslatableText> 
        ? <TranslatableText>Cannot Delete Client</TranslatableText> 
        : <TranslatableText>Error</TranslatableText>;
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const filteredClients = (clients || []).filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    if (typeof dateString === 'string') {
      return new Date(dateString + 'T12:00:00').toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <TranslatableText tag="h1" className="text-3xl font-bold text-slate-900">Client Management</TranslatableText>
            <TranslatableText tag="p" className="text-slate-600 mt-2">Manage your barbershop clients</TranslatableText>
          </div>
        </div>
        <Link href="/clients/new">
          <Button className="mt-4 sm:mt-0 bg-barber-primary hover:bg-barber-secondary">
            <Plus className="w-4 h-4 mr-2" />
            <TranslatableText>Add Client</TranslatableText>
          </Button>
        </Link>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
              <p className="text-sm text-slate-600"><TranslatableText>Total Clients</TranslatableText></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle><TranslatableText>Clients</TranslatableText></CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchTerm ? "No clients found matching your search." : "No clients yet."}
              </p>
              {!searchTerm && (
                <Link href="/clients/new">
                  <Button className="mt-4 bg-barber-primary hover:bg-barber-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    <TranslatableText>Add First Client</TranslatableText>
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClients.map((client) => {
                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-barber-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {client.first_name[0]}{client.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{client.first_name} {client.last_name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {client.email || "No email"}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {client.phone || "No phone"}
                          </div>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-slate-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {client.address || "No address"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                          <User className="w-3 h-3 mr-1" />
                          <TranslatableText>Customer</TranslatableText>
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">
                          <TranslatableText>Tax ID:</TranslatableText> {client.tax_id}
                        </p>
                        <p className="text-xs text-slate-500">
                          <TranslatableText>Since:</TranslatableText> {formatDate(client.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/clients/edit/${client.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle><TranslatableText>Delete Client</TranslatableText></AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {client.first_name} {client.last_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                <TranslatableText>Cancel</TranslatableText>
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteClientMutation.mutate(client.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteClientMutation.isPending}
                              >
                                {deleteClientMutation.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}