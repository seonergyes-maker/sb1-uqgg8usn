import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/precios" element={<Pricing />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="suscripciones" element={<Subscriptions />} />
            <Route path="pagos" element={<Payments />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
          
          {/* User Panel Routes */}
          <Route path="/panel" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/segmentos" element={<Segments />} />
            <Route path="landings" element={<Landings />} />
            <Route path="landings/editor" element={<LandingEditor />} />
            <Route path="campanas" element={<Campaigns />} />
            <Route path="campanas/editor" element={<EmailEditor />} />
            <Route path="automatizaciones" element={<Automations />} />
            <Route path="estadisticas" element={<Statistics />} />
            <Route path="analytics" element={<AdvancedAnalytics />} />
            <Route path="templates" element={<Templates />} />
            <Route path="ab-testing" element={<ABTesting />} />
            <Route path="scheduler" element={<Scheduler />} />
            <Route path="webhooks" element={<Webhooks />} />
            <Route path="integraciones" element={<Integrations />} />
            <Route path="configuracion" element={<UserSettings />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="facturacion" element={<Billing />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
