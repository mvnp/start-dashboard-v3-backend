import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  CreditCard, 
  User, 
  Settings,
  Check,
  Crown
} from "lucide-react";
import { BarberPlan } from "@shared/schema";

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
  const [isAnnual, setIsAnnual] = useState(false);

  const { data: plans = [] } = useQuery({
    queryKey: ["/api/barber-plans"],
    select: (data: BarberPlan[]) => data,
  });

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getPrice = (plan: BarberPlan) => {
    return isAnnual ? plan.price12m : plan.price3m;
  };

  const getMonthlyPrice = (plan: BarberPlan) => {
    const price = getPrice(plan);
    const months = isAnnual ? 12 : 3;
    return Math.round(price / months);
  };

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

      {/* Pricing Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Flexible pricing options to grow with your barbershop business
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                3 Months
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-amber-600"
              />
              <span className={`text-lg font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                12 Months
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  Save 30%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-amber-500 scale-105 z-10' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white px-4 py-1 flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {plan.subtitle}
                    </p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-slate-900 mb-1">
                        {formatPrice(getMonthlyPrice(plan))}
                        <span className="text-lg font-normal text-slate-600">/month</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Billed {formatPrice(getPrice(plan))} {isAnnual ? 'annually' : 'quarterly'}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-3 font-semibold ${
                      index === 1
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50'
                    }`}
                    onClick={() => window.open(plan.payment_link, '_blank')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Pricing plans coming soon
              </h3>
              <p className="text-gray-600">
                We're preparing amazing subscription options for your barbershop.
              </p>
            </div>
          )}
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
