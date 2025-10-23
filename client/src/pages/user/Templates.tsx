import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTemplateSchema } from "@shared/schema";
import { z } from "zod";
import { Search, Mail, FileText, Eye, Copy, Star, Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

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

const Templates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.id || 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Fetch templates
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates", clientId, { type: typeFilter, category: categoryFilter, status: statusFilter, search: searchQuery }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/templates/${clientId}?${params}`).then((res) => res.json());
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertTemplateSchema>) =>
      apiRequest("/api/templates", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", clientId] });
      toast({
        title: "Plantilla creada",
        description: "La plantilla se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Template> }) =>
      apiRequest(`/api/templates/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", clientId] });
      toast({
        title: "Plantilla actualizada",
        description: "La plantilla se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedTemplate(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/templates/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", clientId] });
      toast({
        title: "Plantilla eliminada",
        description: "La plantilla se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    },
  });

  // Create form
  const createForm = useForm<z.infer<typeof insertTemplateSchema>>({
    resolver: zodResolver(insertTemplateSchema),
    defaultValues: {
      clientId,
      name: "",
      description: "",
      type: "Email",
      category: "",
      subject: "",
      content: "",
      variables: "[]",
      thumbnail: "",
      status: "Activa",
      timesUsed: 0,
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof insertTemplateSchema>>({
    resolver: zodResolver(insertTemplateSchema),
  });

  // Filter templates by type
  const emailTemplates = templates?.filter(t => t.type === "Email") || [];
  const landingTemplates = templates?.filter(t => t.type === "Landing") || [];

  // Calculate statistics
  const totalTemplates = templates?.length || 0;
  const activeTemplates = templates?.filter(t => t.status === "Activa").length || 0;
  const totalUses = templates?.reduce((sum, t) => sum + t.timesUsed, 0) || 0;
  const mostUsedTemplate = templates?.sort((a, b) => b.timesUsed - a.timesUsed)[0];

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    editForm.reset({
      clientId: template.clientId,
      name: template.name,
      description: template.description || "",
      type: template.type,
      category: template.category,
      subject: template.subject || "",
      content: template.content,
      variables: template.variables || "[]",
      thumbnail: template.thumbnail || "",
      status: template.status,
      timesUsed: template.timesUsed,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const onCreateSubmit = (data: z.infer<typeof insertTemplateSchema>) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof insertTemplateSchema>) => {
    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data });
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Promocional": "default",
      "Informativo": "secondary",
      "Transaccional": "outline",
      "Newsletter": "default",
      "SaaS": "secondary",
      "E-commerce": "outline",
    };
    return variants[category] || "secondary";
  };

  const renderTemplateCard = (template: Template) => (
    <Card key={template.id} className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
          {template.thumbnail ? (
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {template.type === "Email" ? (
                <Mail className="h-16 w-16 text-muted-foreground" />
              ) : (
                <FileText className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => handlePreview(template)}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge variant={getCategoryBadge(template.category)} className="text-xs mt-1">
                {template.category}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid={`button-menu-${template.id}`}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(template)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(template)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {template.description && (
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Copy className="h-3 w-3" />
              <span>{template.timesUsed.toLocaleString()} usos</span>
            </div>
            <Badge variant={template.status === "Activa" ? "default" : "secondary"} className="text-xs">
              {template.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plantillas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona plantillas profesionales para emails y landing pages
          </p>
        </div>
        <Button variant="hero" onClick={() => setCreateDialogOpen(true)} data-testid="button-create-template">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total Plantillas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-templates">{totalTemplates}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeTemplates} activas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Plantillas Email</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-email-templates">{emailTemplates.length}</p>
            <p className="text-xs text-muted-foreground mt-1">De {totalTemplates} totales</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Plantillas Landing</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-landing-templates">{landingTemplates.length}</p>
            <p className="text-xs text-muted-foreground mt-1">De {totalTemplates} totales</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total Usos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-uses">{totalUses.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {mostUsedTemplate?.name || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emails" className="space-y-6">
        <TabsList>
          <TabsTrigger value="emails" className="gap-2" data-testid="tab-emails">
            <Mail className="h-4 w-4" />
            Plantillas Email
          </TabsTrigger>
          <TabsTrigger value="landings" className="gap-2" data-testid="tab-landings">
            <FileText className="h-4 w-4" />
            Plantillas Landing
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Promocional">Promocional</SelectItem>
                  <SelectItem value="Informativo">Informativo</SelectItem>
                  <SelectItem value="Transaccional">Transaccional</SelectItem>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]" data-testid="select-status">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="emails" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando plantillas...</div>
          ) : emailTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay plantillas de email. ¡Crea tu primera plantilla!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailTemplates.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="landings" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando plantillas...</div>
          ) : landingTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay plantillas de landing page. ¡Crea tu primera plantilla!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingTemplates.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Plantilla</DialogTitle>
            <DialogDescription>
              Completa los detalles de tu nueva plantilla
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Newsletter Semanal" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category-create">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Promocional">Promocional</SelectItem>
                          <SelectItem value="Informativo">Informativo</SelectItem>
                          <SelectItem value="Transaccional">Transaccional</SelectItem>
                          <SelectItem value="Newsletter">Newsletter</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
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
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Activa">Activa</SelectItem>
                          <SelectItem value="Inactiva">Inactiva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Breve descripción de la plantilla..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto (solo para emails)</FormLabel>
                    <FormControl>
                      <Input placeholder="¡Nueva oferta especial!" {...field} />
                    </FormControl>
                    <FormDescription>
                      Puedes usar variables como {`{{nombre}}`}, {`{{empresa}}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido (HTML)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='<div>Tu contenido HTML aquí...</div>'
                        rows={8}
                        {...field}
                        data-testid="input-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de imagen de vista previa (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
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
                  {createMutation.isPending ? "Creando..." : "Crear Plantilla"}
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
            <DialogTitle>Editar Plantilla</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu plantilla
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Promocional">Promocional</SelectItem>
                          <SelectItem value="Informativo">Informativo</SelectItem>
                          <SelectItem value="Transaccional">Transaccional</SelectItem>
                          <SelectItem value="Newsletter">Newsletter</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Activa">Activa</SelectItem>
                          <SelectItem value="Inactiva">Inactiva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto (solo para emails)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Contenido (HTML)</FormLabel>
                    <FormControl>
                      <Textarea rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de imagen de vista previa (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente "{selectedTemplate?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedTemplate && deleteMutation.mutate(selectedTemplate.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-900 min-h-[400px]">
            {selectedTemplate?.subject && (
              <div className="mb-4 pb-4 border-b">
                <span className="font-semibold">Asunto: </span>
                {selectedTemplate.subject}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content || "" }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
