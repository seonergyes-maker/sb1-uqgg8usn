import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, MoreVertical, ExternalLink, Copy, Pencil, Trash2, FileText } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { insertLandingSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TemplateSelector } from "@/components/TemplateSelector";

interface Template {
  id: number;
  clientId: number;
  name: string;
  description: string | null;
  type: string;
  category: string;
  subject: string | null;
  content: string;
  variables: string | null;
  thumbnail: string | null;
  status: string;
  timesUsed: number;
  createdAt: string;
  updatedAt: string;
}

interface Landing {
  id: number;
  clientId: number;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  content: string;
  status: string;
  publishedAt: string | null;
  views: number;
  conversions: number;
  conversionRate: string;
  createdAt: string;
  updatedAt: string;
}

const Landings = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const clientId = user?.id || 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLanding, setSelectedLanding] = useState<Landing | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  // Fetch landings
  const { data: landings, isLoading } = useQuery<Landing[]>({
    queryKey: ["/api/landings", clientId, { status: statusFilter, search: searchQuery }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/landings/${clientId}?${params}`).then((res) => res.json());
    },
  });

  // Fetch base templates
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates/base", { type: "Landing" }],
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertLandingSchema>) =>
      apiRequest("/api/landings", "POST", data),
    onSuccess: (newLanding: Landing) => {
      queryClient.invalidateQueries({ queryKey: ["/api/landings", clientId] });
      toast({
        title: "Landing creada",
        description: "Redirigiendo a tu nueva landing...",
      });
      setCreateDialogOpen(false);
      createForm.reset({
        clientId: clientId,
        name: "",
        slug: "",
      });
      setSelectedTemplateId(null);
      
      // Redirect to public landing page for editing
      setLocation(`/l/${newLanding.slug}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Landing> }) =>
      apiRequest(`/api/landings/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landings", clientId] });
      toast({
        title: "Landing actualizada",
        description: "La landing page se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedLanding(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/landings/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landings", clientId] });
      toast({
        title: "Landing eliminada",
        description: "La landing page se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedLanding(null);
    },
  });

  // Create form
  const createForm = useForm<z.infer<typeof insertLandingSchema>>({
    resolver: zodResolver(insertLandingSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      slug: "",
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof insertLandingSchema>>({
    resolver: zodResolver(insertLandingSchema),
  });

  // Handle template selection
  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      createForm.setValue("content", template.content);
    }
  };

  // Calculate statistics
  const totalLandings = landings?.length || 0;
  const publishedLandings = landings?.filter(l => l.status === "Publicada").length || 0;
  const totalViews = landings?.reduce((sum, l) => sum + l.views, 0) || 0;
  const totalConversions = landings?.reduce((sum, l) => sum + l.conversions, 0) || 0;
  const avgConversionRate = publishedLandings > 0
    ? (landings?.filter(l => l.status === "Publicada").reduce((sum, l) => sum + parseFloat(l.conversionRate), 0) || 0) / publishedLandings
    : 0;
  const bestLanding = landings?.filter(l => l.status === "Publicada").sort((a, b) => parseFloat(b.conversionRate) - parseFloat(a.conversionRate))[0];

  const handleCopyUrl = (landing: Landing) => {
    const url = `https://${landing.slug}.landflow.app`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: "La URL se ha copiado al portapapeles.",
    });
  };

  const handleEdit = (landing: Landing) => {
    setSelectedLanding(landing);
    editForm.reset({
      clientId: landing.clientId,
      name: landing.name,
      slug: landing.slug,
      title: landing.title || "",
      description: landing.description || "",
      content: landing.content,
      status: landing.status,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (landing: Landing) => {
    setSelectedLanding(landing);
    setDeleteDialogOpen(true);
  };

  const onCreateSubmit = (data: z.infer<typeof insertLandingSchema>) => {
    console.log("onCreateSubmit called with data:", data);
    console.log("clientId:", clientId);
    console.log("Form errors:", createForm.formState.errors);
    createMutation.mutate({ ...data, clientId });
  };

  const onEditSubmit = (data: z.infer<typeof insertLandingSchema>) => {
    if (selectedLanding) {
      updateMutation.mutate({ id: selectedLanding.id, data });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Publicada": "default",
      "Borrador": "secondary",
      "Programada": "outline",
    };
    return <Badge variant={variants[status] || "default"} data-testid={`badge-status-${status.toLowerCase()}`}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Landing Pages</h2>
          <p className="text-muted-foreground">
            Crea y gestiona tus páginas de captura
          </p>
        </div>
        <Button variant="hero" onClick={() => setCreateDialogOpen(true)} data-testid="button-create-landing">
          <Plus className="mr-2 h-4 w-4" />
          Nueva landing
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total Landings</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-landings">{totalLandings}</p>
            <p className="text-xs text-muted-foreground mt-1">{publishedLandings} publicadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Visitas Totales</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-views">{totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">De {publishedLandings} landings publicadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Conversiones</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-conversions">{totalConversions.toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-1">{avgConversionRate.toFixed(2)}% tasa promedio</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Mejor Tasa</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-best-conversion">{bestLanding ? bestLanding.conversionRate : "0.00"}%</p>
            <p className="text-xs text-muted-foreground mt-1">{bestLanding?.name || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar landings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Publicada">Publicada</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Programada">Programada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando landings...</div>
          ) : !landings || landings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay landings. ¡Crea tu primera landing page!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landings.map((landing) => (
                <Card key={landing.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{landing.name}</CardTitle>
                        {getStatusBadge(landing.status)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-menu-${landing.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(landing)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyUrl(landing)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar URL
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver landing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(landing)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        <span className="truncate">{landing.slug}.landflow.app</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Visitas</p>
                          <p className="text-sm font-semibold">{landing.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversiones</p>
                          <p className="text-sm font-semibold">{landing.conversions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tasa</p>
                          <p className="text-sm font-semibold text-primary">{landing.conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) {
          setSelectedTemplateId(null);
          createForm.reset({
            clientId: clientId,
            name: "",
            slug: "",
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Landing Page</DialogTitle>
            <DialogDescription>
              Completa los detalles de tu nueva landing page
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la landing</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Promoción Black Friday" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la landing</FormLabel>
                    <FormControl>
                      <Input placeholder="promocion-black-friday" {...field} data-testid="input-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                  {createMutation.isPending ? "Creando..." : "Crear Landing"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Landing Page</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu landing page
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título SEO</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Descripción SEO</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido (JSON/HTML)</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} />
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
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="Publicada">Publicada</SelectItem>
                        <SelectItem value="Programada">Programada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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
            <AlertDialogTitle>¿Eliminar landing page?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente "{selectedLanding?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedLanding && deleteMutation.mutate(selectedLanding.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Landings;
