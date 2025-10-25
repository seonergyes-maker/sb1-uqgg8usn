import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, MoreVertical, Loader2 } from "lucide-react";
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
  DialogTrigger,
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
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Lead } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Leads = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.id || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Fetch leads
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads", clientId, statusFilter, sourceFilter, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        clientId: clientId.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sourceFilter !== "all") params.append("source", sourceFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/leads?${params}`).then((res) => res.json());
    },
  });

  // Create lead mutation
  const createForm = useForm<z.infer<typeof insertLeadSchema>>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      clientId,
      name: "",
      email: "",
      phone: "",
      source: "Manual",
      status: "Nuevo",
      score: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertLeadSchema>) => {
      return await apiRequest("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", clientId] });
      toast({
        title: "Lead creado",
        description: "El lead se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el lead.",
        variant: "destructive",
      });
    },
  });

  // Update lead mutation
  const editForm = useForm<z.infer<typeof insertLeadSchema>>({
    resolver: zodResolver(insertLeadSchema),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Lead> }) => {
      return await apiRequest(`/api/leads/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", clientId] });
      toast({
        title: "Lead actualizado",
        description: "El lead se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedLead(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el lead.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/leads/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", clientId] });
      toast({
        title: "Lead eliminado",
        description: "El lead se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedLead(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el lead.",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    const csvContent = [
      ["Nombre", "Email", "Teléfono", "Origen", "Estado", "Score", "Fecha"],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone || "",
        lead.source,
        lead.status,
        lead.score,
        new Date(lead.createdAt).toLocaleDateString("es-ES"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast({
      title: "Exportación exitosa",
      description: "Los leads se han exportado correctamente.",
    });
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    editForm.reset({
      clientId: lead.clientId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      source: lead.source,
      status: lead.status,
      score: lead.score,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const onCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const onEditSubmit = editForm.handleSubmit((data) => {
    if (selectedLead) {
      updateMutation.mutate({ id: selectedLead.id, updates: data });
    }
  });

  // Calculate statistics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((l) => l.status === "Calificado").length;
  const convertedLeads = leads.filter((l) => l.status === "Convertido").length;
  const avgScore = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / totalLeads) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2" data-testid="text-page-title">Leads</h2>
          <p className="text-muted-foreground">
            Gestiona todos tus contactos y leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" data-testid="button-add-lead">
                <Plus className="mr-2 h-4 w-4" />
                Añadir lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo lead</DialogTitle>
                <DialogDescription>
                  Añade un nuevo contacto a tu base de datos
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={onCreateSubmit} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="correo@ejemplo.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 612 345 678" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                      {createMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Crear lead
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total leads</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-leads">{totalLeads}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Calificados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-qualified-leads">{qualifiedLeads}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Convertidos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-converted-leads">{convertedLeads}</p>
            <p className="text-xs text-green-500 mt-1">
              {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0}% conversión
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Score promedio</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-avg-score">{avgScore}</p>
            <p className="text-xs text-muted-foreground mt-1">De 100 puntos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-filters">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  {(statusFilter !== "all" || sourceFilter !== "all") && (
                    <Badge variant="default" className="ml-2">
                      Activos
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros avanzados</DialogTitle>
                  <DialogDescription>
                    Filtra los leads por estado y origen
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger data-testid="select-filter-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Nuevo">Nuevo</SelectItem>
                        <SelectItem value="Calificado">Calificado</SelectItem>
                        <SelectItem value="Contactado">Contactado</SelectItem>
                        <SelectItem value="Convertido">Convertido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Origen</Label>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger data-testid="select-filter-source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los orígenes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStatusFilter("all");
                        setSourceFilter("all");
                      }}
                      data-testid="button-clear-filters"
                    >
                      Limpiar filtros
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setFilterDialogOpen(false)}
                      data-testid="button-apply-filters"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay leads disponibles. Crea tu primer lead.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${lead.id}`}>
                      {lead.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm" data-testid={`text-email-${lead.id}`}>
                          {lead.email}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`text-phone-${lead.id}`}>
                          {lead.phone || "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" data-testid={`text-source-${lead.id}`}>
                      {lead.source}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lead.status === "Nuevo"
                            ? "secondary"
                            : lead.status === "Calificado"
                            ? "default"
                            : lead.status === "Contactado"
                            ? "outline"
                            : "default"
                        }
                        data-testid={`badge-status-${lead.id}`}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium" data-testid={`text-score-${lead.id}`}>
                          {lead.score}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${lead.id}`}>
                      {new Date(lead.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-actions-${lead.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lead)} data-testid={`button-edit-${lead.id}`}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(lead)}
                            data-testid={`button-delete-${lead.id}`}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar lead</DialogTitle>
            <DialogDescription>Actualiza la información del lead</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={onEditSubmit} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+34 612 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Landing page, Campaña email, etc." {...field} />
                    </FormControl>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nuevo">Nuevo</SelectItem>
                        <SelectItem value="Calificado">Calificado</SelectItem>
                        <SelectItem value="Contactado">Contactado</SelectItem>
                        <SelectItem value="Convertido">Convertido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (0-100)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El lead será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedLead && deleteMutation.mutate(selectedLead.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Leads;
