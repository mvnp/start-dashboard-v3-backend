import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Search, Edit, MessageCircle, Smartphone, Wifi, WifiOff, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WhatsappInstance } from "@shared/schema";

export default function WhatsappList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: instances = [], isLoading, error } = useQuery<WhatsappInstance[]>({
    queryKey: ["/api/whatsapp-instances"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/whatsapp-instances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances"] });
      toast({
        title: "Instance deleted",
        description: "The WhatsApp instance has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the WhatsApp instance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateQrMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/whatsapp-instances/${id}/generate-qr`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances"] });
      toast({
        title: "QR Code generated",
        description: "QR code has been generated. Please scan it with your phone.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredInstances = (instances || []).filter((instance: WhatsappInstance) => {
    const matchesSearch = 
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instance.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || instance.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getInstanceStats = () => {
    const total = (instances || []).length;
    const connected = (instances || []).filter((i: WhatsappInstance) => i.status === "Connected").length;
    const error = (instances || []).filter((i: WhatsappInstance) => i.status === "Error").length;
    const disconnected = (instances || []).filter((i: WhatsappInstance) => i.status === "Disconnected").length;
    
    return { total, connected, error, disconnected };
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "Connected":
        return <Wifi className="w-4 h-4 text-green-500" />;
      case "Error":
        return <QrCode className="w-4 h-4 text-yellow-500" />;
      case "Disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "Error":
        return <Badge className="bg-yellow-100 text-yellow-800">Error</Badge>;
      case "Disconnected":
        return <Badge className="bg-red-100 text-red-800">Disconnected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const stats = getInstanceStats();

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading WhatsApp Instances</h1>
        <p>{JSON.stringify(error)}</p>
      </div>
    );
  }

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
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">WhatsApp Instances</h1>
              <p className="text-slate-600">Manage your WhatsApp business instances</p>
            </div>
          </div>
          <Link href="/whatsapp/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Instance
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Instances</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Smartphone className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Connected</p>
                  <p className="text-2xl font-bold text-green-600">{stats.connected}</p>
                </div>
                <Wifi className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Error</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.error}</p>
                </div>
                <QrCode className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Disconnected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.disconnected}</p>
                </div>
                <WifiOff className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search instances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="connecting">Connecting</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Instances Grid */}
      <div className="grid gap-4">
        {filteredInstances.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No WhatsApp instances found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first WhatsApp instance"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInstances.map((instance: WhatsappInstance) => (
            <Card key={instance.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(instance.status)}
                      <h3 className="text-lg font-semibold text-slate-900">{instance.name}</h3>
                      {getStatusBadge(instance.status)}
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-slate-600">
                        <strong>Phone:</strong> {instance.phone_number}
                      </p>
                      {instance.webhook_url && (
                        <p className="text-slate-600">
                          <strong>Webhook:</strong> {instance.webhook_url}
                        </p>
                      )}
                      {instance.last_seen && (
                        <p className="text-slate-600">
                          <strong>Last seen:</strong> {new Date(instance.last_seen).toLocaleString()}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm">
                        <strong>Created:</strong> {new Date(instance.created_at!).toLocaleDateString()}
                      </p>
                    </div>
                    {instance.status === "Error" && instance.qr_code && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <QrCode className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-medium text-yellow-800">QR Code Ready</h4>
                        </div>
                        <p className="text-sm text-yellow-700 mb-3">
                          Scan this QR code with your WhatsApp to connect this instance.
                        </p>
                        <div className="bg-white p-4 rounded border text-center">
                          <code className="text-xs text-gray-600 break-all">{instance.qr_code}</code>
                          <p className="text-xs text-gray-500 mt-2">
                            Use a QR code scanner or WhatsApp's "Link Device" feature
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {instance.status === "Disconnected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateQrMutation.mutate(instance.id)}
                        disabled={generateQrMutation.isPending}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    )}
                    <Link href={`/whatsapp/${instance.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(instance.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}