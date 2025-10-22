import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Clients from "./pages/admin/Clients";
import Subscriptions from "./pages/admin/Subscriptions";
import Payments from "./pages/admin/Payments";
import Settings from "./pages/admin/Settings";
import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import Leads from "./pages/user/Leads";
import Segments from "./pages/user/Segments";
import Landings from "./pages/user/Landings";
import LandingEditor from "./pages/user/LandingEditor";
import Campaigns from "./pages/user/Campaigns";
import EmailEditor from "./pages/user/EmailEditor";
import Automations from "./pages/user/Automations";
import Statistics from "./pages/user/Statistics";
import AdvancedAnalytics from "./pages/user/AdvancedAnalytics";
import Templates from "./pages/user/Templates";
import ABTesting from "./pages/user/ABTesting";
import Scheduler from "./pages/user/Scheduler";
import Webhooks from "./pages/user/Webhooks";
import Integrations from "./pages/user/Integrations";
import UserSettings from "./pages/user/UserSettings";
import Profile from "./pages/user/Profile";
import Billing from "./pages/user/Billing";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/precios" component={Pricing} />
        <Route path="/nosotros" component={About} />
        <Route path="/contacto" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/registro" component={Register} />
        
        <Route path="/admin">
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/dashboard">
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/clientes">
          <AdminLayout>
            <Clients />
          </AdminLayout>
        </Route>
        <Route path="/admin/suscripciones">
          <AdminLayout>
            <Subscriptions />
          </AdminLayout>
        </Route>
        <Route path="/admin/pagos">
          <AdminLayout>
            <Payments />
          </AdminLayout>
        </Route>
        <Route path="/admin/configuracion">
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </Route>
        
        <Route path="/panel">
          <UserLayout>
            <UserDashboard />
          </UserLayout>
        </Route>
        <Route path="/panel/leads">
          <UserLayout>
            <Leads />
          </UserLayout>
        </Route>
        <Route path="/panel/leads/segmentos">
          <UserLayout>
            <Segments />
          </UserLayout>
        </Route>
        <Route path="/panel/landings">
          <UserLayout>
            <Landings />
          </UserLayout>
        </Route>
        <Route path="/panel/landings/editor">
          <UserLayout>
            <LandingEditor />
          </UserLayout>
        </Route>
        <Route path="/panel/campanas">
          <UserLayout>
            <Campaigns />
          </UserLayout>
        </Route>
        <Route path="/panel/campanas/editor">
          <UserLayout>
            <EmailEditor />
          </UserLayout>
        </Route>
        <Route path="/panel/automatizaciones">
          <UserLayout>
            <Automations />
          </UserLayout>
        </Route>
        <Route path="/panel/estadisticas">
          <UserLayout>
            <Statistics />
          </UserLayout>
        </Route>
        <Route path="/panel/analytics">
          <UserLayout>
            <AdvancedAnalytics />
          </UserLayout>
        </Route>
        <Route path="/panel/templates">
          <UserLayout>
            <Templates />
          </UserLayout>
        </Route>
        <Route path="/panel/ab-testing">
          <UserLayout>
            <ABTesting />
          </UserLayout>
        </Route>
        <Route path="/panel/scheduler">
          <UserLayout>
            <Scheduler />
          </UserLayout>
        </Route>
        <Route path="/panel/webhooks">
          <UserLayout>
            <Webhooks />
          </UserLayout>
        </Route>
        <Route path="/panel/integraciones">
          <UserLayout>
            <Integrations />
          </UserLayout>
        </Route>
        <Route path="/panel/configuracion">
          <UserLayout>
            <UserSettings />
          </UserLayout>
        </Route>
        <Route path="/panel/perfil">
          <UserLayout>
            <Profile />
          </UserLayout>
        </Route>
        <Route path="/panel/facturacion">
          <UserLayout>
            <Billing />
          </UserLayout>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
