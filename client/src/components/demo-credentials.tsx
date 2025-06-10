import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DemoCredential {
  email: string;
  password: string;
  role: string;
  description: string;
}

const demoCredentials: DemoCredential[] = [
  {
    email: "mvnpereira@gmail.com",
    password: "Marcos$1986",
    role: "Super Admin",
    description: "Full system access - can see all businesses and data"
  },
  {
    email: "carlos.silva@axitech.com",
    password: "carlos123",
    role: "Merchant",
    description: "Business owner - can manage their business data"
  },
  {
    email: "marina.santos@axitech.com",
    password: "marina123",
    role: "Employee",
    description: "Staff member - limited access to business operations"
  },
  {
    email: "roberto.oliveira@axitech.com",
    password: "roberto123",
    role: "Employee",
    description: "Staff member - limited access to business operations"
  }
];

export function DemoCredentials() {
  const { toast } = useToast();

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email}:${password}`);
    toast({
      title: "Credentials copied",
      description: "Email and password copied to clipboard",
    });
  };

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