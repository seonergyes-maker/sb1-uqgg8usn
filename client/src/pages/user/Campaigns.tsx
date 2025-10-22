import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Mail, MoreVertical, Send, Pencil, Trash2 } from "lucide-react";
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
import { insertCampaignSchema, type Campaign } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

const Campaigns = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Por ahora usamos clientId = 1 como demo
  const clientId = 1;

  // Fetch campaigns
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns", clientId, statusFilter, searchQuery],
    queryFn: () => {
      const params = new URLSearchParams({
        clientId: clientId.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      return fetch(`/api/campaigns?${params}`).then((res) => res.json());
    },
  });

  // Create form
  const createForm = useForm<z.infer<typeof insertCampaignSchema>>({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      subject: "",
      content: "",
      status: "Borrador",
      recipientCount: 0,
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof insertCampaignSchema>>({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      clientId: clientId,
      name: "",
      subject: "",
      content: "",
      status: "Borrador",
      recipientCount: 0,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertCampaignSchema>) => {
      return await apiRequest("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", clientId] });
      toast({
        title: "Campaña creada",
        description: "La campaña se ha creado correctamente.",
      });
      setCreateDialogOpen(false);
      createForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la campaña.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Campaign> }) => {
      return await apiRequest(`/api/campaigns/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", clientId] });
      toast({
        title: "Campaña actualizada",
        description: "La campaña se ha actualizado correctamente.",
      });
      setEditDialogOpen(false);
      setSelectedCampaign(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la campaña.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/campaigns/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", clientId] });
      toast({
        title: "Campaña eliminada",
        description: "La campaña se ha eliminado correctamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedCampaign(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la campaña.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    editForm.reset({
      clientId: campaign.clientId,
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.status,
      recipientCount: campaign.recipientCount,
      scheduledAt: campaign.scheduledAt ? format(new Date(campaign.scheduledAt), "yyyy-MM-dd'T'HH:mm") : undefined,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const onCreateSubmit = (data: z.infer<typeof insertCampaignSchema>) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof insertCampaignSchema>) => {
    if (!selectedCampaign) return;
    updateMutation.mutate({
      id: selectedCampaign.id,
      updates: data,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Enviada":
        return <Badge variant="default" className="bg-green-600">Enviada</Badge>;
      case "Programada":
        return <Badge variant="default" className="bg-blue-600">Programada</Badge>;
      case "Borrador":
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate statistics
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === "Enviada").length;
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipientCount, 0);
  const avgOpenRate = campaigns.filter(c => c.openRate).length > 0
    ? (campaigns.reduce((sum, c) => sum + Number(c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Campañas</h2>
          <p className="text-muted-foreground">
            Crea y gestiona tus campañas de email marketing
          </p>
        </div>
        <Button 
          variant="hero" 
          onClick={() => setCreateDialogOpen(true)}
          data-testid="button-create-campaign"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva campaña
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total campañas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-campaigns">{totalCampaigns}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Campañas enviadas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-sent-campaigns">{sentCampaigns}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total destinatarios</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-total-recipients">{totalRecipients.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tasa apertura promedio</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary" data-testid="text-avg-open-rate">{avgOpenRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar campañas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Borrador">Borrador</SelectItem>
            <SelectItem value="Programada">Programada</SelectItem>
            <SelectItem value="Enviada">Enviada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Campañas de email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando campañas...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay campañas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primera campaña de email marketing
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera campaña
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Destinatarios</TableHead>
                  <TableHead>Tasa apertura</TableHead>
                  <TableHead>Tasa clics</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} data-testid={`row-campaign-${campaign.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{campaign.recipientCount.toLocaleString()}</TableCell>
                    <TableCell>
                      {campaign.openRate ? `${campaign.openRate}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {campaign.clickRate ? `${campaign.clickRate}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {campaign.sentAt 
                        ? format(new Date(campaign.sentAt), "dd/MM/yyyy")
                        : campaign.scheduledAt
                          ? `Prog. ${format(new Date(campaign.scheduledAt), "dd/MM/yyyy")}`
                          : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-menu-${campaign.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(campaign)} data-testid={`button-edit-${campaign.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(campaign)}
                            data-testid={`button-delete-${campaign.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear campaña</DialogTitle>
            <DialogDescription>
              Crea una nueva campaña de email marketing
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la campaña</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Newsletter Marzo 2024" data-testid="input-name" />
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
                      <Input {...field} placeholder="Ej: Novedades de este mes" data-testid="input-subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido del email</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Escribe el contenido de tu email..."
                        rows={6}
                        data-testid="input-content"
                      />
                    </FormControl>
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
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="Programada">Programada</SelectItem>
                        <SelectItem value="Enviada">Enviada</SelectItem>
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
                  {createMutation.isPending ? "Creando..." : "Crear campaña"}
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
            <DialogTitle>Editar campaña</DialogTitle>
            <DialogDescription>
              Modifica la información de la campaña
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la campaña</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Newsletter Marzo 2024" data-testid="input-edit-name" />
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
                      <Input {...field} placeholder="Ej: Novedades de este mes" data-testid="input-edit-subject" />
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
                    <FormLabel>Contenido del email</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Escribe el contenido de tu email..."
                        rows={6}
                        data-testid="input-edit-content"
                      />
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
                        <SelectTrigger data-testid="select-edit-status">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                        <SelectItem value="Programada">Programada</SelectItem>
                        <SelectItem value="Enviada">Enviada</SelectItem>
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
            <DialogTitle>¿Eliminar campaña?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La campaña "{selectedCampaign?.name}" será eliminada permanentemente.
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
              onClick={() => selectedCampaign && deleteMutation.mutate(selectedCampaign.id)}
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

export default Campaigns;
