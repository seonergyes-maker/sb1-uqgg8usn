import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, MoreVertical } from "lucide-react";
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

const payments = [
  {
    id: "PAY-1234",
    client: "María García",
    email: "maria@empresa.com",
    amount: "€99.00",
    plan: "Growth",
    status: "Completado",
    method: "Tarjeta ****4242",
    date: "15 Feb 2024",
    invoice: "INV-001234"
  },
  {
    id: "PAY-1233",
    client: "Ana López",
    email: "ana@business.com",
    amount: "€199.00",
    plan: "Scale",
    status: "Completado",
    method: "Tarjeta ****5555",
    date: "14 Feb 2024",
    invoice: "INV-001233"
  },
  {
    id: "PAY-1232",
    client: "Laura Fernández",
    email: "laura@marketing.es",
    amount: "€49.00",
    plan: "Essential",
    status: "Completado",
    method: "Tarjeta ****6789",
    date: "14 Feb 2024",
    invoice: "INV-001232"
  },
  {
    id: "PAY-1231",
    client: "Carlos Ruiz",
    email: "carlos@tech.io",
    amount: "€99.00",
    plan: "Growth",
    status: "Pendiente",
    method: "Tarjeta ****1111",
    date: "13 Feb 2024",
    invoice: "-"
  },
  {
    id: "PAY-1230",
    client: "Juan Martínez",
    email: "juan@startup.es",
    amount: "€49.00",
    plan: "Essential",
    status: "Completado",
    method: "Tarjeta ****8888",
    date: "12 Feb 2024",
    invoice: "INV-001230"
  },
  {
    id: "PAY-1229",
    client: "Pedro Sánchez",
    email: "pedro@ecommerce.com",
    amount: "€199.00",
    plan: "Scale",
    status: "Fallido",
    method: "Tarjeta ****9999",
    date: "10 Feb 2024",
    invoice: "-"
  }
];

const Payments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pagos</h2>
          <p className="text-muted-foreground">
            Historial y gestión de todos los pagos
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total este mes</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">€18,450</p>
            <p className="text-xs text-green-500 mt-1">+15.3% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Completados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">186</p>
            <p className="text-xs text-muted-foreground mt-1">De 198 totales</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Pendientes</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground mt-1">€792 en proceso</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Fallidos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-destructive mt-1">€398 no cobrados</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, ID o factura..."
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
                <TableHead>ID Pago</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.client}</p>
                      <p className="text-sm text-muted-foreground">{payment.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === "Completado" ? "default" : 
                        payment.status === "Pendiente" ? "secondary" : 
                        "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {payment.method}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                  <TableCell>
                    {payment.invoice !== "-" ? (
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        {payment.invoice}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Descargar factura</DropdownMenuItem>
                        <DropdownMenuItem>Enviar recibo</DropdownMenuItem>
                        {payment.status === "Fallido" && (
                          <DropdownMenuItem>Reintentar pago</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Reembolsar
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

export default Payments;
