import { NavLink, useLocation } from "wouter";
import { 
  LayoutDashboard,
  Users, 
  FileText, 
  Mail, 
  Workflow, 
  BarChart3, 
  Settings, 
  User, 
  CreditCard,
  Rocket,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Link } from "wouter";

const menuItems = [
  { title: "Dashboard", url: "/panel", icon: LayoutDashboard },
  { 
    title: "Leads", 
    url: "/panel/leads", 
    icon: Users,
    submenu: [
      { title: "Todos los leads", url: "/panel/leads" },
      { title: "Segmentos", url: "/panel/leads/segmentos" }
    ]
  },
  { title: "Landings", url: "/panel/landings", icon: FileText },
  { title: "Campañas", url: "/panel/campanas", icon: Mail },
  { title: "Automatizaciones", url: "/panel/automatizaciones", icon: Workflow },
  { title: "Estadísticas", url: "/panel/estadisticas", icon: BarChart3 },
];

const settingsItems = [
  { title: "Configuración", url: "/panel/configuracion", icon: Settings },
  { title: "Perfil", url: "/panel/perfil", icon: User },
  { title: "Pagos y Facturación", url: "/panel/facturacion", icon: CreditCard },
];

export function UserSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/panel") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isSubmenuActive = (submenu: { url: string }[]) => {
    return submenu.some(item => location.pathname === item.url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LandFlow
              </span>
            )}
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                item.submenu ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isSubmenuActive(item.submenu)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isActive(item.url)}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url} end={item.url === "/panel"}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
