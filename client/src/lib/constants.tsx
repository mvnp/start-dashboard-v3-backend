import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  User, 
  BarChart3, 
  LogOut,
  Plus,
  UserPlus,
  CreditCard,
  Check
} from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    current: true,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
    current: false,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    current: false,
  },
  {
    name: "Services",
    href: "/services",
    icon: Settings,
    current: false,
  },
  {
    name: "Staff",
    href: "/staff",
    icon: User,
    current: false,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    current: false,
  },
];

export const quickActions = [
  {
    name: "New Appointment",
    icon: Plus,
    color: "bg-barber-primary hover:bg-barber-secondary text-white",
  },
  {
    name: "Add Client",
    icon: UserPlus,
    color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  },
  {
    name: "Process Payment",
    icon: CreditCard,
    color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  },
];
