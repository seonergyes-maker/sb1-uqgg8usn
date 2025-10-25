import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSegmentSchema, type Segment } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const Segments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.id || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  // Fetch segments
  const { data: segments = [], isLoading } = useQuery<Segment[]>({
    queryKey: ["/api/segments", clientId, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        clientId: clientId.toString(),
      });
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/segments?${params}`).then((res) => res.json());
    },
  });

  // Create form
  const createForm = useForm<z.infer<typeof insertSegmentSchema>>({
    resolver: zodResolver(insertSegmentSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      description: "",
      filters: "{}",
      leadCount: 0,
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof insertSegmentSchema>>({
    resolver: zodResolver(insertSegmentSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      description: "",
      filters: "{}",
      leadCount: 0,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertSegmentSchema>) => {
      return await apiRequest("/api/segments", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments", clientId] });
      toast({
        title: "Segmento creado",
        description: "El segmento se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el segmento.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Segment> }) => {
      return await apiRequest(`/api/segments/${data.id}`, "PATCH", data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments", clientId] });
      toast({
        title: "Segmento actualizado",
        description: "El segmento se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedSegment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el segmento.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/segments/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/segments", clientId] });
      toast({
        title: "Segmento eliminado",
        description: "El segmento se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedSegment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el segmento.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (segment: Segment) => {
    setSelectedSegment(segment);
    editForm.reset({
      clientId: segment.clientId,
      name: segment.name,
      description: segment.description || "",
      filters: segment.filters,
      leadCount: segment.leadCount,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (segment: Segment) => {
    setSelectedSegment(segment);
    setDeleteDialogOpen(true);
  };

  const onCreateSubmit = (data: z.infer<typeof insertSegmentSchema>) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof insertSegmentSchema>) => {
    if (!selectedSegment) return;
    updateMutation.mutate({
      id: selectedSegment.id,
      updates: data,
    });
  };

  const totalSegments = segments.length;
  const totalLeadsInSegments = segments.reduce((sum, seg) => sum + seg.leadCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Segmentos</h2>
          <p className="text-muted-foreground">
            Organiza tus leads en grupos personalizados
          </p>
        </div>
        <Button 
          variant="hero" 
          onClick={() => setCreateDialogOpen(true)}
          data-testid="button-create-segment"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear segmento
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total segmentos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-segments">{totalSegments}</p>
            <p className="text-xs text-muted-foreground mt-1">{totalSegments} activos</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Leads segmentados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-leads">{totalLeadsInSegments}</p>
            <p className="text-xs text-muted-foreground mt-1">Leads en segmentos</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Promedio por segmento</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-avg-leads">
              {totalSegments > 0 ? Math.round(totalLeadsInSegments / totalSegments) : 0}
            </p>
            <p className="text-xs text-primary mt-1">Leads promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar segmentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Segments Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando segmentos...</p>
        </div>
      ) : segments.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay segmentos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crea tu primer segmento para organizar tus leads
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear primer segmento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <Card 
              key={segment.id} 
              className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
              data-testid={`card-segment-${segment.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                      {segment.isSystem === 1 && (
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-system-${segment.id}`}>
                          Sistema
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm mt-1">
                      {segment.description || "Sin descripción"}
                    </CardDescription>
                  </div>
                  {segment.isSystem !== 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${segment.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(segment)} data-testid={`button-edit-${segment.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(segment)}
                          data-testid={`button-delete-${segment.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Contactos</span>
                    </div>
                    <span className="text-2xl font-bold" data-testid={`text-count-${segment.id}`}>
                      {segment.leadCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border text-xs text-muted-foreground">
                    Actualizado: {format(new Date(segment.updatedAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-border bg-gradient-subtle">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">¿Cómo funcionan los segmentos?</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Los segmentos te permiten agrupar automáticamente tus leads según reglas que definas. 
                Puedes crear campañas específicas para cada segmento y mejorar la personalización.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear segmento</DialogTitle>
            <DialogDescription>
              Crea un nuevo segmento para organizar tus leads
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del segmento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Leads de alta calidad" data-testid="input-name" />
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
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe las características de este segmento"
                        data-testid="input-description"
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
                  {createMutation.isPending ? "Creando..." : "Crear segmento"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar segmento</DialogTitle>
            <DialogDescription>
              Modifica la información del segmento
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del segmento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Leads de alta calidad" data-testid="input-edit-name" />
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
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe las características de este segmento"
                        data-testid="input-edit-description"
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
            <DialogTitle>¿Eliminar segmento?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El segmento "{selectedSegment?.name}" será eliminado permanentemente.
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
              onClick={() => selectedSegment && deleteMutation.mutate(selectedSegment.id)}
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

export default Segments;
