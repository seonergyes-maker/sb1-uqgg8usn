import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center gap-4 p-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Panel de Administración</h1>
            </div>
          </header>
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
