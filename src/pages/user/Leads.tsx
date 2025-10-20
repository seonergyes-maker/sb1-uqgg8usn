import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, MoreVertical } from "lucide-react";
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

const leads = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612 345 678",
    source: "Landing Black Friday",
    status: "Nuevo",
    score: 85,
    date: "15 Feb 2024"
  },
  {
    id: "2",
    name: "Juan Martínez",
    email: "juan.martinez@empresa.com",
    phone: "+34 623 456 789",
    source: "Campaña email",
    status: "Calificado",
    score: 92,
    date: "14 Feb 2024"
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana.lopez@startup.es",
    phone: "+34 634 567 890",
    source: "Formulario contacto",
    status: "Contactado",
    score: 78,
    date: "13 Feb 2024"
  },
  {
    id: "4",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@tech.io",
    phone: "+34 645 678 901",
    source: "Landing webinar",
    status: "Nuevo",
    score: 68,
    date: "12 Feb 2024"
  },
  {
    id: "5",
    name: "Laura Fernández",
    email: "laura.f@marketing.es",
    phone: "+34 656 789 012",
    source: "Campaña email",
    status: "Convertido",
    score: 95,
    date: "11 Feb 2024"
  }
];

const Leads = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Leads</h2>
          <p className="text-muted-foreground">
            Gestiona todos tus contactos y leads
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="hero">
            <Plus className="mr-2 h-4 w-4" />
            Añadir lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total leads</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,458</p>
            <p className="text-xs text-primary mt-1">+12.5% este mes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Calificados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">486</p>
            <p className="text-xs text-muted-foreground mt-1">19.8% del total</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Convertidos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">186</p>
            <p className="text-xs text-green-500 mt-1">7.6% conversión</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Score promedio</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">78</p>
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
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{lead.email}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.source}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        lead.status === "Nuevo" ? "secondary" : 
                        lead.status === "Calificado" ? "default" :
                        lead.status === "Contactado" ? "outline" :
                        "default"
                      }
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
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Añadir a segmento</DropdownMenuItem>
                        <DropdownMenuItem>Enviar email</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
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
    </div>
  );
};

export default Leads;
