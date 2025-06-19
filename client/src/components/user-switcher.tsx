import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { TranslatableText } from '@/components/translatable-text';

export default function UserSwitcher() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between w-full p-2 border rounded">
      <span className="text-sm text-gray-600">{user.email}</span>
      <Button variant="ghost" size="sm" onClick={logout} className="text-red-600">
        <LogOut className="h-4 w-4 mr-1" />
        <TranslatableText>Logout</TranslatableText>
      </Button>
    </div>
  );
}