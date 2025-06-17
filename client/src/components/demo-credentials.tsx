import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface DemoCredential {
  email: string;
  password: string;
  role: string;
  description: string;
}

const getRoleDescription = (roleType: string) => {
  switch (roleType) {
    case 'super-admin':
      return 'Full system access - can see all businesses and data';
    case 'merchant':
      return 'Business owner - can manage their business data';
    case 'employee':
      return 'Staff member - limited access to business operations';
    case 'client':
      return 'Customer - can view and book services';
    default:
      return 'System user with specific permissions';
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
    case 'client':
      return 'Client';
    default:
      return roleType;
  }
};

export function DemoCredentials() {
  const { toast } = useToast();

  const { data: usersByRole = [], isLoading } = useQuery({
    queryKey: ['/api/users/by-role'],
  });

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email}:${password}`);
    toast({
      title: "Credentials copied",
      description: "Email and password copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Demo Credentials</CardTitle>
          <p className="text-sm text-slate-600">Loading available test accounts...</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create demo credentials from actual database users
  const demoCredentials: DemoCredential[] = usersByRole.map((user: any) => ({
    email: user.email,
    password: getPasswordForRole(user.roleType),
    role: getRoleDisplayName(user.roleType),
    description: getRoleDescription(user.roleType)
  }));

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Demo Credentials</CardTitle>
        <p className="text-sm text-slate-600">
          Use these test accounts to explore different user roles and permissions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoCredentials.map((cred, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{cred.email}</span>
                  <Badge variant={cred.role === "Super Admin" ? "default" : cred.role === "Merchant" ? "secondary" : "outline"}>
                    {cred.role}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{cred.description}</p>
                <p className="text-xs text-slate-500 mt-1">Password: {cred.password}</p>
              </div>
              <button
                onClick={() => copyCredentials(cred.email, cred.password)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy credentials"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get password based on role type
function getPasswordForRole(roleType: string): string {
  switch (roleType) {
    case 'super-admin':
      return 'Marcos$1986';
    case 'merchant':
      return 'merchant123';
    case 'employee':
      return 'marina123';
    case 'client':
      return 'client123';
    default:
      return 'password123';
  }
}