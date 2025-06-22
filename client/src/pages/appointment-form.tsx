import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import type { Appointment, Person, Service, Business } from "@shared/schema";

interface AppointmentFormData {
  client_id: number;
  user_id: number;
  service_id: number;
  business_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
}

const formSchema = z.object({
  client_id: z.number().min(1, "Client is required"),
  user_id: z.number().min(1, "Staff member is required"),
  service_id: z.number().min(1, "Service is required"),
  business_id: z.number().min(1, "Business is required"),
  appointment_date: z.date({
    required_error: "Appointment date is required",
  }),
  appointment_time: z.string().min(1, "Appointment time is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AppointmentForm() {
  const { appointmentId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { selectedBusinessId } = useBusinessContext();
  const isEdit = !!appointmentId && appointmentId !== 'new';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: 0,
      user_id: 0,
      service_id: 0,
      business_id: selectedBusinessId || 0,
      appointment_date: new Date(),
      appointment_time: '',
      status: 'scheduled',
      notes: '',
    },
  });

  // Load appointment data for editing
  const { data: appointment, isLoading: appointmentLoading, error: appointmentError } = useQuery<Appointment>({
    queryKey: [`/api/appointments/${appointmentId}`, selectedBusinessId],
    enabled: isEdit && !!appointmentId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Load clients (business-scoped)
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Person[]>({
    queryKey: ["/api/clients", selectedBusinessId],
    enabled: !!selectedBusinessId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Load staff (business-scoped)
  const { data: staff = [], isLoading: staffLoading } = useQuery<Person[]>({
    queryKey: ["/api/staff", selectedBusinessId],
    enabled: !!selectedBusinessId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Load services (business-scoped)
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services", selectedBusinessId],
    enabled: !!selectedBusinessId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Load businesses
  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
  });

  const clientsLoaded = !clientsLoading;
  const staffLoaded = !staffLoading;
  const servicesLoaded = !servicesLoading;

  // Set form values when editing
  useEffect(() => {
    if (isEdit && appointment && clientsLoaded && staffLoaded && servicesLoaded) {
      const appointmentDate = new Date(appointment.appointment_date);
      const timeString = appointment.appointment_time || '09:00';
      
      // Find the correct user_id for the staff member
      // appointment.user_id is actually a person_id, need to find the corresponding user_id
      const staffMember = staff.find(s => s.id === appointment.user_id);
      const correctUserId = staffMember?.user_id || appointment.user_id || 0;
      
      form.reset({
        client_id: appointment.client_id || 0,
        user_id: correctUserId,
        service_id: appointment.service_id || 0,
        business_id: appointment.business_id || selectedBusinessId || 0,
        appointment_date: appointmentDate,
        appointment_time: timeString,
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
      });
    }
  }, [isEdit, appointment, form, clientsLoaded, staffLoaded, servicesLoaded, selectedBusinessId, staff]);

  const createMutation = useMutation({
    mutationFn: (data: AppointmentFormData) => apiRequest("POST", "/api/appointments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", selectedBusinessId] });
      toast({
        title: t("Success"),
        description: t("Appointment created successfully"),
      });
      setLocation("/appointments");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.message || <TranslatableText>Failed to create appointment</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AppointmentFormData) => apiRequest("PUT", `/api/appointments/${appointmentId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", selectedBusinessId] });
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/${appointmentId}`, selectedBusinessId] });
      toast({
        title: t("Success"),
        description: t("Appointment updated successfully"),
      });
      setLocation("/appointments");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.message || <TranslatableText>Failed to update appointment</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // For staff selection, we need to convert user_id back to person_id for the API
    // The dropdown shows user_id but the API expects the person_id (user_id field in appointments)
    const staffMember = staff.find(s => (s.user_id || s.id) === data.user_id);
    const personId = staffMember?.id || data.user_id;
    
    const formattedData: AppointmentFormData = {
      client_id: data.client_id,
      user_id: personId, // This is actually person_id for the API
      service_id: data.service_id,
      business_id: selectedBusinessId || data.business_id,
      appointment_date: data.appointment_date.toISOString().split('T')[0],
      appointment_time: data.appointment_time,
      status: data.status,
      notes: data.notes || '',
    };

    if (isEdit) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  if (isEdit && appointmentLoading) {
    return <div><TranslatableText>Loading...</TranslatableText></div>;
  }

  if (isEdit && appointmentError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle><TranslatableText>Error</TranslatableText></CardTitle>
            <CardDescription>
              <TranslatableText>Failed to load appointment data</TranslatableText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/appointments")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? (
            <TranslatableText>Edit Appointment</TranslatableText>
          ) : (
            <TranslatableText>Schedule New Appointment</TranslatableText>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Appointment Details</TranslatableText>
          </CardTitle>
          <CardDescription>
            <TranslatableText>Fill in the appointment information below</TranslatableText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Client</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select client</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {`${client.first_name} ${client.last_name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Staff Member</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select staff member</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staff.map((member) => (
                            <SelectItem key={member.id} value={(member.user_id || member.id).toString()}>
                              {`${member.first_name} ${member.last_name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="service_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Service</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select service</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - ${service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Business</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select business</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businesses.map((business) => (
                            <SelectItem key={business.id} value={business.id.toString()}>
                              {business.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="appointment_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel><TranslatableText>Appointment Date</TranslatableText></FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span><TranslatableText>Pick a date</TranslatableText></span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointment_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Appointment Time</TranslatableText></FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Status</TranslatableText></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={<TranslatableText>Select status</TranslatableText>} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled"><TranslatableText>Scheduled</TranslatableText></SelectItem>
                        <SelectItem value="confirmed"><TranslatableText>Confirmed</TranslatableText></SelectItem>
                        <SelectItem value="completed"><TranslatableText>Completed</TranslatableText></SelectItem>
                        <SelectItem value="cancelled"><TranslatableText>Cancelled</TranslatableText></SelectItem>
                        <SelectItem value="no-show"><TranslatableText>No Show</TranslatableText></SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Notes</TranslatableText></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("Additional notes (optional)")}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <TranslatableText>Saving...</TranslatableText>
                  ) : isEdit ? (
                    <TranslatableText>Update Appointment</TranslatableText>
                  ) : (
                    <TranslatableText>Schedule Appointment</TranslatableText>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/appointments")}
                >
                  <TranslatableText>Cancel</TranslatableText>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}