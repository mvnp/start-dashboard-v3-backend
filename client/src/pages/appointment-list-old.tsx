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
import { Plus, Search, Edit, Trash2, Calendar, Clock, User, Settings, Users } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Appointment, Service, Person } from "@shared/schema";
import { TranslatableText } from '@/components/translatable-text';

export default function AppointmentList() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    select: (data: Appointment[]) => data,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Person[]) => data,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    select: (data: Service[]) => data,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    select: (data: Person[]) => data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    },
  });

  const getStaffName = (employeeId: number | null) => {
    if (!employeeId) return 'Unknown Staff';
    const staffMember = staff.find(s => s.user_id === employeeId);
    return staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Unknown Staff';
  };

  const getServiceName = (serviceId: number | null) => {
    if (!serviceId) return 'Unknown Service';
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const getClientName = (clientId: number | null) => {
    if (!clientId) return 'Unknown Client';
    const client = clients.find(c => c.user_id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Unknown Client';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const staffName = getStaffName(appointment.user_id).toLowerCase();
    const clientName = getClientName(appointment.client_id).toLowerCase();
    const serviceName = getServiceName(appointment.service_id).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return staffName.includes(searchLower) || 
           clientName.includes(searchLower) || 
           serviceName.includes(searchLower) ||
           appointment.appointment_date.includes(searchLower);
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
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText>Appointments</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Manage barbershop appointments</TranslatableText></p>
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
          <h1 className="text-3xl font-bold text-slate-900"><TranslatableText>Appointments</TranslatableText></h1>
          <p className="text-slate-600 mt-2"><TranslatableText>Manage barbershop appointments</TranslatableText></p>
        </div>
        <Button
          onClick={() => setLocation("/appointments/new")}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <TranslatableText>New Appointment</TranslatableText>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <Badge variant="secondary" className="text-xs">
                    <TranslatableText>ID:</TranslatableText> {appointment.id}
                  </Badge>
                </div>
                <Badge className={getStatusColor(appointment.status || 'Scheduled')}>
                  {(appointment.status || 'Scheduled').replace('_', ' ')}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {getClientName(appointment.client_id)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-slate-600">{getStaffName(appointment.user_id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-600">{getServiceName(appointment.service_id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">{appointment.appointment_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-slate-600">{appointment.appointment_time}</span>
                </div>
              </div>

              {appointment.notes && (
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-xs text-slate-600">{appointment.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(`/appointments/${appointment.id}/edit`)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  <TranslatableText>Edit</TranslatableText>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(appointment.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "No appointments match your search criteria." : "Get started by creating your first appointment."}
          </p>
          <Button
            onClick={() => setLocation("/appointments/new")}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            <TranslatableText>Create New Appointment</TranslatableText>
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><TranslatableText>Delete Appointment</TranslatableText></AlertDialogTitle>
            <AlertDialogDescription>
              <TranslatableText>Are you sure you want to delete this appointment? This action cannot be undone.</TranslatableText>
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