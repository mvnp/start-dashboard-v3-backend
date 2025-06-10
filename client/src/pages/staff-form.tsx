import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
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
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Staff, Business } from "@shared/schema";

interface StaffFormData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tax_id: string;
  role: string;
  hire_date: string;
  salary: number;
  business_id: number;
}

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

  const [formData, setFormData] = useState<StaffFormData>({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tax_id: "",
    role: "",
    hire_date: "",
    salary: 0,
    business_id: 0,
  });

  const { data: staffMember, isLoading } = useQuery({
    queryKey: ["/api/staff", staffId],
    enabled: isEdit && !!staffId,
    select: (data: Staff) => data,
  });

  const { data: businesses } = useQuery({
    queryKey: ["/api/businesses"],
    select: (data: Business[]) => data,
  });

  const createStaffMutation = useMutation({
    mutationFn: (data: StaffFormData) => apiRequest("POST", "/api/staff", data),
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
    mutationFn: (data: StaffFormData) => apiRequest("PUT", `/api/staff/${staffId}`, data),
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
      setFormData({
        username: "", // Don't populate username/password for edit
        password: "",
        first_name: staffMember.first_name,
        last_name: staffMember.last_name,
        email: staffMember.email,
        phone: staffMember.phone,
        tax_id: staffMember.tax_id,
        role: staffMember.role,
        hire_date: staffMember.hire_date,
        salary: staffMember.salary,
        business_id: staffMember.business_id || 0,
      });
    }
  }, [staffMember, isEdit]);

  // Set default business when businesses are loaded and form is for creation
  useEffect(() => {
    if (!isEdit && businesses && businesses.length > 0 && formData.business_id === 0) {
      setFormData(prev => ({
        ...prev,
        business_id: businesses[0].id
      }));
    }
  }, [businesses, isEdit, formData.business_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateStaffMutation.mutate(formData);
    } else {
      createStaffMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'salary' || field === 'business_id' 
        ? (typeof value === 'string' ? parseInt(value) || 0 : value)
        : value
    }));
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
    <div className="p-6">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  placeholder="Enter tax identification number"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_id">Business</Label>
                <Select onValueChange={(value) => handleInputChange('business_id', value)} value={formData.business_id > 0 ? formData.business_id.toString() : ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses?.map((business) => (
                      <SelectItem key={business.id} value={business.id.toString()}>
                        {business.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)} value={formData.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="salary">Annual Salary (USD)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter annual salary"
                  min="0"
                  step="1000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  required
                />
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}