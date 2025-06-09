import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertStaffSchema, Staff } from "@shared/schema";

const staffFormSchema = insertStaffSchema.extend({
  salary: z.string().transform((val) => parseInt(val, 10)),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

const roleOptions = [
  { value: "super-admin", label: "Super Admin" },
  { value: "merchant", label: "Merchant" },
  { value: "collaborator", label: "Collaborator" },
  { value: "customer", label: "Customer" },
];

export default function StaffForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const staffId = params.id ? parseInt(params.id) : null;

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      tax_id: "",
      role: "",
      hire_date: "",
      salary: "",
    },
  });

  const { data: staffMember, isLoading } = useQuery({
    queryKey: ["/api/staff", staffId],
    enabled: isEdit && !!staffId,
    select: (data: Staff) => data,
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: StaffFormData) => apiRequest("/api/staff", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        salary: parseInt(data.salary.toString(), 10),
      }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "Staff member created",
        description: "The new staff member has been successfully added.",
      });
      setLocation("/staff");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create staff member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: (data: StaffFormData) => apiRequest(`/api/staff/${staffId}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data,
        salary: parseInt(data.salary.toString(), 10),
      }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/staff", staffId] });
      toast({
        title: "Staff member updated",
        description: "The staff member has been successfully updated.",
      });
      setLocation("/staff");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update staff member. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (staffMember && isEdit) {
      form.reset({
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
        tax_id: staffMember.tax_id,
        role: staffMember.role,
        hire_date: staffMember.hire_date,
        salary: staffMember.salary.toString(),
      });
    }
  }, [staffMember, isEdit, form]);

  const onSubmit = (data: StaffFormData) => {
    if (isEdit) {
      updateStaffMutation.mutate(data);
    } else {
      createStaffMutation.mutate(data);
    }
  };

  const isSubmitting = createStaffMutation.isPending || updateStaffMutation.isPending;

  if (isEdit && isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/staff")}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Staff
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isEdit ? "Update staff member information" : "Enter details for the new team member"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Staff Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tax identification number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
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
                  name="hire_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hire Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Annual Salary (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter annual salary" 
                          min="0"
                          step="1000"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/staff")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-barber-primary hover:bg-barber-secondary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting 
                    ? (isEdit ? "Updating..." : "Creating...") 
                    : (isEdit ? "Update Staff" : "Create Staff")
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}