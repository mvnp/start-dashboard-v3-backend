import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  UserCheck,
  Shield,
  Users,
  User
} from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Person } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";

interface Staff extends Person {
  role?: string;
  email?: string;
}

const roleConfig = {
  "super-admin": {
    label: <TranslatableText>Super Admin</TranslatableText>,
    icon: Shield,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  "merchant": {
    label: <TranslatableText>Merchant</TranslatableText>,
    icon: UserCheck,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "collaborator": {
    label: <TranslatableText>Collaborator</TranslatableText>,
    icon: Users,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  "customer": {
    label: <TranslatableText>Customer</TranslatableText>,
    icon: User,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export default function StaffList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { selectedBusinessId } = useBusinessContext();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["/api/staff", selectedBusinessId],
    select: (data: Staff[]) => data,
    staleTime: 0, // Data is immediately stale
    gcTime: 0, // Don't keep in cache
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
    enabled: !!selectedBusinessId, // Only fetch when business is selected
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff", selectedBusinessId] });
      toast({
        title: <TranslatableText>Staff member deleted</TranslatableText>,
        description: <TranslatableText>The staff member has been successfully removed.</TranslatableText>,
      });
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to delete staff member. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const filteredStaff = staff.filter(member =>
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (salary: string | null) => {
    if (!salary) return "N/A";
    const numSalary = Number(salary);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numSalary);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString + 'T12:00:00').toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <TranslatableText tag="h1" className="text-3xl font-bold text-slate-900">Staff Management</TranslatableText>
            <TranslatableText tag="p" className="text-slate-600 mt-2">Manage your barbershop team members</TranslatableText>
          </div>
        </div>
        <Link href="/staff/new">
          <Button className="mt-4 sm:mt-0 bg-barber-primary hover:bg-barber-secondary">
            <Plus className="w-4 h-4 mr-2" />
            <TranslatableText>Add Staff Member</TranslatableText>
          </Button>
        </Link>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
              <TranslatableText tag="p" className="text-sm text-slate-600">Total Staff</TranslatableText>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Staff Members</TranslatableText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <TranslatableText tag="p" className="text-slate-600">
                {searchTerm ? "No staff members found matching your search." : "No staff members yet."}
              </TranslatableText>
              {!searchTerm && (
                <Link href="/staff/new">
                  <Button className="mt-4 bg-barber-primary hover:bg-barber-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    <TranslatableText>Add First Staff Member</TranslatableText>
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStaff.map((member) => {
                const roleInfo = roleConfig[member.role as keyof typeof roleConfig];
                const RoleIcon = roleInfo?.icon || User;
                
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-barber-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {member.first_name[0]}{member.last_name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{member.first_name} {member.last_name}</h3>
                        <p className="text-sm text-slate-600">{member.email}</p>
                        <p className="text-sm text-slate-500">{member.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <Badge className={`${roleInfo?.color} border`}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleInfo?.label || member.role}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-1">{formatSalary(member.salary)}</p>
                        <p className="text-xs text-slate-500"><TranslatableText>Hired:</TranslatableText> {formatDate(member.hire_date)}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/staff/edit/${member.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                <TranslatableText>Delete Staff Member</TranslatableText>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <TranslatableText>Are you sure you want to delete</TranslatableText> {member.first_name} {member.last_name}? <TranslatableText>This action cannot be undone.</TranslatableText>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                <TranslatableText>Cancel</TranslatableText>
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteStaffMutation.mutate(member.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteStaffMutation.isPending}
                              >
                                {deleteStaffMutation.isPending ? <TranslatableText>Deleting...</TranslatableText> : <TranslatableText>Delete</TranslatableText>}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}