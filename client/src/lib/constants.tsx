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
  Check,
  MessageCircle,
  Crown,
  CreditCard as PaymentIcon,
  HelpCircle,
  FileText,
  Calculator,
  HeadphonesIcon
} from "lucide-react";

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    current: true,
  },
  {
    name: "Staff",
    href: "/staff",
    icon: User,
    current: false,
  },
  {
    name: "Customers",
    href: "/clients",
    icon: Users,
    current: false,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
    current: false,
  },
  {
    name: "Services",
    href: "/services",
    icon: Settings,
    current: false,
  },
  {
    name: "WhatsApp Instances",
    href: "/whatsapp",
    icon: MessageCircle,
    current: false,
  },
  {
    name: "Barber Plans",
    href: "/plans",
    icon: Crown,
    current: false,
  },
  {
    name: "Payment Gateways",
    href: "/payment-gateways",
    icon: PaymentIcon,
    current: false,
  },
  {
    name: "Support Tickets",
    href: "/support-tickets",
    icon: HelpCircle,
    current: false,
  },
  {
    name: "FAQs",
    href: "/faqs",
    icon: FileText,
    current: false,
  },
  {
    name: "Accounting",
    href: "/accounting",
    icon: Calculator,
    current: false,
  },
  {
    name: "Support",
    href: "/support",
    icon: HeadphonesIcon,
    current: false,
  },
  {
    name: "Landing Page",
    href: "/landing",
    icon: Home,
    current: false,
    target: "_blank",
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
