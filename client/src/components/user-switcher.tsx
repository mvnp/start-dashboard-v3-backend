import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Building, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { TranslatableText } from '@/components/translatable-text';

interface RoleUser {
  id: number;
  email: string;
  roleId: number;
  roleType: string;
  roleName: string;
}

const getRoleIcon = (roleType: string) => {
  switch (roleType) {
    case 'super-admin':
      return Shield;
    case 'merchant':
      return Building;
    case 'employee':
      return User;
    default:
      return User;
  }
};

const getRoleDisplayName = (roleType: string) => {
  switch (roleType) {
    case 'super-admin':
      return 'Super Admin';
    case 'merchant':
      return 'Merchant';
    case 'employee':
      return 'Employee';
    default:
      return roleType;
  }
};

export default function UserSwitcher() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear JWT tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "Successfully logged out of your account",
    });
    // Redirect to login page
    window.location.href = '/login';
  };

  // For JWT authentication, we don't need to fetch all users for switching
  // Just show the current user info and logout option
  const IconComponent = user?.roleId === 1 ? Shield : user?.roleId === 2 ? Building : User;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          <TranslatableText>Current User</TranslatableText>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {user && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
            <IconComponent className="w-4 h-4 text-slate-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-600">
                {user.isSuperAdmin ? 'Super Admin' : `Role ID: ${user.roleId}`}
              </p>
            </div>
          </div>
        )}
        
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          <TranslatableText>Sign Out</TranslatableText>
        </Button>
      </CardContent>
    </Card>
  );
}