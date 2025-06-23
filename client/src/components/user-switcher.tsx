import { useAuth } from '@/lib/auth';

export default function UserSwitcher() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between w-full p-2 border rounded">
      <span className="text-sm text-gray-600">{user.email}</span>
    </div>
  );
}