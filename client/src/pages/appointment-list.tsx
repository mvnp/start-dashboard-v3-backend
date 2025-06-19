import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Appointment, Service, Person } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";

const statusOptions = [
  { value: "all", label: <TranslatableText>All Statuses</TranslatableText> },
  { value: "Scheduled", label: <TranslatableText>Scheduled</TranslatableText> },
  { value: "Confirmed", label: <TranslatableText>Confirmed</TranslatableText> },
  { value: "In Progress", label: <TranslatableText>In Progress</TranslatableText> },
  { value: "Completed", label: <TranslatableText>Completed</TranslatableText> },
  { value: "Canceled", label: <TranslatableText>Canceled</TranslatableText> }
];

export default function AppointmentList() {
  const [, setLocation] = useLocation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  // Filter and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [todayFilter, setTodayFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', '25');
    
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    if (todayFilter) params.set('today', 'true');
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    return params.toString();
  }, [currentPage, statusFilter, todayFilter, startDate, endDate]);

  // Get selected business ID to include in cache key
  const selectedBusinessId = sessionStorage.getItem('selectedBusinessId');

  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ["/api/appointments", buildQueryParams(), selectedBusinessId],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const selectedBusinessId = sessionStorage.getItem('selectedBusinessId');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      if (selectedBusinessId) {
        headers["X-Selected-Business-Id"] = selectedBusinessId;
      }

      const response = await fetch(`/api/appointments?${buildQueryParams()}`, {
        headers,
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services", selectedBusinessId],
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const { data: staff = [] } = useQuery<Person[]>({
    queryKey: ["/api/staff", selectedBusinessId],
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const { data: clients = [] } = useQuery<Person[]>({
    queryKey: ["/api/clients", selectedBusinessId],
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const appointments = appointmentData?.appointments || [];
  const totalPages = appointmentData?.totalPages || 1;
  const total = appointmentData?.total || 0;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", buildQueryParams(), selectedBusinessId] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Appointment deleted successfully</TranslatableText>,
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to delete appointment</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const getServiceName = (serviceId: number | null) => {
    if (!serviceId) return 'Unknown Service';
    const service = (services as Service[]).find((s: Service) => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const getStaffName = (userId: number | null) => {
    if (!userId) return 'Unknown Staff';
    const staffMember = (staff as Person[]).find((s: Person) => s.user_id === userId);
    return staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Unknown Staff';
  };

  const getClientName = (clientId: number | null) => {
    if (!clientId) return 'Unknown Client';
    const client = (clients as Person[]).find((c: Person) => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'Unknown Client';
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setTodayFilter(false);
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const applyTodayFilter = () => {
    setTodayFilter(true);
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T12:00:00').toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: 'var(--barber-primary)'}}>
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <TranslatableText>Appointments</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>Manage customer appointments</TranslatableText>
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setLocation("/appointments/new")} 
          className="gap-2"
          style={{backgroundColor: 'var(--barber-primary)', color: 'white'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--barber-primary)'}
        >
          <Plus className="w-4 h-4" />
          <TranslatableText>New Appointment</TranslatableText>
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <TranslatableText>Filters</TranslatableText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label><TranslatableText>Status</TranslatableText></Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Today Filter */}
            <div className="space-y-2">
              <Label><TranslatableText>Quick Filters</TranslatableText></Label>
              <Button 
                variant={todayFilter ? "default" : "outline"} 
                onClick={applyTodayFilter}
                className="w-full gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                <TranslatableText>Today's Appointments</TranslatableText>
              </Button>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label><TranslatableText>Start Date</TranslatableText></Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setStartDate(selectedDate);
                  setTodayFilter(false);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label><TranslatableText>End Date</TranslatableText></Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setEndDate(selectedDate);
                  setTodayFilter(false);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label className="invisible">Clear</Label>
              <Button variant="outline" onClick={resetFilters} className="w-full">
                <TranslatableText>Clear Filters</TranslatableText>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <TranslatableText>Showing</TranslatableText> {appointments.length} <TranslatableText>of</TranslatableText> {total} <TranslatableText>appointments</TranslatableText>
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TranslatableText>Page</TranslatableText> {currentPage} <TranslatableText>of</TranslatableText> {totalPages}
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500"><TranslatableText>No appointments found matching your criteria</TranslatableText></p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment: Appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
                        <Clock className="w-4 h-4 text-gray-500 ml-2" />
                        <span className="text-gray-600">{formatTime(appointment.appointment_time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{getClientName(appointment.client_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{getStaffName(appointment.user_id)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Settings className="w-4 h-4" />
                          <span>{getServiceName(appointment.service_id)}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/appointments/${appointment.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <TranslatableText>Next</TranslatableText>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><TranslatableText>Delete Appointment</TranslatableText></AlertDialogTitle>
            <AlertDialogDescription>
              <TranslatableText>Are you sure you want to delete this appointment? This action cannot be undone.</TranslatableText>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <TranslatableText>Cancel</TranslatableText>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              <TranslatableText>Delete</TranslatableText>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}