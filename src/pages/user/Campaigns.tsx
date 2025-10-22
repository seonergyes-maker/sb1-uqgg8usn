import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, MoreVertical, Send, Clock, Filter } from "lucide-react";
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

const campaigns = [
  {
    id: "1",
    name: "Bienvenida nuevos leads",
    subject: "¡Bienvenido a LandFlow! 🚀",
    status: "Enviada",
    sent: "2,458",
    opened: "806",
    clicked: "245",
    date: "15 Feb 2024"
  },
  {
    id: "2",
    name: "Newsletter Febrero",
    subject: "Las mejores prácticas de email marketing",
    status: "Enviada",
    sent: "2,180",
    opened: "715",
    clicked: "198",
    date: "10 Feb 2024"
  },
  {
    id: "3",
    name: "Oferta Black Friday",
    subject: "50% OFF - Solo hoy 🔥",
    status: "Enviada",
    sent: "3,240",
    opened: "1,296",
    clicked: "486",
    date: "24 Nov 2023"
  },
  {
    id: "4",
    name: "Webinar próximo jueves",
    subject: "Te esperamos en nuestro webinar gratuito",
    status: "Programada",
    sent: "-",
    opened: "-",
    clicked: "-",
    date: "20 Feb 2024"
  },
  {
    id: "5",
    name: "Recordatorio abandono",
    subject: "¿Olvidaste algo en tu carrito?",
    status: "Borrador",
    sent: "-",
    opened: "-",
    clicked: "-",
    date: "-"
  }
];

const Campaigns = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (action === "delete") {
      setSelectedCampaign(campaignId);
      setDeleteDialogOpen(true);
    } else {
      toast({
        title: `Acción: ${action}`,
        description: `Acción "${action}" ejecutada para "${campaign?.name}".`,
      });
    }
  };

  const handleDelete = () => {
    toast({
      title: "Campaña eliminada",
      description: "La campaña se ha eliminado correctamente.",
    });
    setDeleteDialogOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Campañas</h2>
          <p className="text-muted-foreground">
            Gestiona tus campañas de email marketing
          </p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Nueva campaña
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Campañas enviadas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">48</p>
            <p className="text-xs text-primary mt-1">Este mes: 12</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Emails enviados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">125,680</p>
            <p className="text-xs text-muted-foreground mt-1">Total histórico</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tasa apertura</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">32.8%</p>
            <p className="text-xs text-green-500 mt-1">+2.1% vs promedio</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tasa de clics</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8.5%</p>
            <p className="text-xs text-green-500 mt-1">+1.3% vs promedio</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campañas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  {statusFilter !== "all" && (
                    <Badge variant="default" className="ml-2">Activos</Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtros avanzados</DialogTitle>
                  <DialogDescription>
                    Filtra las campañas por estado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Enviada">Enviada</SelectItem>
                        <SelectItem value="Programada">Programada</SelectItem>
                        <SelectItem value="Borrador">Borrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStatusFilter("all")}
                    >
                      Limpiar filtros
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => setFilterDialogOpen(false)}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enviados</TableHead>
                <TableHead>Aperturas</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {campaign.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {campaign.subject}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        campaign.status === "Enviada" ? "default" : 
                        campaign.status === "Programada" ? "secondary" : 
                        "outline"
                      }
                    >
                      {campaign.status === "Programada" && <Clock className="mr-1 h-3 w-3" />}
                      {campaign.status === "Enviada" && <Send className="mr-1 h-3 w-3" />}
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{campaign.sent}</TableCell>
                  <TableCell>
                    {campaign.opened !== "-" && (
                      <div className="flex flex-col">
                        <span className="font-medium">{campaign.opened}</span>
                        <span className="text-xs text-muted-foreground">
                          {((parseInt(campaign.opened) / parseInt(campaign.sent)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {campaign.opened === "-" && <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {campaign.clicked !== "-" && (
                      <div className="flex flex-col">
                        <span className="font-medium">{campaign.clicked}</span>
                        <span className="text-xs text-muted-foreground">
                          {((parseInt(campaign.clicked) / parseInt(campaign.sent)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {campaign.clicked === "-" && <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("informe", campaign.id)}>
                          Ver informe
                        </DropdownMenuItem>
                        {campaign.status === "Borrador" && (
                          <>
                            <DropdownMenuItem onClick={() => handleAction("editar", campaign.id)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("enviar", campaign.id)}>
                              Enviar ahora
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("programar", campaign.id)}>
                              Programar
                            </DropdownMenuItem>
                          </>
                        )}
                        {campaign.status === "Programada" && (
                          <DropdownMenuItem onClick={() => handleAction("cancelar", campaign.id)}>
                            Cancelar envío
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleAction("duplicar", campaign.id)}>
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleAction("delete", campaign.id)}
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
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La campaña será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Campaigns;
