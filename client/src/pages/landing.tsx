import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  CreditCard, 
  User, 
  Settings 
} from "lucide-react";

const features = [
  {
    name: "Smart Scheduling",
    description: "Automated appointment booking with real-time availability and conflict prevention",
    icon: Calendar,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    name: "Client Management",
    description: "Comprehensive client profiles with visit history and preferences tracking",
    icon: Users,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    name: "Analytics & Reports",
    description: "Detailed insights into your business performance and revenue trends",
    icon: BarChart3,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    name: "Payment Processing",
    description: "Integrated payment solutions with invoicing and receipt management",
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    name: "Staff Management",
    description: "Manage barber schedules, services, and performance tracking",
    icon: User,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
  },
  {
    name: "Service Catalog",
    description: "Organize and manage your services with pricing and duration settings",
    icon: Settings,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-barber-primary to-barber-secondary py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.8), rgba(210, 105, 30, 0.8)), url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professional Barbershop Management
          </h1>
          <p className="text-xl text-slate-100 mb-8 max-w-3xl mx-auto">
            Streamline your barbershop operations with our comprehensive appointment scheduling and management system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="px-8 py-4 bg-white text-barber-primary font-semibold hover:bg-slate-100"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-barber-primary"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Barbershop
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From appointment scheduling to client management, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.name}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Barbershop?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of barbershops that trust BarberPro for their daily operations
          </p>
          <Button 
            size="lg"
            className="px-8 py-4 bg-barber-primary text-white font-semibold hover:bg-barber-secondary"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
