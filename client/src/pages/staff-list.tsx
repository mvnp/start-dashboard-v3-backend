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
import { Staff } from "@shared/schema";

const roleConfig = {
  "super-admin": {
    label: "Super Admin",
    icon: Shield,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  "merchant": {
    label: "Merchant",
    icon: UserCheck,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  "collaborator": {
    label: "Collaborator",
    icon: Users,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  "customer": {
    label: "Customer",
    icon: User,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export default function StaffList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Staff[]) => data,
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({
        title: "Staff member deleted",
        description: "The staff member has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-600 mt-2">Manage your barbershop team members</p>
        </div>
        <Link href="/staff/new">
          <Button className="mt-4 sm:mt-0 bg-barber-primary hover:bg-barber-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
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
              <p className="text-sm text-slate-600">Total Staff</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchTerm ? "No staff members found matching your search." : "No staff members yet."}
              </p>
              {!searchTerm && (
                <Link href="/staff/new">
                  <Button className="mt-4 bg-barber-primary hover:bg-barber-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Staff Member
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
                        {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{member.name}</h3>
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
                        <p className="text-xs text-slate-500">Hired: {formatDate(member.hire_date)}</p>
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
                              <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {member.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteStaffMutation.mutate(member.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteStaffMutation.isPending}
                              >
                                {deleteStaffMutation.isPending ? "Deleting..." : "Delete"}
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