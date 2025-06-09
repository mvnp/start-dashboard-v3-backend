import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, CreditCard, Globe, Key, Mail, User } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PaymentGateway, Staff } from "@shared/schema";

export default function PaymentGatewayList() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: gateways = [], isLoading } = useQuery({
    queryKey: ["/api/payment-gateways"],
    select: (data: PaymentGateway[]) => data,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Staff[]) => data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/payment-gateways/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-gateways"] });
      toast({
        title: "Success",
        description: "Payment gateway deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete payment gateway",
        variant: "destructive",
      });
    },
  });

  const getStaffName = (staffId: number) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Unknown Staff';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Mercado Pago': return 'bg-blue-100 text-blue-800';
      case 'Asaas': return 'bg-green-100 text-green-800';
      case 'Pagbank': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGateways = gateways.filter(gateway => {
    const staffName = getStaffName(gateway.staff_id).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return gateway.name.toLowerCase().includes(searchLower) || 
           gateway.type.toLowerCase().includes(searchLower) ||
           gateway.email.toLowerCase().includes(searchLower) ||
           staffName.includes(searchLower);
  });

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Gateways</h1>
            <p className="text-slate-600 mt-2">Manage payment processing systems</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment Gateways</h1>
          <p className="text-slate-600 mt-2">Manage payment processing systems</p>
        </div>
        <Button
          onClick={() => setLocation("/payments/new")}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Gateway
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search gateways..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGateways.map((gateway) => (
          <Card key={gateway.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <Badge variant="secondary" className="text-xs">
                    ID: {gateway.id}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(gateway.type)}>
                    {gateway.type}
                  </Badge>
                  <Badge variant={gateway.is_active ? "default" : "secondary"}>
                    {gateway.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {gateway.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600 truncate">{gateway.api_url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">
                    Key: {gateway.api_key.substring(0, 12)}...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-slate-600">{gateway.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-slate-600">{getStaffName(gateway.staff_id)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-md">
                <p className="text-xs text-slate-600">
                  Token: {gateway.token.substring(0, 16)}...
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/payments/${gateway.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(gateway.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGateways.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment gateways found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "No gateways match your search criteria." : "Get started by adding your first payment gateway."}
          </p>
          <Button
            onClick={() => setLocation("/payments/new")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Gateway
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Gateway</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment gateway? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}