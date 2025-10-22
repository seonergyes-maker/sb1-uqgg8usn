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
        
        <Route path="/admin" component={AdminLayout} />
        <Route path="/admin/:rest*">
          {(params) => {
            const path = params.rest || "";
            return (
              <AdminLayout>
                <Switch>
                  <Route path="/admin" component={Dashboard} />
                  <Route path="/admin/clientes" component={Clients} />
                  <Route path="/admin/suscripciones" component={Subscriptions} />
                  <Route path="/admin/pagos" component={Payments} />
                  <Route path="/admin/configuracion" component={Settings} />
                </Switch>
              </AdminLayout>
            );
          }}
        </Route>
        
        <Route path="/panel" component={UserLayout} />
        <Route path="/panel/:rest*">
          {(params) => {
            const path = params.rest || "";
            return (
              <UserLayout>
                <Switch>
                  <Route path="/panel" component={UserDashboard} />
                  <Route path="/panel/leads" component={Leads} />
                  <Route path="/panel/leads/segmentos" component={Segments} />
                  <Route path="/panel/landings" component={Landings} />
                  <Route path="/panel/landings/editor" component={LandingEditor} />
                  <Route path="/panel/campanas" component={Campaigns} />
                  <Route path="/panel/campanas/editor" component={EmailEditor} />
                  <Route path="/panel/automatizaciones" component={Automations} />
                  <Route path="/panel/estadisticas" component={Statistics} />
                  <Route path="/panel/analytics" component={AdvancedAnalytics} />
                  <Route path="/panel/templates" component={Templates} />
                  <Route path="/panel/ab-testing" component={ABTesting} />
                  <Route path="/panel/scheduler" component={Scheduler} />
                  <Route path="/panel/webhooks" component={Webhooks} />
                  <Route path="/panel/integraciones" component={Integrations} />
                  <Route path="/panel/configuracion" component={UserSettings} />
                  <Route path="/panel/perfil" component={Profile} />
                  <Route path="/panel/facturacion" component={Billing} />
                </Switch>
              </UserLayout>
            );
          }}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
