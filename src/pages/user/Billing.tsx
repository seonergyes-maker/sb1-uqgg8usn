import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, FileText, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    id: "INV-001",
    date: "01 Feb 2024",
    plan: "Growth",
    amount: "€99.00",
    status: "Pagada"
  },
  {
    id: "INV-002",
    date: "01 Ene 2024",
    plan: "Growth",
    amount: "€99.00",
    status: "Pagada"
  },
  {
    id: "INV-003",
    date: "01 Dic 2023",
    plan: "Essential",
    amount: "€49.00",
    status: "Pagada"
  },
  {
    id: "INV-004",
    date: "01 Nov 2023",
    plan: "Essential",
    amount: "€49.00",
    status: "Pagada"
  }
];

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Pagos y Facturación</h2>
        <p className="text-muted-foreground">
          Gestiona tu suscripción y métodos de pago
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Plan actual</CardTitle>
                <CardDescription>
                  Tu suscripción activa
                </CardDescription>
              </div>
              <Badge className="text-base px-4 py-1">Growth</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Precio mensual</p>
                <p className="text-3xl font-bold">€99<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Próxima facturación</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  01 Mar 2024
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contactos activos</span>
                  <span className="font-medium">2,458 / 5,000</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '49.2%' }} />
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Emails enviados este mes</span>
                  <span className="font-medium">15,240 / 20,000</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '76.2%' }} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="hero" className="flex-1">
                Cambiar de plan
              </Button>
              <Button variant="outline" className="flex-1">
                Cancelar suscripción
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Método de pago</CardTitle>
            <CardDescription>
              Tarjeta actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
              <div className="bg-gradient-primary p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expira 12/25</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Actualizar tarjeta
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                También aceptamos
              </p>
              <div className="flex gap-2">
                <div className="w-12 h-8 bg-secondary rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">VISA</span>
                </div>
                <div className="w-12 h-8 bg-secondary rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-12 h-8 bg-secondary rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">AMEX</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de facturas</CardTitle>
              <CardDescription>
                Descarga tus facturas anteriores
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar todo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Información fiscal</CardTitle>
          <CardDescription>
            Datos para tus facturas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre fiscal</p>
              <p className="font-medium">Mi Empresa SL</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">NIF/CIF</p>
              <p className="font-medium">B12345678</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dirección</p>
              <p className="font-medium">Calle Principal 123</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ciudad y CP</p>
              <p className="font-medium">28001 Madrid, España</p>
            </div>
          </div>
          <Button variant="outline">
            Editar información fiscal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
