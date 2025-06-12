import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";

import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Logout from "@/pages/logout";
import Landing from "@/pages/landing";
import StaffList from "@/pages/staff-list";
import StaffForm from "@/pages/staff-form";
import ClientList from "@/pages/client-list";
import ClientForm from "@/pages/client-form";
import BarberPlanList from "@/pages/barber-plan-list";
import BarberPlanForm from "@/pages/barber-plan-form";
import ServiceList from "@/pages/service-list";
import ServiceForm from "@/pages/service-form";
import AppointmentList from "@/pages/appointment-list";
import AppointmentForm from "@/pages/appointment-form";
import PaymentGatewayList from "@/pages/payment-gateway-list";
import PaymentGatewayForm from "@/pages/payment-gateway-form";
import AccountingList from "@/pages/accounting-list";
import AccountingForm from "@/pages/accounting-form";
import SupportTicketList from "@/pages/support-ticket-list";
import SupportTicketForm from "@/pages/support-ticket-form";
import FaqList from "@/pages/faq-list";
import FaqForm from "@/pages/faq-form";
import WhatsappList from "@/pages/whatsapp-list";
import WhatsappForm from "@/pages/whatsapp-form";
import BusinessList from "@/pages/business-list";
import BusinessForm from "@/pages/business-form";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-0 min-h-screen">
        <MobileHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/landing" component={Landing} />
      <Route path="/">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/appointments">
        <Layout>
          <AppointmentList />
        </Layout>
      </Route>
      <Route path="/appointments/new">
        <Layout>
          <AppointmentForm />
        </Layout>
      </Route>
      <Route path="/appointments/:id/edit">
        <Layout>
          <AppointmentForm />
        </Layout>
      </Route>
      <Route path="/clients">
        <Layout>
          <ClientList />
        </Layout>
      </Route>
      <Route path="/clients/new">
        <Layout>
          <ClientForm />
        </Layout>
      </Route>
      <Route path="/clients/edit/:id">
        <Layout>
          <ClientForm />
        </Layout>
      </Route>
      <Route path="/services">
        <Layout>
          <ServiceList />
        </Layout>
      </Route>
      <Route path="/services/new">
        <Layout>
          <ServiceForm />
        </Layout>
      </Route>
      <Route path="/services/:id/edit">
        <Layout>
          <ServiceForm />
        </Layout>
      </Route>
      <Route path="/staff">
        <Layout>
          <StaffList />
        </Layout>
      </Route>
      <Route path="/staff/new">
        <Layout>
          <StaffForm />
        </Layout>
      </Route>
      <Route path="/staff/edit/:id">
        <Layout>
          <StaffForm />
        </Layout>
      </Route>

      <Route path="/businesses">
        <Layout>
          <BusinessList />
        </Layout>
      </Route>
      <Route path="/businesses/new">
        <Layout>
          <BusinessForm />
        </Layout>
      </Route>
      <Route path="/businesses/:id/edit">
        <Layout>
          <BusinessForm />
        </Layout>
      </Route>

      <Route path="/plans">
        <Layout>
          <BarberPlanList />
        </Layout>
      </Route>
      <Route path="/plans/new">
        <Layout>
          <BarberPlanForm />
        </Layout>
      </Route>
      <Route path="/plans/:id/edit">
        <Layout>
          <BarberPlanForm />
        </Layout>
      </Route>
      <Route path="/payment-gateways">
        <Layout>
          <PaymentGatewayList />
        </Layout>
      </Route>
      <Route path="/payment-gateways/new">
        <Layout>
          <PaymentGatewayForm />
        </Layout>
      </Route>
      <Route path="/payment-gateways/:id/edit">
        <Layout>
          <PaymentGatewayForm />
        </Layout>
      </Route>
      <Route path="/accounting">
        <Layout>
          <AccountingList />
        </Layout>
      </Route>
      <Route path="/accounting-form">
        <Layout>
          <AccountingForm />
        </Layout>
      </Route>
      <Route path="/accounting-form/:id">
        <Layout>
          <AccountingForm />
        </Layout>
      </Route>
      <Route path="/support-tickets">
        <Layout>
          <SupportTicketList />
        </Layout>
      </Route>
      <Route path="/support-tickets/new">
        <Layout>
          <SupportTicketForm />
        </Layout>
      </Route>
      <Route path="/support-tickets/:id">
        <Layout>
          <SupportTicketForm />
        </Layout>
      </Route>
      <Route path="/support-tickets/:id/edit">
        <Layout>
          <SupportTicketForm />
        </Layout>
      </Route>
      <Route path="/support">
        <Layout>
          <Support />
        </Layout>
      </Route>
      <Route path="/tickets">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
            <p className="text-slate-600 mt-2">Support ticket management coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/faqs">
        <Layout>
          <FaqList />
        </Layout>
      </Route>
      <Route path="/faqs/new">
        <Layout>
          <FaqForm />
        </Layout>
      </Route>
      <Route path="/faqs/:id/edit">
        <Layout>
          <FaqForm />
        </Layout>
      </Route>
      <Route path="/whatsapp">
        <Layout>
          <WhatsappList />
        </Layout>
      </Route>
      <Route path="/whatsapp/new">
        <Layout>
          <WhatsappForm />
        </Layout>
      </Route>
      <Route path="/whatsapp/:id/edit">
        <Layout>
          <WhatsappForm />
        </Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
