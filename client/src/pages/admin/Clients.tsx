import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Plus, Filter, Download } from "lucide-react";
import { toast } from "sonner";

const mockClients = [
  {
    id: "1",
    name: "María García",
    email: "maria@empresa.com",
    plan: "Growth",
    status: "active",
    contacts: 3420,
    emailsSent: 12500,
    registered: "2024-01-15"
  },
  {
    id: "2",
    name: "Juan Martínez",
    email: "juan@startup.es",
    plan: "Essential",
    status: "active",
    contacts: 890,
    emailsSent: 3200,
    registered: "2024-02-03"
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana@business.com",
    plan: "Scale",
    status: "active",
    contacts: 15600,
    emailsSent: 48000,
    registered: "2023-11-20"
  },
  {
    id: "4",
    name: "Carlos Ruiz",
    email: "carlos@tech.io",
    plan: "Growth",
    status: "trial",
    contacts: 1200,
    emailsSent: 0,
    registered: "2024-03-10"
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura@marketing.es",
    plan: "Enterprise",
    status: "active",
    contacts: 45000,
    emailsSent: 120000,
    registered: "2023-08-12"
  },
  {
    id: "6",
    name: "Pedro Fernández",
    email: "pedro@shop.com",
    plan: "Essential",
    status: "suspended",
    contacts: 450,
    emailsSent: 1800,
    registered: "2024-01-28"
  },
];

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || client.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleDelete = () => {
    if (selectedClient) {
      setClients(clients.filter(c => c.id !== selectedClient));
      toast.success("Cliente eliminado correctamente");
      setDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

  const handleSuspend = (id: string) => {
    setClients(clients.map(c => 
      c.id === id ? { ...c, status: c.status === "suspended" ? "active" : "suspended" } : c
    ));
    toast.success("Estado del cliente actualizado");
  };

  const handleExport = () => {
    const csv = [
      ["Nombre", "Email", "Plan", "Estado", "Contactos", "Emails Enviados", "Registro"],
      ...filteredClients.map(c => [
        c.name, c.email, c.plan, c.status, c.contacts, c.emailsSent, c.registered
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes.csv";
    a.click();
    toast.success("Datos exportados correctamente");
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
    toast.success("Filtros aplicados");
  };

  const clearFilters = () => {
    setFilterPlan("all");
    setFilterStatus("all");
    toast.info("Filtros eliminados");
  };

  const getPlanBadge = (plan: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      Essential: "outline",
      Growth: "secondary",
      Scale: "default",
      Enterprise: "default",
    };
    return <Badge variant={variants[plan]}>{plan}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
      active: { variant: "default", label: "Activo" },
      trial: { variant: "secondary", label: "Prueba" },
      suspended: { variant: "destructive", label: "Suspendido" },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Clientes</h2>
          <p className="text-muted-foreground">
            Gestiona los clientes de tu plataforma
          </p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} encontrado{filteredClients.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {(filterPlan !== "all" || filterStatus !== "all") && (
                <Badge variant="default" className="ml-2">
                  {[filterPlan !== "all" ? 1 : 0, filterStatus !== "all" ? 1 : 0].reduce((a, b) => a + b)}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Contactos</TableHead>
                  <TableHead>Emails enviados</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(client.plan)}</TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>{client.contacts.toLocaleString()}</TableCell>
                      <TableCell>{client.emailsSent.toLocaleString()}</TableCell>
                      <TableCell>{new Date(client.registered).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("Vista de detalles")}>
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Editando cliente")}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Enviando email")}>
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspend(client.id)}>
                              {client.status === "suspended" ? "Reactivar" : "Suspender"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedClient(client.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar clientes</DialogTitle>
            <DialogDescription>
              Aplica filtros para refinar la búsqueda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los planes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los planes</SelectItem>
                  <SelectItem value="Essential">Essential</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Scale">Scale</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="trial">Prueba</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
            <Button variant="hero" onClick={applyFilters}>
              Aplicar filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
