import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, DollarSign, CheckCircle, Clock, XCircle, Download, Filter, FileText } from "lucide-react";
import { toast } from "sonner";

const mockPayments = [
  {
    id: "PAY-001",
    client: "María García",
    amount: 99,
    plan: "Growth",
    status: "completed",
    method: "Tarjeta",
    date: "2024-03-15"
  },
  {
    id: "PAY-002",
    client: "Juan Martínez",
    amount: 49,
    plan: "Essential",
    status: "completed",
    method: "PayPal",
    date: "2024-03-14"
  },
  {
    id: "PAY-003",
    client: "Ana López",
    amount: 199,
    plan: "Scale",
    status: "completed",
    method: "Tarjeta",
    date: "2024-03-14"
  },
  {
    id: "PAY-004",
    client: "Carlos Ruiz",
    amount: 99,
    plan: "Growth",
    status: "pending",
    method: "Transferencia",
    date: "2024-03-13"
  },
  {
    id: "PAY-005",
    client: "Laura Sánchez",
    amount: 399,
    plan: "Enterprise",
    status: "completed",
    method: "Tarjeta",
    date: "2024-03-12"
  },
  {
    id: "PAY-006",
    client: "Pedro Fernández",
    amount: 49,
    plan: "Essential",
    status: "failed",
    method: "Tarjeta",
    date: "2024-03-11"
  },
];

const Payments = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod = filterMethod === "all" || payment.method === filterMethod;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: payments.reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0),
    completed: payments.filter(p => p.status === "completed").length,
    pending: payments.filter(p => p.status === "pending").length,
    failed: payments.filter(p => p.status === "failed").length,
  };

  const handleRefund = () => {
    if (selectedPayment) {
      setPayments(payments.map(p => 
        p.id === selectedPayment ? { ...p, status: "failed" } : p
      ));
      toast.success("Reembolso procesado correctamente");
      setRefundDialogOpen(false);
      setSelectedPayment(null);
    }
  };

  const handleRetry = (id: string) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: "completed" } : p
    ));
    toast.success("Pago procesado correctamente");
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Cliente", "Monto", "Plan", "Estado", "Método", "Fecha"],
      ...filteredPayments.map(p => [
        p.id, p.client, p.amount, p.plan, p.status, p.method, p.date
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pagos.csv";
    a.click();
    toast.success("Datos exportados correctamente");
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success(`Descargando factura ${id}`);
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
    toast.success("Filtros aplicados");
  };

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterMethod("all");
    toast.info("Filtros eliminados");
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string, icon: any }> = {
      completed: { variant: "default", label: "Completado", icon: CheckCircle },
      pending: { variant: "secondary", label: "Pendiente", icon: Clock },
      failed: { variant: "destructive", label: "Fallido", icon: XCircle },
    };
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pagos</h2>
          <p className="text-muted-foreground">
            Historial de transacciones y facturación
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total mensual
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary font-medium">+15.3%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fallidos
            </CardTitle>
            <div className="bg-destructive/10 p-2 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>
            {filteredPayments.length} pago{filteredPayments.length !== 1 ? "s" : ""} encontrado{filteredPayments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {(filterStatus !== "all" || filterMethod !== "all") && (
                <Badge variant="default" className="ml-2">
                  {[filterStatus !== "all" ? 1 : 0, filterMethod !== "all" ? 1 : 0].reduce((a, b) => a + b)}
                </Badge>
              )}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.client}</TableCell>
                      <TableCell className="font-semibold">€{payment.amount}</TableCell>
                      <TableCell>{payment.plan}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payment.status === "completed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info("Vista de detalles")}>
                              Ver detalles
                            </DropdownMenuItem>
                            {payment.status === "completed" && (
                              <DropdownMenuItem onClick={() => handleDownloadInvoice(payment.id)}>
                                Descargar factura
                              </DropdownMenuItem>
                            )}
                            {payment.status === "failed" && (
                              <DropdownMenuItem onClick={() => handleRetry(payment.id)}>
                                Reintentar pago
                              </DropdownMenuItem>
                            )}
                            {payment.status === "completed" && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedPayment(payment.id);
                                  setRefundDialogOpen(true);
                                }}
                              >
                                Reembolsar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar pagos</DialogTitle>
            <DialogDescription>
              Aplica filtros para refinar la búsqueda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los métodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
            <Button variant="hero" onClick={applyFilters}>
              Aplicar filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Procesar reembolso?</AlertDialogTitle>
            <AlertDialogDescription>
              El monto será devuelto al cliente y se actualizará el estado del pago. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reembolsar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Payments;
