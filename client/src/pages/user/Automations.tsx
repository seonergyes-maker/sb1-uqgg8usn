import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Zap, Pencil, Trash2, MoreVertical, Play, Pause, Eye, Mail, Clock, ArrowDown } from "lucide-react";
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
import { type Automation } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { AutomationBuilder } from "@/components/user/AutomationBuilder";

interface AutomationAction {
  type: 'send_email' | 'wait';
  emailId?: number;
  emailName?: string;
  duration?: number;
  unit?: 'minutes' | 'hours' | 'days';
}

const automationFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  status: z.string().default("Inactiva"),
});

interface AutomationPreview {
  automation: Automation;
  metrics: {
    total: number;
    active: number;
    completed: number;
    failed: number;
    emailsSent: number;
    emailsOpened: number;
    emailsBounced: number;
    emailsUnsubscribed: number;
    bounceRate: string;
    openRate: string;
  };
  flow: AutomationAction[];
}

const Automations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.id || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create form builder states
  const [createTrigger, setCreateTrigger] = useState("segment_enter");
  const [createTriggerSegmentId, setCreateTriggerSegmentId] = useState<number | undefined>(undefined);
  const [createActions, setCreateActions] = useState<AutomationAction[]>([]);

  // Edit form builder states
  const [editTrigger, setEditTrigger] = useState("segment_enter");
  const [editTriggerSegmentId, setEditTriggerSegmentId] = useState<number | undefined>(undefined);
  const [editActions, setEditActions] = useState<AutomationAction[]>([]);

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

  // Fetch preview data
  const { data: previewData, isLoading: isLoadingPreview } = useQuery<AutomationPreview>({
    queryKey: ["/api/automations", selectedAutomation?.id, "preview"],
    queryFn: () => 
      fetch(`/api/automations/${selectedAutomation?.id}/preview`).then((res) => res.json()),
    enabled: previewDialogOpen && !!selectedAutomation,
  });

  // Create form
  const createForm = useForm<z.infer<typeof automationFormSchema>>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Inactiva",
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof automationFormSchema>>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Inactiva",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof automationFormSchema>) => {
      const payload = {
        clientId,
        name: data.name,
        description: data.description || "",
        trigger: createTrigger,
        conditions: JSON.stringify({ segmentId: createTriggerSegmentId }),
        actions: JSON.stringify(createActions),
        status: data.status,
        executionCount: 0,
        successRate: "0.00",
      };
      return await apiRequest("/api/automations", "POST", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Automatización creada",
        description: "La automatización se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
      setCreateActions([]);
      setCreateTriggerSegmentId(undefined);
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
    mutationFn: async (data: { id: number; updates: z.infer<typeof automationFormSchema> }) => {
      const payload = {
        name: data.updates.name,
        description: data.updates.description || "",
        trigger: editTrigger,
        conditions: JSON.stringify({ segmentId: editTriggerSegmentId }),
        actions: JSON.stringify(editActions),
        status: data.updates.status,
      };
      return await apiRequest(`/api/automations/${data.id}`, "PATCH", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Automatización actualizada",
        description: "La automatización se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedAutomation(null);
      setEditActions([]);
      setEditTriggerSegmentId(undefined);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la automatización.",
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation (separate from update to avoid corrupting data)
  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      // Only send status field
      return await apiRequest(`/api/automations/${data.id}`, "PATCH", { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automations", clientId] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la automatización se ha actualizado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la automatización.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/automations/${id}`, "DELETE");
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
    if (automation.status === "Activa") {
      toast({
        title: "Error",
        description: "Pausa la automatización antes de editarla",
        variant: "destructive",
      });
      return;
    }

    setSelectedAutomation(automation);
    
    // Parse actions from JSON string
    let parsedActions: AutomationAction[] = [];
    try {
      parsedActions = JSON.parse(automation.actions || "[]");
    } catch (e) {
      parsedActions = [];
    }

    // Parse conditions to get segmentId
    let segmentId: number | undefined;
    try {
      const conditions = JSON.parse(automation.conditions || "{}");
      segmentId = conditions.segmentId;
    } catch (e) {
      segmentId = undefined;
    }

    setEditTrigger(automation.trigger);
    setEditTriggerSegmentId(segmentId);
    setEditActions(parsedActions);

    editForm.reset({
      name: automation.name,
      description: automation.description || "",
      status: automation.status,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (automation: Automation) => {
    setSelectedAutomation(automation);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (automation: Automation) => {
    setSelectedAutomation(automation);
    setPreviewDialogOpen(true);
  };

  const handleToggleStatus = (automation: Automation) => {
    const newStatus = automation.status === "Activa" ? "Inactiva" : "Activa";
    toggleStatusMutation.mutate({
      id: automation.id,
      status: newStatus,
    });
  };

  const onCreateSubmit = (data: z.infer<typeof automationFormSchema>) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof automationFormSchema>) => {
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

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case "segment_enter":
        return "Lead entra al segmento";
      case "segment_exit":
        return "Lead sale del segmento";
      case "segment_belongs":
        return "Lead pertenece al segmento";
      default:
        return trigger;
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
                        <span className="text-xs text-muted-foreground">
                          {getTriggerLabel(automation.trigger)}
                        </span>
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
                      <DropdownMenuItem onClick={() => handlePreview(automation)} data-testid={`button-preview-${automation.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Previsualizar
                      </DropdownMenuItem>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear automatización</DialogTitle>
            <DialogDescription>
              Configura el flujo de tu automatización de email
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
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

              <AutomationBuilder
                trigger={createTrigger}
                triggerSegmentId={createTriggerSegmentId}
                actions={createActions}
                onTriggerChange={setCreateTrigger}
                onTriggerSegmentChange={setCreateTriggerSegmentId}
                onActionsChange={setCreateActions}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar automatización</DialogTitle>
            <DialogDescription>
              Modifica el flujo de tu automatización (solo si está pausada o inactiva)
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
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

              <AutomationBuilder
                trigger={editTrigger}
                triggerSegmentId={editTriggerSegmentId}
                actions={editActions}
                onTriggerChange={setEditTrigger}
                onTriggerSegmentChange={setEditTriggerSegmentId}
                onActionsChange={setEditActions}
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
                  data-testid="button-cancel-edit"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  data-testid="button-submit-edit"
                >
                  {updateMutation.isPending ? "Actualizando..." : "Actualizar automatización"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Previsualización: {selectedAutomation?.name}</DialogTitle>
            <DialogDescription>
              Visualiza el flujo y las métricas de esta automatización
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingPreview ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando previsualización...</p>
            </div>
          ) : previewData ? (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Métricas de Ejecución</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{previewData.metrics.total}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Activas</p>
                      <p className="text-2xl font-bold text-green-600">{previewData.metrics.active}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Completadas</p>
                      <p className="text-2xl font-bold text-blue-600">{previewData.metrics.completed}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Fallidas</p>
                      <p className="text-2xl font-bold text-red-600">{previewData.metrics.failed}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Emails Enviados</p>
                      <p className="text-2xl font-bold">{previewData.metrics.emailsSent}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Emails Abiertos</p>
                      <p className="text-2xl font-bold">{previewData.metrics.emailsOpened}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Tasa Apertura</p>
                      <p className="text-2xl font-bold text-primary">{previewData.metrics.openRate}%</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">Tasa Rebote</p>
                      <p className="text-2xl font-bold">{previewData.metrics.bounceRate}%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Flow Visualization */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Flujo de Automatización</h3>
                <div className="space-y-3">
                  {previewData.flow.map((action, index) => (
                    <div key={index} className="space-y-2">
                      {index > 0 && (
                        <div className="flex justify-center">
                          <ArrowDown className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      
                      <Card className="border-dashed">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            {action.type === 'send_email' ? (
                              <>
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">Enviar Email</p>
                                  <p className="text-sm text-muted-foreground">
                                    {action.emailName || `Email ID: ${action.emailId}`}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="bg-yellow-500/10 p-2 rounded-lg">
                                  <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Esperar</p>
                                  <p className="text-sm text-muted-foreground">
                                    {action.duration} {action.unit === 'minutes' ? 'minutos' : action.unit === 'hours' ? 'horas' : 'días'}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se pudo cargar la previsualización</p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)} data-testid="button-close-preview">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar automatización?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la automatización "{selectedAutomation?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedAutomation && deleteMutation.mutate(selectedAutomation.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
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
