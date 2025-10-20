import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MoreVertical } from "lucide-react";
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

const clients = [
  {
    id: "1",
    name: "María García",
    email: "maria@empresa.com",
    plan: "Growth",
    status: "Activo",
    contacts: "2,450",
    emails: "15,200",
    registered: "15 Ene 2024"
  },
  {
    id: "2",
    name: "Juan Martínez",
    email: "juan@startup.es",
    plan: "Essential",
    status: "Activo",
    contacts: "850",
    emails: "3,200",
    registered: "20 Ene 2024"
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana@business.com",
    plan: "Scale",
    status: "Activo",
    contacts: "8,500",
    emails: "42,000",
    registered: "03 Feb 2024"
  },
  {
    id: "4",
    name: "Carlos Ruiz",
    email: "carlos@tech.io",
    plan: "Growth",
    status: "Prueba",
    contacts: "1,200",
    emails: "5,800",
    registered: "10 Feb 2024"
  },
  {
    id: "5",
    name: "Laura Fernández",
    email: "laura@marketing.es",
    plan: "Essential",
    status: "Activo",
    contacts: "600",
    emails: "2,100",
    registered: "14 Feb 2024"
  },
  {
    id: "6",
    name: "Pedro Sánchez",
    email: "pedro@ecommerce.com",
    plan: "Scale",
    status: "Pausado",
    contacts: "12,000",
    emails: "58,000",
    registered: "28 Dic 2023"
  }
];

const Clients = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Clientes</h2>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos tus clientes
          </p>
        </div>
        <Button variant="hero">
          <Mail className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nombre o email..."
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
                <TableHead>Cliente</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contactos</TableHead>
                <TableHead>Emails enviados</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {client.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        client.status === "Activo" ? "default" : 
                        client.status === "Prueba" ? "secondary" : 
                        "outline"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{client.contacts}</TableCell>
                  <TableCell className="text-muted-foreground">{client.emails}</TableCell>
                  <TableCell className="text-muted-foreground">{client.registered}</TableCell>
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
                        <DropdownMenuItem>Enviar email</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Suspender
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

export default Clients;
