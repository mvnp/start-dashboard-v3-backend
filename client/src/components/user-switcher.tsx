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

const TEST_USERS = [
  { id: 1, name: 'Super Admin', email: 'admin@system.com', role: 'Super Admin', icon: Shield },
  { id: 21, name: 'Carlos Silva (Merchant)', email: 'carlos.silva@axitech.com', role: 'Merchant', icon: Building },
  { id: 22, name: 'Marina Santos (Employee)', email: 'marina.santos@axitech.com', role: 'Employee', icon: User },
];

export default function UserSwitcher() {
  const { user, switchUser } = useAuth();
  const [switching, setSwitching] = useState(false);
  const { toast } = useToast();

  const handleUserSwitch = async (userId: string) => {
    setSwitching(true);
    try {
      await switchUser(parseInt(userId));
      // Invalidate all queries to refresh data with new user context
      queryClient.invalidateQueries();
      toast({
        title: "User switched",
        description: `Successfully switched to ${TEST_USERS.find(u => u.id === parseInt(userId))?.name}`,
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

  const currentUser = TEST_USERS.find(u => u.id === user?.id);
  const IconComponent = currentUser?.icon || User;

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
                {currentUser?.name || user.email}
              </p>
              <p className="text-xs text-slate-600">
                {currentUser?.role || `Role ID: ${user.roleId}`}
              </p>
            </div>
          </div>
        )}
        
        <Select
          value={user?.id.toString()}
          onValueChange={handleUserSwitch}
          disabled={switching}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Switch user..." />
          </SelectTrigger>
          <SelectContent>
            {TEST_USERS.map((testUser) => {
              const Icon = testUser.icon;
              return (
                <SelectItem key={testUser.id} value={testUser.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{testUser.name}</div>
                      <div className="text-xs text-slate-600">{testUser.role}</div>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
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