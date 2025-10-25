import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreVertical, Pencil, Trash2, Mail } from "lucide-react";
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
import { insertEmailSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Email {
  id: number;
  clientId: number;
  name: string;
  subject: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface Automation {
  id: number;
  clientId: number;
  name: string;
  status: string;
  actions: string;
}

const Emails = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const clientId = user?.id || 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Fetch emails
  const { data: emails, isLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails", clientId, { type: typeFilter, search: searchQuery }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/emails/${clientId}?${params}`).then((res) => res.json());
    },
  });

  // Fetch automations to count email usage
  const { data: automations = [] } = useQuery<Automation[]>({
    queryKey: ["/api/automations", clientId],
  });

  // Create form schema (simplified - only name and subject)
  const createFormSchema = z.object({
    clientId: z.number(),
    name: z.string().min(1, "El nombre es requerido"),
    subject: z.string().min(1, "El asunto es requerido"),
    type: z.string().default("email"),
  });
  type CreateFormData = z.infer<typeof createFormSchema>;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateFormData) =>
      apiRequest("/api/emails", "POST", data),
    onSuccess: (newEmail: Email) => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails", clientId] });
      toast({
        title: "Plantilla creada",
        description: "Redirigiendo al editor visual...",
      });
      setCreateDialogOpen(false);
      createForm.reset({
        clientId: clientId,
        name: "",
        subject: "",
        type: "email",
      });
      
      // Redirect to email editor
      setLocation(`/panel/emails/${newEmail.id}/edit`);
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear plantilla",
        description: error?.message || "No se pudo crear la plantilla de email.",
        variant: "destructive",
      });
    },
  });

  // Update mutation (for editing name and subject only)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Email> }) =>
      apiRequest(`/api/emails/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails", clientId] });
      toast({
        title: "Plantilla actualizada",
        description: "La plantilla se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedEmail(null);
    },
  });

  // Check if email is used in active automations
  const isEmailUsedInActiveAutomations = (emailId: number): boolean => {
    return automations.some(automation => {
      if (automation.status !== "Activa") return false;
      
      try {
        const actions = JSON.parse(automation.actions);
        return Array.isArray(actions) && actions.some(
          (action: any) => action.type === "send_email" && action.emailId === emailId
        );
      } catch {
        return false;
      }
    });
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      // Validate that email is not used in active automations
      if (isEmailUsedInActiveAutomations(id)) {
        throw new Error("No puedes eliminar una plantilla que está siendo usada en automatizaciones activas. Pausa primero las automatizaciones que la usan.");
      }
      return apiRequest(`/api/emails/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails", clientId] });
      toast({
        title: "Plantilla eliminada",
        description: "La plantilla se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedEmail(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error?.message || "No se pudo eliminar la plantilla.",
        variant: "destructive",
      });
    },
  });

  
  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      subject: "",
      type: "email",
    },
  });

  // Edit form (only for name and subject)
  const editFormSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    subject: z.string().min(1, "El asunto es requerido"),
  });
  type EditFormData = z.infer<typeof editFormSchema>;
  
  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      subject: "",
    },
  });

  // Calculate statistics
  const totalEmails = emails?.length || 0;
  
  // Count emails used in active automations
  const emailsUsedInAutomations = automations
    .filter(a => a.status === "Activa")
    .reduce((count, automation) => {
      try {
        const actions = JSON.parse(automation.actions);
        const hasEmailAction = Array.isArray(actions) && actions.some(
          (action: any) => action.type === "send_email" && action.emailId
        );
        return count + (hasEmailAction ? 1 : 0);
      } catch {
        return count;
      }
    }, 0);

  // Group emails by type
  const emailsByType = emails?.reduce((acc, email) => {
    const type = email.type || "Otro";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const mostUsedType = Object.entries(emailsByType).sort((a, b) => b[1] - a[1])[0];

  const handleEdit = (email: Email) => {
    setSelectedEmail(email);
    editForm.reset({
      name: email.name,
      subject: email.subject,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (email: Email) => {
    setSelectedEmail(email);
    setDeleteDialogOpen(true);
  };

  const handleCardClick = (email: Email) => {
    setLocation(`/panel/emails/${email.id}/edit`);
  };

  const onCreateSubmit = (data: CreateFormData) => {
    const emailData = {
      ...data,
      clientId,
      type: "email",
      // Content will be set by backend using default template
    };
    
    createMutation.mutate(emailData as any);
  };

  const onEditSubmit = (data: EditFormData) => {
    if (selectedEmail) {
      updateMutation.mutate({ id: selectedEmail.id, data });
    }
  };

  const isEmailNew = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "email": "default",
      "newsletter": "secondary",
      "promotional": "outline",
      "transactional": "outline",
    };
    return <Badge variant={variants[type] || "secondary"} data-testid={`badge-type-${type.toLowerCase()}`}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Plantillas de Email</h2>
          <p className="text-muted-foreground">
            Crea y gestiona tus plantillas de email para automatizaciones
          </p>
        </div>
        <Button variant="hero" onClick={() => setCreateDialogOpen(true)} data-testid="button-create-email">
          <Plus className="mr-2 h-4 w-4" />
          Nueva plantilla
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total Plantillas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-emails">{totalEmails}</p>
            <p className="text-xs text-muted-foreground mt-1">Creadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Usadas en Automatizaciones</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-emails-in-automations">{emailsUsedInAutomations}</p>
            <p className="text-xs text-muted-foreground mt-1">Automatizaciones activas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tipos de Plantilla</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-template-types">{Object.keys(emailsByType).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Categorías diferentes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tipo Más Usado</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-most-used-type">{mostUsedType?.[1] || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{mostUsedType?.[0] || "N/A"}</p>
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
                placeholder="Buscar plantillas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-type-filter">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="promotional">Promocional</SelectItem>
                <SelectItem value="transactional">Transaccional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando plantillas...</div>
          ) : !emails || emails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay plantillas. ¡Crea tu primera plantilla de email!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emails.map((email) => (
                <Card 
                  key={email.id} 
                  className="border-border hover:border-primary/50 transition-colors cursor-pointer" 
                  onClick={() => handleCardClick(email)}
                  data-testid={`card-email-${email.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{email.name}</CardTitle>
                        <div className="flex gap-2 items-center">
                          {getTypeBadge(email.type)}
                          {email.createdAt && isEmailNew(email.createdAt) && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">New</Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-menu-${email.id}`} onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(email);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar contenido
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(email);
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Editar nombre/asunto
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(email);
                            }}
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
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Asunto:</p>
                        <p className="truncate">{email.subject}</p>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Creado {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true, locale: es })}
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
          createForm.reset({
            clientId: clientId,
            name: "",
            subject: "",
            type: "email",
          });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Plantilla de Email</DialogTitle>
            <DialogDescription>
              Ingresa el nombre y asunto. Después serás redirigido al editor visual para diseñar el contenido.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la plantilla</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Email de bienvenida" {...field} data-testid="input-name" />
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
                    <FormLabel>Asunto del email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: ¡Bienvenido a nuestra comunidad!" {...field} data-testid="input-subject" />
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
                  data-testid="button-save"
                >
                  {createMutation.isPending ? "Creando..." : "Crear y editar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog (only name and subject) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plantilla</DialogTitle>
            <DialogDescription>
              Actualiza el nombre y asunto de la plantilla. Para editar el contenido HTML, usa el editor visual.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la plantilla</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-name" />
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
                    <FormLabel>Asunto del email</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-edit-subject" />
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
                  data-testid="button-edit-save"
                >
                  {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La plantilla será eliminada permanentemente.
              {selectedEmail && ` "${selectedEmail.name}" será eliminada.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-delete-cancel">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedEmail && deleteMutation.mutate(selectedEmail.id)}
              data-testid="button-delete-confirm"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Emails;
