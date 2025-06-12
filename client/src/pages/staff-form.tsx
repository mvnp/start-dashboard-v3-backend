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
import { Person, Business, Role } from "@shared/schema";

interface StaffFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  tax_id: string;
  role_id: number;
  hire_date: string;
  salary: number;
  business_id: number;
}



export default function StaffForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const isEdit = !!params.id;
  const staffId = params.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState<StaffFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    tax_id: "",
    role_id: 0,
    hire_date: "",
    salary: 0,
    business_id: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const formatTaxId = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3.$4/$5');
    }
  };

  const { data: staffMember, isLoading } = useQuery({
    queryKey: [`/api/staff/${staffId}`] as const,
    queryFn: async () => {
      const response = await fetch(`/api/staff/${staffId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch staff: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isEdit && !!staffId,
  });

  const { data: businesses } = useQuery({
    queryKey: ["/api/businesses"],
    select: (data: Business[]) => data,
  });

  const { data: roles } = useQuery({
    queryKey: ["/api/roles"],
    select: (data: Role[]) => data,
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
    onError: async (error: any) => {
      // Try to extract error from response
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, handle generic error
      }
      
      // Handle email exists error specifically
      if (errorData?.error === "Email exists on database") {
        setErrors({ email: "Email exists on database" });
        return;
      }
      
      const errorMessage = errorData?.error || "Failed to create staff member";
      toast({
        title: "Error",
        description: errorMessage,
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
    onError: async (error: any) => {
      // Try to extract error from response
      let errorData = null;
      try {
        const response = await error;
        if (response && !response.ok) {
          errorData = await response.json();
        }
      } catch (e) {
        // If error parsing fails, handle generic error
      }
      
      // Handle email exists error specifically
      if (errorData?.error === "Email exists on database") {
        setErrors({ email: "Email exists on database" });
        return;
      }
      
      const errorMessage = errorData?.error || "Failed to update staff member";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    console.log("useEffect triggered - staffMember:", staffMember, "isEdit:", isEdit);
    if (staffMember && isEdit) {
      console.log("Setting form data with staff member:", {
        email: staffMember.email,
        business_id: staffMember.business_id,
        role_id: staffMember.role_id
      });
      const newFormData = {
        first_name: staffMember.first_name || "",
        last_name: staffMember.last_name || "",
        email: staffMember.email || "",
        phone: staffMember.phone ? formatPhoneNumber(staffMember.phone) : "",
        tax_id: staffMember.tax_id ? formatTaxId(staffMember.tax_id) : "",
        role_id: staffMember.role_id || 3,
        hire_date: staffMember.hire_date || "",
        salary: Number(staffMember.salary) || 0,
        business_id: staffMember.business_id || 0,
      };
      console.log("New form data being set:", newFormData);
      setFormData(newFormData);
      // Clear any previous errors when loading new data
      setErrors({});
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.tax_id.trim()) {
      newErrors.tax_id = "Tax ID is required";
    }
    
    if (!formData.role_id || formData.role_id === 0) {
      newErrors.role_id = "Role is required";
    }
    
    if (!formData.hire_date.trim()) {
      newErrors.hire_date = "Hire date is required";
    }
    
    if (!formData.salary || formData.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }
    
    if (!formData.business_id || formData.business_id === 0) {
      newErrors.business_id = "Business is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const stripFormatting = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission by removing formatting from phone and tax_id
    const submitData = {
      ...formData,
      phone: stripFormatting(formData.phone),
      tax_id: formData.tax_id ? stripFormatting(formData.tax_id) : "",
    };
    
    if (isEdit) {
      updateStaffMutation.mutate(submitData);
    } else {
      createStaffMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: keyof StaffFormData, value: string | number) => {
    let formattedValue = value;
    
    if (field === 'phone' && typeof value === 'string') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'tax_id' && typeof value === 'string') {
      formattedValue = formatTaxId(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: field === 'salary' || field === 'business_id' || field === 'role_id'
        ? (typeof formattedValue === 'string' ? parseInt(formattedValue) || 0 : formattedValue)
        : formattedValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
            </h1>
            <p className="text-slate-600 mt-2">
              {isEdit ? "Update staff member information" : "Enter details for the new team member"}
            </p>
          </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="(48) 99189-3313"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tax_id">Tax ID *</Label>
                <Input
                  id="tax_id"
                  placeholder="020.393.261-70 or 33.240.999.0001/03"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  className={errors.tax_id ? "border-red-500" : ""}
                />
                {errors.tax_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="business_id">Business *</Label>
                <Select 
                  key={`business-${formData.business_id}-${isEdit ? staffId : 'new'}`}
                  onValueChange={(value) => {
                    console.log("Business select changed to:", value);
                    handleInputChange('business_id', Number(value));
                  }} 
                  value={formData.business_id > 0 ? formData.business_id.toString() : ""}
                >
                  <SelectTrigger className={errors.business_id ? "border-red-500" : ""}>
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
                {errors.business_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role_id">Role *</Label>
                <Select 
                  key={`role-${formData.role_id}-${isEdit ? staffId : 'new'}`}
                  onValueChange={(value) => handleInputChange('role_id', Number(value))} 
                  value={formData.role_id?.toString()}
                >
                  <SelectTrigger className={errors.role_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select staff role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.type.charAt(0).toUpperCase() + role.type.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
                )}
              </div>

              <div>
                <Label htmlFor="hire_date">Hire Date *</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleInputChange('hire_date', e.target.value)}
                  className={errors.hire_date ? "border-red-500" : ""}
                />
                {errors.hire_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.hire_date}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="salary">Annual Salary (USD) *</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Enter annual salary"
                  min="0"
                  step="1000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
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