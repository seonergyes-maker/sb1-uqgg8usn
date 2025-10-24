import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Plus, Search, MoreVertical, Edit, Trash2, Send, Mail, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";

interface Email {
  id: number;
  clientId: number;
  subject: string;
  content: string;
  type: string;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
  createdAt: string;
}

export default function Emails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const clientId = user?.id || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [deleteEmailId, setDeleteEmailId] = useState<number | null>(null);

  const [newEmail, setNewEmail] = useState({
    subject: "",
    content: "",
    type: "newsletter",
  });

  const { data: emails = [], isLoading } = useQuery<Email[]>({
    queryKey: ["/api/emails", clientId, statusFilter],
    enabled: !!clientId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newEmail) => {
      return apiRequest(`/api/emails`, "POST", {
        ...data,
        clientId,
        status: "Borrador",
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      setIsCreateDialogOpen(false);
      setNewEmail({ subject: "", content: "", type: "newsletter" });
      toast({
        title: "Email creado",
        description: "El email se ha creado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el email",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Email>) => {
      return apiRequest(`/api/emails/${data.id}`, "PATCH", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      setIsEditDialogOpen(false);
      setSelectedEmail(null);
      toast({
        title: "Email actualizado",
        description: "El email se ha actualizado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el email",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/emails/${id}`, "DELETE", null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      setDeleteEmailId(null);
      toast({
        title: "Email eliminado",
        description: "El email se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el email",
        variant: "destructive",
      });
    },
  });

  const filteredEmails = emails.filter((email: Email) => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;
    const matchesType = typeFilter === "all" || email.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: emails.length,
    borradores: emails.filter((e: Email) => e.status === "Borrador").length,
    programados: emails.filter((e: Email) => e.status === "Programado").length,
    enviados: emails.filter((e: Email) => e.status === "Enviado").length,
    totalOpens: emails.reduce((sum: number, e: Email) => sum + (e.opens || 0), 0),
    totalClicks: emails.reduce((sum: number, e: Email) => sum + (e.clicks || 0), 0),
  };

  const handleEdit = (email: Email) => {
    setSelectedEmail(email);
    setIsEditDialogOpen(true);
  };

  const handleSendEmail = async (emailId: number) => {
    try {
      await updateMutation.mutateAsync({ 
        id: emailId, 
        status: "Enviado",
        sentAt: new Date().toISOString()
      });
      toast({
        title: "Email enviado",
        description: "El email se ha enviado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el email",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Borrador":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "Programado":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Enviado":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Fallido":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emails</h1>
        <p className="text-muted-foreground">
          Gestiona tus campañas de email marketing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borradores}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aperturas</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpens}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Create Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-emails"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Borrador">Borrador</SelectItem>
              <SelectItem value="Programado">Programado</SelectItem>
              <SelectItem value="Enviado">Enviado</SelectItem>
              <SelectItem value="Fallido">Fallido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="promotional">Promocional</SelectItem>
              <SelectItem value="transactional">Transaccional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-email">
              <Plus className="mr-2 h-4 w-4" />
              Crear Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Email</DialogTitle>
              <DialogDescription>
                Crea un nuevo email para tu campaña
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                  placeholder="Asunto del email"
                  data-testid="input-subject"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newEmail.type}
                  onValueChange={(value) => setNewEmail({ ...newEmail, type: value })}
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promocional</SelectItem>
                    <SelectItem value="transactional">Transaccional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={newEmail.content}
                  onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                  placeholder="Contenido del email (HTML permitido)"
                  rows={10}
                  data-testid="textarea-content"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => createMutation.mutate(newEmail)}
                disabled={createMutation.isPending}
                data-testid="button-save"
              >
                Crear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Emails List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Cargando emails...</p>
            </CardContent>
          </Card>
        ) : filteredEmails.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No se encontraron emails. Crea tu primer email para comenzar.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEmails.map((email: Email) => (
            <Card key={email.id} data-testid={`card-email-${email.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(email.status)}
                      <CardTitle className="text-lg">{email.subject}</CardTitle>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                        {email.type}
                      </span>
                    </div>
                    <CardDescription className="mt-2">
                      Creado {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true, locale: es })}
                      {email.sentAt && ` • Enviado ${formatDistanceToNow(new Date(email.sentAt), { addSuffix: true, locale: es })}`}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${email.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {email.status === "Borrador" && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendEmail(email.id);
                          }}
                          data-testid={`button-send-${email.id}`}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Enviar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(email);
                        }}
                        data-testid={`button-edit-${email.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteEmailId(email.id);
                        }}
                        className="text-destructive"
                        data-testid={`button-delete-${email.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{email.opens}</p>
                    <p className="text-xs text-muted-foreground">Aperturas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{email.clicks}</p>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{email.bounces}</p>
                    <p className="text-xs text-muted-foreground">Rebotes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{email.unsubscribes}</p>
                    <p className="text-xs text-muted-foreground">Bajas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Email</DialogTitle>
            <DialogDescription>
              Actualiza la información del email
            </DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-subject">Asunto</Label>
                <Input
                  id="edit-subject"
                  value={selectedEmail.subject}
                  onChange={(e) => setSelectedEmail({ ...selectedEmail, subject: e.target.value })}
                  data-testid="input-edit-subject"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Tipo</Label>
                <Select
                  value={selectedEmail.type}
                  onValueChange={(value) => setSelectedEmail({ ...selectedEmail, type: value })}
                >
                  <SelectTrigger data-testid="select-edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promocional</SelectItem>
                    <SelectItem value="transactional">Transaccional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-content">Contenido</Label>
                <Textarea
                  id="edit-content"
                  value={selectedEmail.content}
                  onChange={(e) => setSelectedEmail({ ...selectedEmail, content: e.target.value })}
                  rows={10}
                  data-testid="textarea-edit-content"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              data-testid="button-edit-cancel"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => selectedEmail && updateMutation.mutate(selectedEmail)}
              disabled={updateMutation.isPending}
              data-testid="button-edit-save"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEmailId} onOpenChange={() => setDeleteEmailId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El email será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-delete-cancel">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEmailId && deleteMutation.mutate(deleteEmailId)}
              data-testid="button-delete-confirm"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
