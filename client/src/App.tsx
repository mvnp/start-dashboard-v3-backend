import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
            <p className="text-slate-600 mt-2">Appointment management coming soon...</p>
          </div>
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
      <Route path="/whatsapp">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">WhatsApp Instances</h1>
            <p className="text-slate-600 mt-2">WhatsApp integration management coming soon...</p>
          </div>
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
      <Route path="/payments">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Payment Gateways</h1>
            <p className="text-slate-600 mt-2">Payment gateway configuration coming soon...</p>
          </div>
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
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">FAQs</h1>
            <p className="text-slate-600 mt-2">FAQ management coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/accounting">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Accounting</h1>
            <p className="text-slate-600 mt-2">Financial reporting and accounting coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/support">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Support</h1>
            <p className="text-slate-600 mt-2">Customer support tools coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
