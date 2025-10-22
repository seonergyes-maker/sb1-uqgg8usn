import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { MoreHorizontal, CreditCard, UserCheck, XCircle, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Subscription } from "@shared/schema";

type SubscriptionWithClient = Subscription & { clientName: string };

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
  
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: subscriptions = [], isLoading } = useQuery<SubscriptionWithClient[]>({
    queryKey: ['/api/subscriptions', { plan: filterPlan, status: filterStatus, search: searchTerm }],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Subscription> }) => {
      return await apiRequest(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscriptions'] });
    },
  });

  const stats = {
    active: subscriptions.filter(s => s.status === "active").length,
    trial: subscriptions.filter(s => s.status === "trial").length,
    canceled: subscriptions.filter(s => s.status === "canceled").length,
  };

  const handleCancel = async () => {
    if (selectedSubscription) {
      try {
        await updateMutation.mutateAsync({
          id: selectedSubscription,
          data: { status: "canceled", nextBilling: null },
        });
        toast.success("Suscripción cancelada correctamente");
        setCancelDialogOpen(false);
        setSelectedSubscription(null);
      } catch (error) {
        toast.error("Error al cancelar la suscripción");
      }
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextBillingDate = nextMonth.toISOString().split('T')[0];
      
      await updateMutation.mutateAsync({
        id,
        data: { 
          status: "active",
          nextBilling: nextBillingDate
        },
      });
      toast.success("Suscripción reactivada correctamente");
    } catch (error) {
      toast.error("Error al reactivar la suscripción");
    }
  };

  const handleExport = () => {
    const csv = [
      ["Cliente", "Plan", "Precio", "Estado", "Inicio", "Próxima facturación"],
      ...subscriptions.map(s => [
        s.clientName,
        s.plan,
        s.price,
        s.status,
        s.startDate,
        s.nextBilling || "-"
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "suscripciones.csv";
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
      active: { variant: "default", label: "Activa" },
      trial: { variant: "secondary", label: "Prueba" },
      canceled: { variant: "destructive", label: "Cancelada" },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  if (isLoading) {
    return <div className="p-8">Cargando suscripciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Suscripciones</h2>
        <p className="text-muted-foreground">
          Administra las suscripciones activas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border" data-testid="card-subscriptions-active">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activas
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-count">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-subscriptions-trial">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En prueba
            </CardTitle>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <UserCheck className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-trial-count">{stats.trial}</div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-subscriptions-canceled">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Canceladas
            </CardTitle>
            <div className="bg-destructive/10 p-2 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-canceled-count">{stats.canceled}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Lista de suscripciones</CardTitle>
          <CardDescription>
            {subscriptions.length} suscripción{subscriptions.length !== 1 ? "es" : ""} encontrada{subscriptions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por cliente o plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              data-testid="input-search"
            />
            <Button variant="outline" onClick={() => setFilterDialogOpen(true)} data-testid="button-filters">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {(filterPlan !== "all" || filterStatus !== "all") && (
                <Badge variant="default" className="ml-2">
                  {[filterPlan !== "all" ? 1 : 0, filterStatus !== "all" ? 1 : 0].reduce((a, b) => a + b)}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleExport} data-testid="button-export">
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
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Próxima facturación</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron suscripciones
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((sub) => (
                    <TableRow key={sub.id} data-testid={`row-subscription-${sub.id}`}>
                      <TableCell className="font-medium" data-testid={`text-client-${sub.id}`}>{sub.clientName}</TableCell>
                      <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                      <TableCell data-testid={`text-price-${sub.id}`}>€{sub.price}/mes</TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${sub.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("Vista de detalles")}>
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Cambiar plan")}>
                              Cambiar plan
                            </DropdownMenuItem>
                            {sub.status === "canceled" ? (
                              <DropdownMenuItem onClick={() => handleReactivate(sub.id)} data-testid={`button-reactivate-${sub.id}`}>
                                Reactivar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedSubscription(sub.id);
                                  setCancelDialogOpen(true);
                                }}
                                data-testid={`button-cancel-${sub.id}`}
                              >
                                Cancelar suscripción
                              </DropdownMenuItem>
                            )}
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
            <DialogTitle>Filtrar suscripciones</DialogTitle>
            <DialogDescription>
              Aplica filtros para refinar la búsqueda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger data-testid="select-filter-plan">
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
                <SelectTrigger data-testid="select-filter-status">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="trial">Prueba</SelectItem>
                  <SelectItem value="canceled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
              Limpiar filtros
            </Button>
            <Button variant="hero" onClick={applyFilters} data-testid="button-apply-filters">
              Aplicar filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar suscripción?</AlertDialogTitle>
            <AlertDialogDescription>
              El cliente perderá acceso a las funcionalidades de su plan. Esta acción se puede revertir reactivando la suscripción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-keep-active">Mantener activa</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-cancel">
              Cancelar suscripción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscriptions;
