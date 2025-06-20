import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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
import { TranslatableText } from "@/components/translatable-text";

const features = [
  {
    name: <TranslatableText>Smart Scheduling</TranslatableText>,
    description: <TranslatableText>Automated appointment booking with real-time availability and conflict prevention</TranslatableText>,
    icon: Calendar,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    name: <TranslatableText>Client Management</TranslatableText>,
    description: <TranslatableText>Comprehensive client profiles with visit history and preferences tracking</TranslatableText>,
    icon: Users,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    name: <TranslatableText>Analytics & Reports</TranslatableText>,
    description: <TranslatableText>Detailed insights into your business performance and revenue trends</TranslatableText>,
    icon: BarChart3,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    name: <TranslatableText>Payment Processing</TranslatableText>,
    description: <TranslatableText>Integrated payment solutions with invoicing and receipt management</TranslatableText>,
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    name: <TranslatableText>Staff Management</TranslatableText>,
    description: <TranslatableText>Manage barber schedules, services, and performance tracking</TranslatableText>,
    icon: User,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
  },
  {
    name: <TranslatableText>Service Catalog</TranslatableText>,
    description: <TranslatableText>Organize and manage your services with pricing and duration settings</TranslatableText>,
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationItems = [
    { name: <TranslatableText>Home</TranslatableText>, id: 'hero' },
    { name: <TranslatableText>Features</TranslatableText>, id: 'features' },
    { name: <TranslatableText>Pricing</TranslatableText>, id: 'pricing' },
    { name: <TranslatableText>About</TranslatableText>, id: 'about' },
    { name: <TranslatableText>Contact</TranslatableText>, id: 'contact' }
  ];

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-barber-primary mr-2" />
              <span className="text-xl font-bold text-slate-900"><TranslatableText>BarberPro</TranslatableText></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-slate-600 hover:text-barber-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login"><TranslatableText>Sign In</TranslatableText></Link>
              </Button>
              <Button size="sm" className="bg-barber-primary hover:bg-barber-secondary">
                <TranslatableText>Get Started</TranslatableText>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div 
        id="hero"
        className="relative bg-gradient-to-r from-barber-primary to-barber-secondary py-20 pt-36"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.8), rgba(210, 105, 30, 0.8)), url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <TranslatableText>Professional Barbershop Management</TranslatableText>
          </h1>
          <p className="text-xl text-slate-100 mb-8 max-w-3xl mx-auto">
            <TranslatableText>Streamline your barbershop operations with our comprehensive appointment scheduling and management system</TranslatableText>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="px-8 py-4 bg-white text-barber-primary font-semibold hover:bg-slate-100"
            >
              <TranslatableText>Start Free Trial</TranslatableText>
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-barber-primary"
            >
              <TranslatableText>Watch Demo</TranslatableText>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <TranslatableText>Everything You Need to Run Your Barbershop</TranslatableText>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              <TranslatableText>From appointment scheduling to client management, we've got you covered</TranslatableText>
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
      <div id="pricing" className="py-20" style={{ backgroundColor: 'rgb(140 57 18 / 4%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <TranslatableText>Choose Your Plan</TranslatableText>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              <TranslatableText>Flexible pricing options to grow with your barbershop business</TranslatableText>
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                <TranslatableText>3 Months</TranslatableText>
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-amber-600"
              />
              <span className={`text-lg font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                <TranslatableText>12 Months</TranslatableText>
              </span>
              {isAnnual && (
                <Badge className="bg-green-100 text-green-800 ml-2">
                  <TranslatableText>Save 30%</TranslatableText>
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
                      <TranslatableText>Most Popular</TranslatableText>
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
                        <span className="text-lg font-normal text-slate-600"><TranslatableText>/month</TranslatableText></span>
                      </div>
                      <div className="text-sm text-slate-500">
                        <TranslatableText>Billed</TranslatableText> {formatPrice(getPrice(plan))} {isAnnual ? <TranslatableText>annually</TranslatableText> : <TranslatableText>quarterly</TranslatableText>}
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
                    <TranslatableText>Get Started</TranslatableText>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                <TranslatableText>Pricing plans coming soon</TranslatableText>
              </h3>
              <p className="text-gray-600">
                <TranslatableText>We're preparing amazing subscription options for your barbershop.</TranslatableText>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <TranslatableText>Ready to Transform Your Barbershop?</TranslatableText>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            <TranslatableText>Join thousands of barbershops that trust BarberPro for their daily operations</TranslatableText>
          </p>
          <Button 
            size="lg"
            className="px-8 py-4 bg-barber-primary text-white font-semibold hover:bg-barber-secondary"
          >
            <TranslatableText>Get Started Today</TranslatableText>
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                <TranslatableText>About BarberPro</TranslatableText>
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                <TranslatableText>We understand the unique challenges of running a modern barbershop. That's why we created BarberPro - a comprehensive management platform designed specifically for barbershop owners who want to focus on their craft while growing their business.</TranslatableText>
              </p>
              <p className="text-lg text-slate-600 mb-8">
                <TranslatableText>With over 5 years of experience in the industry, we've helped thousands of barbershops streamline their operations, increase revenue, and provide exceptional customer service.</TranslatableText>
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-barber-primary mb-2"><TranslatableText>5K+</TranslatableText></div>
                  <div className="text-slate-600"><TranslatableText>Active Barbershops</TranslatableText></div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-barber-primary mb-2"><TranslatableText>1M+</TranslatableText></div>
                  <div className="text-slate-600"><TranslatableText>Appointments Booked</TranslatableText></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Modern barbershop interior"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <TranslatableText>Get in Touch</TranslatableText>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              <TranslatableText>Have questions? We're here to help you get started with BarberPro</TranslatableText>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-barber-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2"><TranslatableText>Sales</TranslatableText></h3>
              <p className="text-slate-600 mb-4"><TranslatableText>Get a personalized demo and pricing</TranslatableText></p>
              <a href="mailto:sales@barberpro.com" className="text-barber-primary hover:underline">
                <TranslatableText>vendas@barberia.com.br</TranslatableText>
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2"><TranslatableText>Support</TranslatableText></h3>
              <p className="text-slate-600 mb-4"><TranslatableText>Technical help and assistance</TranslatableText></p>
              <a href="mailto:vendas@barberia.com.br" className="text-barber-primary hover:underline">
                <TranslatableText>suporte@barberia.com.br</TranslatableText>
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2"><TranslatableText>Community</TranslatableText></h3>
              <p className="text-slate-600 mb-4"><TranslatableText>Join our barbershop community</TranslatableText></p>
              <a href="mailto:community@barberpro.com" className="text-barber-primary hover:underline">
                <TranslatableText>comunidade@barberpro.com</TranslatableText>
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              <TranslatableText>Start Your Free Trial Today</TranslatableText>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder={t("First Name")}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-barber-primary"
                />
                <input 
                  type="text" 
                  placeholder={t("Last Name")}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-barber-primary"
                />
              </div>
              <input 
                type="email" 
                placeholder={t("Email Address")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-barber-primary"
              />
              <input 
                type="tel" 
                placeholder={t("Phone Number")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-barber-primary"
              />
              <textarea 
                placeholder={t("Tell us about your barbershop")}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-barber-primary"
              ></textarea>
              <Button className="w-full py-3 bg-barber-primary hover:bg-barber-secondary text-white font-semibold">
                <TranslatableText>Start Free Trial</TranslatableText>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <div className="flex items-center mb-6">
                <Crown className="h-8 w-8 text-barber-primary mr-2" />
                <span className="text-xl font-bold"><TranslatableText>BarberPro</TranslatableText></span>
              </div>
              <p className="text-slate-300 mb-6">
                <TranslatableText>The complete barbershop management solution trusted by thousands of professionals worldwide.</TranslatableText>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6"><TranslatableText>Product</TranslatableText></h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Features</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Pricing</TranslatableText>
                  </a>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Dashboard</TranslatableText>
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>API Documentation</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Integrations</TranslatableText>
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6"><TranslatableText>Support</TranslatableText></h3>
              <ul className="space-y-3">
                <li>
                  <a href="#contact" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Contact Us</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Help Center</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Documentation</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Video Tutorials</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Community Forum</TranslatableText>
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Info Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6"><TranslatableText>Company</TranslatableText></h3>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>About Us</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Careers</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Press</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Privacy Policy</TranslatableText>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-white transition-colors">
                    <TranslatableText>Terms of Service</TranslatableText>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                <TranslatableText>© 2025 BarberPro. All rights reserved.</TranslatableText>
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  <TranslatableText>Privacy</TranslatableText>
                </a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  <TranslatableText>Terms</TranslatableText>
                </a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                  <TranslatableText>Cookies</TranslatableText>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
