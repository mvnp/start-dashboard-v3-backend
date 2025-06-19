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
  HeadphonesIcon,
  Building2,
  Languages
} from "lucide-react";

import { TranslatableText } from "@/components/translatable-text";

export const navigationItems = [
  {
    name: <TranslatableText>Dashboard</TranslatableText>,
    href: "/",
    icon: Home,
    current: true,
  },
  {
    name: <TranslatableText>Businesses</TranslatableText>,
    href: "/businesses",
    icon: Building2,
    current: false,
  },
  {
    name: <TranslatableText>Staff</TranslatableText>,
    href: "/staff",
    icon: User,
    current: false,
  },
  {
    name: <TranslatableText>Customers</TranslatableText>,
    href: "/clients",
    icon: Users,
    current: false,
  },
  {
    name: <TranslatableText>Appointments</TranslatableText>,
    href: "/appointments",
    icon: Calendar,
    current: false,
  },
  {
    name: <TranslatableText>Services</TranslatableText>,
    href: "/services",
    icon: Settings,
    current: false,
  },
  {
    name: <TranslatableText>WhatsApp Instances</TranslatableText>,
    href: "/whatsapp",
    icon: MessageCircle,
    current: false,
  },
  {
    name: <TranslatableText>Barber Plans</TranslatableText>,
    href: "/plans",
    icon: Crown,
    current: false,
  },
  {
    name: <TranslatableText>Payment Gateways</TranslatableText>,
    href: "/payment-gateways",
    icon: PaymentIcon,
    current: false,
  },
  {
    name: <TranslatableText>Support Tickets</TranslatableText>,
    href: "/support-tickets",
    icon: HelpCircle,
    current: false,
  },
  {
    name: <TranslatableText>FAQs</TranslatableText>,
    href: "/faqs",
    icon: FileText,
    current: false,
  },
  {
    name: <TranslatableText>Accounting</TranslatableText>,
    href: "/accounting",
    icon: Calculator,
    current: false,
  },
  {
    name: <TranslatableText>Settings</TranslatableText>,
    href: "/settings",
    icon: Settings,
    current: false,
  },
  {
    name: <TranslatableText>Traductions</TranslatableText>,
    href: "/traductions",
    icon: Languages,
    current: false,
  },
  {
    name: <TranslatableText>Support</TranslatableText>,
    href: "/support",
    icon: HeadphonesIcon,
    current: false,
  },
  {
    name: <TranslatableText>Landing Page</TranslatableText>,
    href: "/landing",
    icon: Home,
    current: false,
    target: "_blank",
  },
];

export const quickActions = [
  {
    name: <TranslatableText>New Appointment</TranslatableText>,
    icon: Plus,
    color: "bg-barber-primary hover:bg-barber-secondary text-white",
  },
  {
    name: <TranslatableText>Add Client</TranslatableText>,
    icon: UserPlus,
    color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  },
  {
    name: <TranslatableText>Process Payment</TranslatableText>,
    icon: CreditCard,
    color: "bg-slate-100 hover:bg-slate-200 text-slate-700",
  },
];
