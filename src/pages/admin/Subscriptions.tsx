import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical } from "lucide-react";
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

const subscriptions = [
  {
    id: "SUB-001",
    client: "María García",
    email: "maria@empresa.com",
    plan: "Growth",
    price: "€99/mes",
    status: "Activa",
    startDate: "15 Ene 2024",
    nextBilling: "15 Mar 2024"
  },
  {
    id: "SUB-002",
    client: "Juan Martínez",
    email: "juan@startup.es",
    plan: "Essential",
    price: "€49/mes",
    status: "Activa",
    startDate: "20 Ene 2024",
    nextBilling: "20 Mar 2024"
  },
  {
    id: "SUB-003",
    client: "Ana López",
    email: "ana@business.com",
    plan: "Scale",
    price: "€199/mes",
    status: "Activa",
    startDate: "03 Feb 2024",
    nextBilling: "03 Mar 2024"
  },
  {
    id: "SUB-004",
    client: "Carlos Ruiz",
    email: "carlos@tech.io",
    plan: "Growth",
    price: "€99/mes",
    status: "Prueba",
    startDate: "10 Feb 2024",
    nextBilling: "24 Feb 2024"
  },
  {
    id: "SUB-005",
    client: "Laura Fernández",
    email: "laura@marketing.es",
    plan: "Essential",
    price: "€49/mes",
    status: "Activa",
    startDate: "14 Feb 2024",
    nextBilling: "14 Mar 2024"
  },
  {
    id: "SUB-006",
    client: "Pedro Sánchez",
    email: "pedro@ecommerce.com",
    plan: "Scale",
    price: "€199/mes",
    status: "Cancelada",
    startDate: "28 Dic 2023",
    nextBilling: "-"
  }
];

const Subscriptions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Suscripciones</h2>
        <p className="text-muted-foreground">
          Administra todas las suscripciones activas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Activas</span>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">186</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€18,450/mes</p>
            <p className="text-xs text-muted-foreground mt-1">Ingresos recurrentes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">En prueba</span>
              <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">24</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€2,376/mes</p>
            <p className="text-xs text-muted-foreground mt-1">Potencial ingresos</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Canceladas</span>
              <Badge variant="outline">38</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15.3%</p>
            <p className="text-xs text-muted-foreground mt-1">Tasa de cancelación</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o ID..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Próxima factura</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-sm">{sub.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.client}</p>
                      <p className="text-sm text-muted-foreground">{sub.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{sub.price}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        sub.status === "Activa" ? "default" : 
                        sub.status === "Prueba" ? "secondary" : 
                        "outline"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sub.startDate}</TableCell>
                  <TableCell className="text-muted-foreground">{sub.nextBilling}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Cambiar plan</DropdownMenuItem>
                        <DropdownMenuItem>Pausar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancelar
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

export default Subscriptions;
