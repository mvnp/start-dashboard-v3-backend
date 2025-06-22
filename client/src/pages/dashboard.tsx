import { Calendar, DollarSign, Users, CheckCircle, Plus, UserPlus, CreditCard, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@shared/schema";
import { Link } from "wouter";
import { TranslatableText } from "@/components/translatable-text";

interface DashboardStats {
  todayAppointments: number;
  yesterdayAppointments: number;
  appointmentChange: string;
  todayRevenue: number;
  yesterdayRevenue: number;
  revenueChange: string;
  revenueChangeType: 'positive' | 'negative' | 'neutral';
  todayClients: number;
  yesterdayClients: number;
  totalClients: number;
  clientChange: string;
  clientChangeType: 'positive' | 'negative' | 'neutral';
  todayCompleted: number;
  yesterdayCompleted: number;
  completedServices: number;
  completedChange: string;
  completedChangeType: 'positive' | 'negative' | 'neutral';
}

const recentAppointments = [
  {
    id: 1,
    client: "John Doe",
    service: "Haircut & Beard Trim",
    time: "9:00 AM",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
    avatar: "JD",
    avatarBg: "bg-barber-primary",
  },
  {
    id: 2,
    client: "Mike Smith",
    service: "Premium Cut",
    time: "10:30 AM",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-800",
    avatar: "MS",
    avatarBg: "bg-barber-secondary",
  },
  {
    id: 3,
    client: "Robert Johnson",
    service: "Shave & Style",
    time: "12:00 PM",
    status: "Upcoming",
    statusColor: "bg-yellow-100 text-yellow-800",
    avatar: "RJ",
    avatarBg: "bg-barber-accent",
  },
];

const todaySchedule = [
  {
    time: "9:00 AM - 9:30 AM",
    client: "John Doe - Haircut",
    color: "bg-green-500",
  },
  {
    time: "10:30 AM - 11:15 AM",
    client: "Mike Smith - Premium Cut",
    color: "bg-blue-500",
  },
  {
    time: "12:00 PM - 12:45 PM",
    client: "Robert Johnson - Shave",
    color: "bg-yellow-500",
  },
];

const quickActions = [
  {
    name: <TranslatableText>New Appointment</TranslatableText>,
    icon: Plus,
    style: { backgroundColor: 'var(--barber-primary)', color: 'white' },
    hoverStyle: { backgroundColor: 'var(--barber-secondary)' },
  },
  {
    name: <TranslatableText>Add Client</TranslatableText>,
    icon: UserPlus,
    style: { backgroundColor: 'var(--barber-primary)', color: 'white' },
    hoverStyle: { backgroundColor: 'var(--barber-secondary)' },
  },
  {
    name: <TranslatableText>Process Payment</TranslatableText>,
    icon: CreditCard,
    style: { backgroundColor: 'var(--barber-primary)', color: 'white' },
    hoverStyle: { backgroundColor: 'var(--barber-secondary)' },
  },
];

export default function Dashboard() {
  // No business context needed

  // Fetch dashboard statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    staleTime: 30000, // Cache for 30 seconds
    refetchOnMount: true,
  });

  // Fetch recent appointments
  const { data: appointmentsData } = useQuery({
    queryKey: ["/api/appointments"],
    select: (data: any) => data.appointments?.slice(0, 3) || [],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statsCards = [
    {
      title: <TranslatableText>Today's Appointments</TranslatableText>,
      value: isLoadingStats ? "..." : stats?.todayAppointments.toString() || "0",
      change: isLoadingStats ? "Loading..." : stats?.appointmentChange || "No data",
      changeType: "neutral",
      icon: Calendar,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: <TranslatableText>Daily Revenue</TranslatableText>,
      value: isLoadingStats ? "..." : formatCurrency(stats?.todayRevenue || 0),
      change: isLoadingStats ? "Loading..." : stats?.revenueChange || "No data",
      changeType: stats?.revenueChangeType || "neutral",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: <TranslatableText>Total Clients</TranslatableText>,
      value: isLoadingStats ? "..." : stats?.totalClients.toString() || "0",
      change: isLoadingStats ? "Loading..." : stats?.clientChange || "No data",
      changeType: stats?.clientChangeType || "neutral",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: <TranslatableText>Services Completed</TranslatableText>,
      value: isLoadingStats ? "..." : stats?.todayCompleted.toString() || "0",
      change: isLoadingStats ? "Loading..." : stats?.completedChange || "No data",
      changeType: stats?.completedChangeType || "neutral",
      icon: CheckCircle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: 'var(--barber-primary)'}}>
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              <TranslatableText>Dashboard</TranslatableText>
            </h1>
            <p className="text-slate-600 mt-2">
              <TranslatableText>Welcome back! Here's what's happening at your barbershop today.</TranslatableText>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 
                      'text-slate-500'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 ${stat.iconBg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <TranslatableText tag="div" className="text-lg font-semibold">Recent Appointments</TranslatableText>
                <Link href="/appointments">
                  <Button variant="ghost" className="text-sm barber-primary hover:text-barber-secondary font-medium">
                    <TranslatableText>View All</TranslatableText>
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${appointment.avatarBg} rounded-full flex items-center justify-center text-white font-medium`}>
                        {appointment.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{appointment.client}</p>
                        <p className="text-sm text-slate-600">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{appointment.time}</p>
                      <Badge className={`${appointment.statusColor} border-0`}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Schedule */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold"><TranslatableText>Quick Actions</TranslatableText></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/appointments/new">
                  <Button 
                    className="w-full justify-center transition-colors bg-barber-primary hover:bg-barber-secondary text-white"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <TranslatableText>New Appointment</TranslatableText>
                  </Button>
                </Link>
                
                <Link href="/clients/new">
                  <Button 
                    className="w-full justify-center transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700"
                    size="lg"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    <TranslatableText>Add Client</TranslatableText>
                  </Button>
                </Link>
                
                <Link href="/accounting-transactions/new">
                  <Button 
                    className="w-full justify-center transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700"
                    size="lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    <TranslatableText>Add Revenue or Expense</TranslatableText>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TranslatableText tag="div" className="text-lg font-semibold">Today's Schedule</TranslatableText>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.time}</p>
                        <p className="text-xs text-slate-600">{item.client}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
