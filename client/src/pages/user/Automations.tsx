import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Zap, Pencil, Trash2, MoreVertical, Play, Pause } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAutomationSchema, type Automation } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

const Automations = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const clientId = 1;

  // Fetch automations
  const { data: automations = [], isLoading } = useQuery<Automation[]>({
    queryKey: ["/api/automations", clientId, statusFilter, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        clientId: clientId.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/automations?${params}`).then((res) => res.json());
    },
  });

  // Create form
  const createForm = useForm<z.infer<typeof insertAutomationSchema>>({
    resolver: zodResolver(insertAutomationSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      description: "",
      trigger: "new_lead",
      conditions: "{}",
      actions: "{}",
      status: "Inactiva",
      executionCount: 0,
      successRate: "0.00",
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof insertAutomationSchema>>({
    resolver: zodResolver(insertAutomationSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      description: "",
      trigger: "new_lead",
      conditions: "{}",
      actions: "{}",
      status: "Inactiva",
      executionCount: 0,
      successRate: "0.00",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertAutomationSchema>) => {
      return await apiRequest("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Automatización creada",
        description: "La automatización se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la automatización.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Automation> }) => {
      return await apiRequest(`/api/automations/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Automatización actualizada",
        description: "La automatización se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedAutomation(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la automatización.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/automations/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Automatización eliminada",
        description: "La automatización se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedAutomation(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la automatización.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (automation: Automation) => {
    setSelectedAutomation(automation);
    editForm.reset({
      clientId: automation.clientId,
      name: automation.name,
      description: automation.description || "",
      trigger: automation.trigger,
      conditions: automation.conditions,
      actions: automation.actions,
      status: automation.status,
      executionCount: automation.executionCount,
      successRate: automation.successRate?.toString() || "0.00",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (automation: Automation) => {
    setSelectedAutomation(automation);
    setDeleteDialogOpen(true);
  };

  const handleToggleStatus = (automation: Automation) => {
    const newStatus = automation.status === "Activa" ? "Inactiva" : "Activa";
    updateMutation.mutate({
      id: automation.id,
      updates: { status: newStatus },
    });
  };

  const onCreateSubmit = (data: z.infer<typeof insertAutomationSchema>) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof insertAutomationSchema>) => {
    if (!selectedAutomation) return;
    updateMutation.mutate({
      id: selectedAutomation.id,
      updates: data,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activa":
        return <Badge variant="default" className="bg-green-600">Activa</Badge>;
      case "Pausada":
        return <Badge variant="default" className="bg-yellow-600">Pausada</Badge>;
      case "Inactiva":
        return <Badge variant="outline">Inactiva</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate statistics
  const totalAutomations = automations.length;
  const activeAutomations = automations.filter(a => a.status === "Activa").length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executionCount, 0);
  const avgSuccessRate = automations.length > 0
    ? (automations.reduce((sum, a) => sum + Number(a.successRate || 0), 0) / automations.length).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Automatizaciones</h2>
          <p className="text-muted-foreground">
            Crea secuencias automatizadas de emails
          </p>
        </div>
        <Button 
          variant="hero" 
          onClick={() => setCreateDialogOpen(true)}
          data-testid="button-create-automation"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva automatización
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total automatizaciones</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-automations">{totalAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeAutomations} activas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Ejecutadas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-executions">{totalExecutions.toLocaleString()}</p>
            <p className="text-xs text-primary mt-1">Total</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Activas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600" data-testid="text-active-automations">{activeAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">de {totalAutomations} totales</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tasa de éxito promedio</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary" data-testid="text-avg-success-rate">{avgSuccessRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar automatizaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Activa">Activas</SelectItem>
            <SelectItem value="Pausada">Pausadas</SelectItem>
            <SelectItem value="Inactiva">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Automations Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando automatizaciones...</p>
        </div>
      ) : automations.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hay automatizaciones</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Crea tu primera automatización de email
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crear primera automatización
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automations.map((automation) => (
            <Card 
              key={automation.id} 
              className="border-border hover:border-primary/50 transition-all duration-300"
              data-testid={`card-automation-${automation.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-gradient-primary/10 p-2 rounded-lg mt-1">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{automation.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{automation.description || "Sin descripción"}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {getStatusBadge(automation.status)}
                        <span className="text-xs text-muted-foreground">Trigger: {automation.trigger}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${automation.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleStatus(automation)}>
                        {automation.status === "Activa" ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(automation)} data-testid={`button-edit-${automation.id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(automation)}
                        data-testid={`button-delete-${automation.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ejecutadas</p>
                    <p className="text-2xl font-bold">{automation.executionCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa éxito</p>
                    <p className="text-2xl font-bold text-primary">{automation.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="text-sm font-medium mt-2">{automation.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear automatización</DialogTitle>
            <DialogDescription>
              Crea una nueva automatización de email
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Secuencia de bienvenida" data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe la automatización..." rows={3} data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="trigger"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger (Disparador)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-trigger">
                          <SelectValue placeholder="Selecciona el trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_lead">Nuevo lead</SelectItem>
                        <SelectItem value="lead_score_change">Cambio en score de lead</SelectItem>
                        <SelectItem value="campaign_click">Clic en campaña</SelectItem>
                        <SelectItem value="form_submit">Envío de formulario</SelectItem>
                        <SelectItem value="inactivity">Inactividad</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado inicial</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inactiva">Inactiva</SelectItem>
                        <SelectItem value="Activa">Activa</SelectItem>
                        <SelectItem value="Pausada">Pausada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? "Creando..." : "Crear automatización"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar automatización</DialogTitle>
            <DialogDescription>
              Modifica la información de la automatización
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Secuencia de bienvenida" data-testid="input-edit-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe la automatización..." rows={3} data-testid="input-edit-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="trigger"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger (Disparador)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-trigger">
                          <SelectValue placeholder="Selecciona el trigger" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_lead">Nuevo lead</SelectItem>
                        <SelectItem value="lead_score_change">Cambio en score de lead</SelectItem>
                        <SelectItem value="campaign_click">Clic en campaña</SelectItem>
                        <SelectItem value="form_submit">Envío de formulario</SelectItem>
                        <SelectItem value="inactivity">Inactividad</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-edit-status">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Inactiva">Inactiva</SelectItem>
                        <SelectItem value="Activa">Activa</SelectItem>
                        <SelectItem value="Pausada">Pausada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  data-testid="button-edit-cancel"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  data-testid="button-edit-submit"
                >
                  {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar automatización?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La automatización "{selectedAutomation?.name}" será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-delete-cancel"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedAutomation && deleteMutation.mutate(selectedAutomation.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-delete-confirm"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Automations;
