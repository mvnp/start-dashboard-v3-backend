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
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-600 mt-2">Client management coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/services">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Services</h1>
            <p className="text-slate-600 mt-2">Service management coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/staff">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Staff</h1>
            <p className="text-slate-600 mt-2">Staff management coming soon...</p>
          </div>
        </Layout>
      </Route>
      <Route path="/reports">
        <Layout>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-600 mt-2">Reports and analytics coming soon...</p>
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
