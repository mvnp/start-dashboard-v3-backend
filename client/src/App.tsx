import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryPersistenceManager } from "./lib/persisted-query-client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { EditionProvider } from "@/lib/edition-context";
import { TranslationCacheProvider } from "@/lib/translation-cache";
import { BusinessProvider } from "@/lib/business-context";
import { BusinessLanguageProvider } from "@/lib/business-language-context";

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
import Settings from "@/pages/settings";
import Traductions from "@/pages/traductions";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";
import { TranslatableText } from "./components/translatable-text";

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
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, only allow access to login, logout, and landing pages
  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/landing" component={Landing} />
        <Route>
          <Login />
        </Route>
      </Switch>
    );
  }

  // If user is authenticated, allow access to all protected routes
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
      <Route path="/dashboard">
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
            <h1 className="text-3xl font-bold text-slate-900"><TranslatableText>Support Tickets</TranslatableText></h1>
            <p className="text-slate-600 mt-2"><TranslatableText>Support ticket management coming soon...</TranslatableText></p>
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
      <Route path="/settings">
        <Layout>
          <Settings />
        </Layout>
      </Route>
      <Route path="/traductions">
        <Layout>
          <Traductions />
        </Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize query cache persistence on app startup
  useEffect(() => {
    // Restore cached query data on app start
    QueryPersistenceManager.restoreQueryData(queryClient);

    // Save query data periodically and before unload
    const saveInterval = setInterval(() => {
      QueryPersistenceManager.saveQueryData(queryClient);
    }, 30000); // Save every 30 seconds

    const handleBeforeUnload = () => {
      QueryPersistenceManager.saveQueryData(queryClient);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BusinessProvider>
          <BusinessLanguageProvider>
            <EditionProvider>
              <TranslationCacheProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </TranslationCacheProvider>
            </EditionProvider>
          </BusinessLanguageProvider>
        </BusinessProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
