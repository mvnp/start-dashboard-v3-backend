import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Appointment, Service, Person } from "@shared/schema";

interface AppointmentFormData {
  client_id: number;
  user_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
}

export default function AppointmentForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const appointmentId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: 0,
    user_id: 0,
    service_id: 0,
    appointment_date: "",
    appointment_time: "",
    status: "Scheduled",
    notes: "",
  });

  // Load all dependent data first
  const { data: staff = [], isSuccess: staffLoaded } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Person[]) => data,
  });

  const { data: services = [], isSuccess: servicesLoaded } = useQuery({
    queryKey: ["/api/services"],
    select: (data: Service[]) => data,
  });

  const { data: clients = [], isSuccess: clientsLoaded } = useQuery({
    queryKey: ["/api/clients"],
    select: (data: Person[]) => data,
  });

  // Only load appointment data after all dependencies are available
  const { data: appointmentData, isLoading, isSuccess } = useQuery({
    queryKey: ["/api/appointments", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) throw new Error('Failed to fetch appointment');
      return response.json();
    },
    enabled: isEdit && !!appointmentId && staffLoaded && servicesLoaded && clientsLoaded,
    staleTime: 0,
    refetchOnMount: true,
    select: (data: Appointment) => data,
  });

  const createMutation = useMutation({
    mutationFn: (data: AppointmentFormData) => apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
      setLocation("/appointments");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AppointmentFormData) => apiRequest("PUT", `/api/appointments/${appointmentId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", appointmentId] });
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
      setLocation("/appointments");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (appointmentData && isEdit && isSuccess && staffLoaded && servicesLoaded && clientsLoaded) {
      // Format time to HH:MM format for input field
      const formattedTime = appointmentData.appointment_time 
        ? appointmentData.appointment_time.substring(0, 5) 
        : "";
      
      // Normalize status to proper case for dropdown matching
      const normalizeStatus = (status: string | null) => {
        if (!status) return "Scheduled";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      };
      
      setFormData({
        client_id: appointmentData.client_id || 0,
        user_id: appointmentData.user_id || 0,
        service_id: appointmentData.service_id || 0,
        appointment_date: appointmentData.appointment_date || "",
        appointment_time: formattedTime,
        status: normalizeStatus(appointmentData.status || ""),
        notes: appointmentData.notes || "",
      });
    }
  }, [appointmentData, isEdit, isSuccess, staffLoaded, servicesLoaded, clientsLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.appointment_date.trim()) {
      toast({
        title: "Error",
        description: "Appointment date is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.appointment_time.trim()) {
      toast({
        title: "Error",
        description: "Appointment time is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.status.trim()) {
      toast({
        title: "Error",
        description: "Status is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.client_id === 0) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    if (formData.user_id === 0) {
      toast({
        title: "Error",
        description: "Please select a staff member",
        variant: "destructive",
      });
      return;
    }

    if (formData.service_id === 0) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading || !staffLoaded || !servicesLoaded || !clientsLoaded) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/appointments")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/appointments")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointments
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? "Edit Appointment" : "Create New Appointment"}
          </h1>
          <p className="text-slate-600">
            {isEdit ? "Update the appointment details" : "Schedule a new appointment for a client"}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Appointment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="client_id">Client</Label>
                <Select 
                  value={formData.client_id && formData.client_id > 0 ? formData.client_id.toString() : ""} 
                  onValueChange={(value) => handleInputChange('client_id', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="user_id">Staff Member</Label>
                <Select 
                  value={formData.user_id && formData.user_id > 0 ? formData.user_id.toString() : ""} 
                  onValueChange={(value) => handleInputChange('user_id', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((staffMember) => (
                      <SelectItem key={staffMember.id} value={staffMember.user_id?.toString() || ""}>
                        {staffMember.first_name} {staffMember.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service_id">Service</Label>
                <Select 
                  value={formData.service_id && formData.service_id > 0 ? formData.service_id.toString() : ""} 
                  onValueChange={(value) => handleInputChange('service_id', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.filter(service => service.is_active).map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - ${service.price ? (parseFloat(service.price) / 100).toFixed(2) : '0.00'} ({service.duration}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || ""} 
                  onValueChange={(value) => handleInputChange('status', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="appointment_date">Appointment Date</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="appointment_time">Appointment Time</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) => handleInputChange('appointment_time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any special notes or requirements"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : isEdit ? (
                  "Update Appointment"
                ) : (
                  "Create Appointment"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/appointments")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}