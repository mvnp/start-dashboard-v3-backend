import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Ticket, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSupportTicketSchema, type SupportTicket } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { z } from "zod";

interface SupportTicketFormData {
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  client_email: string;
  client_name: string;
  assigned_staff_id?: number;
  resolution_notes?: string;
  attachments: string[];
  business_id: number;
}

const formSchema = insertSupportTicketSchema.extend({
  attachments: z.array(z.string()).default([])
});

export default function SupportTicketForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/support-tickets/:id/edit");
  const [createMatch] = useRoute("/support-tickets/new");
  const [viewMatch] = useRoute("/support-tickets/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const ticketId = params?.id ? parseInt(params.id) : null;
  const isEditing = !!match;
  const isViewing = !!viewMatch && !isEditing;
  const isCreating = !!createMatch;

  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const form = useForm<SupportTicketFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      category: "",
      client_email: "",
      client_name: "",
      assigned_staff_id: undefined,
      resolution_notes: "",
      attachments: [],
      business_id: 1
    }
  });

  // Load ticket data for editing/viewing
  const { data: ticket } = useQuery({
    queryKey: ["/api/support-tickets", ticketId],
    select: (data: SupportTicket) => data,
  });

  // Load staff for assignment dropdown
  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
  });

  // Update form when ticket data is loaded
  useEffect(() => {
    if (ticket) {
      form.reset({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        client_email: ticket.client_email,
        client_name: ticket.client_name,
        assigned_staff_id: ticket.assigned_staff_id || undefined,
        resolution_notes: ticket.resolution_notes || "",
        attachments: ticket.attachments || []
      });
      setAttachedFiles(ticket.attachments || []);
    }
  }, [ticket, form]);

  const createMutation = useMutation({
    mutationFn: (data: SupportTicketFormData) => {
      const payload = {
        ...data,
        assigned_staff_id: data.assigned_staff_id || null,
        resolution_notes: data.resolution_notes || null,
        attachments: attachedFiles
      };
      return apiRequest("POST", "/api/support-tickets", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      toast({
        title: <TranslatableText>Ticket created</TranslatableText>,
        description: <TranslatableText>The support ticket has been successfully created.</TranslatableText>,
      });
      setLocation("/support-tickets");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to create the ticket. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SupportTicketFormData) => {
      const payload = {
        ...data,
        assigned_staff_id: data.assigned_staff_id || null,
        resolution_notes: data.resolution_notes || null,
        attachments: attachedFiles
      };
      return apiRequest("PUT", `/api/support-tickets/${ticketId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets", ticketId] });
      toast({
        title: <TranslatableText>Ticket updated</TranslatableText>,
        description: <TranslatableText>The support ticket has been successfully updated.</TranslatableText>,
      });
      setLocation("/support-tickets");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to update the ticket. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SupportTicketFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Mock file upload handler (since we're frontend-only)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => `uploads/${file.name}`);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const categories = [
    <TranslatableText>Technical Issue</TranslatableText>,
    <TranslatableText>General Inquiry</TranslatableText>,
    <TranslatableText>Billing Question</TranslatableText>,
    <TranslatableText>Service Request</TranslatableText>,
    <TranslatableText>Complaint</TranslatableText>,
    <TranslatableText>Feature Request</TranslatableText>,
    <TranslatableText>Bug Report</TranslatableText>,
    <TranslatableText>Account Issue</TranslatableText>,
    <TranslatableText>Pricing</TranslatableText>,
    <TranslatableText>Other</TranslatableText>,
  ];

  const priorityOptions = [
    { value: "low", label: <TranslatableText>Low</TranslatableText> },
    { value: "medium", label: <TranslatableText>Medium</TranslatableText> },
    { value: "high", label: <TranslatableText>High</TranslatableText> },
    { value: "urgent", label: <TranslatableText>Urgent</TranslatableText> }
  ];

  const statusOptions = [
    { value: "open", label: <TranslatableText>Open</TranslatableText> },
    { value: "in_progress", label: <TranslatableText>In Progress</TranslatableText> },
    { value: "resolved", label: <TranslatableText>Resolved</TranslatableText> },
    { value: "closed", label: <TranslatableText>Closed</TranslatableText> }
  ];

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/support-tickets")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText>Back to Support Tickets</TranslatableText>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isViewing ? <TranslatableText>View Ticket</TranslatableText> : isEditing ? <TranslatableText>Edit Ticket</TranslatableText> : <TranslatableText>New Support Ticket</TranslatableText>}
            </h1>
            <p className="text-slate-600">
              {isViewing ? "Ticket details and information" : isEditing ? "Update ticket details" : "Create a new customer support ticket"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isViewing ? <TranslatableText>Ticket Information</TranslatableText> : <TranslatableText>Ticket Details</TranslatableText>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Title *</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description of the issue"
                          {...field}
                          disabled={isViewing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Category *</TranslatableText>
                      </FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isViewing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Client Name *</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Customer's full name"
                          {...field}
                          disabled={isViewing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Client Email *</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="customer@example.com"
                          {...field}
                          disabled={isViewing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Priority, Status, and Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Priority *</TranslatableText>
                      </FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isViewing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Status *</TranslatableText>
                      </FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isViewing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="assigned_staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Assigned Staff</TranslatableText>
                      </FormLabel>
                      <Select 
                        value={field.value?.toString() || "none"} 
                        onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                        disabled={isViewing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Unassigned</SelectItem>
                          {staff.map((member: Staff) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.first_name} {member.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatableText>Description *</TranslatableText>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the issue or request..."
                        className="min-h-32"
                        {...field}
                        disabled={isViewing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resolution Notes */}
              {(isEditing || isViewing) && (
                <FormField
                  control={form.control}
                  name="resolution_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Resolution Notes</TranslatableText>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes about the resolution or progress..."
                          className="min-h-24"
                          {...field}
                          disabled={isViewing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* File Attachments */}
              {!isViewing && (
                <div>
                  <Label>
                    <TranslatableText>Attachments (Optional)</TranslatableText>
                  </Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        <TranslatableText>Upload Files</TranslatableText>
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                      <span className="text-sm text-gray-500">
                        <TranslatableText>Supported: PDF, DOC, DOCX, JPG, PNG, TXT</TranslatableText>
                      </span>
                    </div>
                    
                    {attachedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>
                          <TranslatableText>Attached Files:</TranslatableText>
                        </Label>
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{file.split('/').pop()}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View Attachments */}
              {isViewing && attachedFiles.length > 0 && (
                <div>
                  <Label>
                    <TranslatableText>Attachments</TranslatableText>
                  </Label>
                  <div className="mt-2 space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file.split('/').pop()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              {!isViewing && (
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/support-tickets")}
                  >
                    <TranslatableText>Cancel</TranslatableText>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <TranslatableText>Saving...</TranslatableText> : isEditing ? <TranslatableText>Update Ticket</TranslatableText> : <TranslatableText>Create Ticket</TranslatableText>}
                  </Button>
                </div>
              )}

              {isViewing && (
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation(`/support-tickets/${ticketId}/edit`)}
                  >
                    <TranslatableText>Edit Ticket</TranslatableText>
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}