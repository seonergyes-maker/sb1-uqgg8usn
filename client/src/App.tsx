import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch } from "wouter";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import EmailEditor from "./pages/user/EmailEditor";
import Emails from "./pages/user/Emails";
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
import PublicLanding from "./pages/PublicLanding";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
          
          {/* Ruta pública para landings - sin autenticación */}
          <Route path="/l/:slug" component={PublicLanding} />
          
          <Route path="/admin">
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          </Route>
        <Route path="/admin/dashboard">
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/clientes">
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Clients />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/suscripciones">
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Subscriptions />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/pagos">
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Payments />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/admin/configuracion">
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        </Route>
        
        <Route path="/panel">
          <ProtectedRoute>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/leads">
          <ProtectedRoute>
            <UserLayout>
              <Leads />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/leads/segmentos">
          <ProtectedRoute>
            <UserLayout>
              <Segments />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/landings">
          <ProtectedRoute>
            <UserLayout>
              <Landings />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/landings/editor">
          <ProtectedRoute>
            <UserLayout>
              <LandingEditor />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/emails">
          <ProtectedRoute>
            <UserLayout>
              <Emails />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/emails/:id/edit">
          <ProtectedRoute>
            <UserLayout>
              <EmailEditor />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/automatizaciones">
          <ProtectedRoute>
            <UserLayout>
              <Automations />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/estadisticas">
          <ProtectedRoute>
            <UserLayout>
              <Statistics />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/analytics">
          <ProtectedRoute>
            <UserLayout>
              <AdvancedAnalytics />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/templates">
          <ProtectedRoute>
            <UserLayout>
              <Templates />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/ab-testing">
          <ProtectedRoute>
            <UserLayout>
              <ABTesting />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/scheduler">
          <ProtectedRoute>
            <UserLayout>
              <Scheduler />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/webhooks">
          <ProtectedRoute>
            <UserLayout>
              <Webhooks />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/integraciones">
          <ProtectedRoute>
            <UserLayout>
              <Integrations />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/configuracion">
          <ProtectedRoute>
            <UserLayout>
              <UserSettings />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/perfil">
          <ProtectedRoute>
            <UserLayout>
              <Profile />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/panel/facturacion">
          <ProtectedRoute>
            <UserLayout>
              <Billing />
            </UserLayout>
          </ProtectedRoute>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </AuthProvider>
  </QueryClientProvider>
);

export default App;
