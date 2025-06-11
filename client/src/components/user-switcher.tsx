import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Building, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

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
  const { user, switchUser } = useAuth();
  const [switching, setSwitching] = useState(false);
  const { toast } = useToast();

  const { data: usersByRole = [], isLoading } = useQuery({
    queryKey: ['/api/users/by-role'],
    queryFn: async () => {
      const response = await fetch('/api/users/by-role');
      if (!response.ok) {
        throw new Error('Failed to fetch users by role');
      }
      const allUsers = await response.json() as RoleUser[];
      // Filter to show only merchants and super admin
      return allUsers.filter(user => user.roleType === 'merchant' || user.roleType === 'super-admin');
    },
  });

  const handleUserSwitch = async (userId: string) => {
    setSwitching(true);
    try {
      await switchUser(parseInt(userId));
      // Invalidate all queries to refresh data with new user context
      queryClient.invalidateQueries();
      const switchedUser = usersByRole.find(u => u.id === parseInt(userId));
      toast({
        title: "User switched",
        description: `Successfully switched to ${switchedUser?.email}`,
      });
    } catch (error) {
      toast({
        title: "Switch failed",
        description: "Failed to switch user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSwitching(false);
    }
  };

  const currentUser = usersByRole.find(u => u.id === user?.id);
  const IconComponent = currentUser ? getRoleIcon(currentUser.roleType) : User;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          User Access Level
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
                {currentUser ? getRoleDisplayName(currentUser.roleType) : `Role ID: ${user.roleId}`}
              </p>
            </div>
          </div>
        )}
        
        <Select
          value={user?.id.toString()}
          onValueChange={handleUserSwitch}
          disabled={switching || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Switch user..." />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading users...
              </SelectItem>
            ) : (
              usersByRole.map((roleUser) => {
                const Icon = getRoleIcon(roleUser.roleType);
                return (
                  <SelectItem key={roleUser.id} value={roleUser.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{roleUser.email}</div>
                        <div className="text-xs text-slate-600">{getRoleDisplayName(roleUser.roleType)}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>

        {switching && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              Switching user...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}