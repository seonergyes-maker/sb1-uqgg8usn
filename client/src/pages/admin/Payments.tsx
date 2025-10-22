import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import { MoreHorizontal, DollarSign, CheckCircle, Clock, XCircle, Download, Filter, FileText, CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { Payment } from "@shared/schema";

type PaymentWithClient = Payment & { clientName: string };

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  // Fetch payments with filters
  const { data: payments = [], isLoading } = useQuery<PaymentWithClient[]>({
    queryKey: ['/api/payments', { paymentMethod: filterMethod, paymentStatus: filterStatus, search: searchTerm }],
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Payment> }) => {
      return await apiRequest(`/api/payments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    },
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/payments/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      toast.success("Pago eliminado correctamente");
    },
  });

  const stats = {
    total: payments.reduce((sum, p) => p.paymentStatus === "completed" ? sum + parseFloat(p.amount) : sum, 0),
    completed: payments.filter(p => p.paymentStatus === "completed").length,
    pending: payments.filter(p => p.paymentStatus === "pending").length,
    failed: payments.filter(p => p.paymentStatus === "failed").length,
  };

  const handleRefund = () => {
    if (selectedPayment) {
      updatePaymentMutation.mutate({
        id: selectedPayment,
        data: { paymentStatus: "refunded" }
      }, {
        onSuccess: () => {
          toast.success("Reembolso procesado correctamente");
          setRefundDialogOpen(false);
          setSelectedPayment(null);
        }
      });
    }
  };

  const handleRetry = (id: number) => {
    updatePaymentMutation.mutate({
      id,
      data: { paymentStatus: "completed" }
    }, {
      onSuccess: () => {
        toast.success("Pago procesado correctamente");
      }
    });
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Cliente", "Monto", "Moneda", "Estado", "Método", "Fecha", "ID Transacción"],
      ...payments.map(p => [
        p.id,
        p.clientName,
        p.amount,
        p.currency,
        p.paymentStatus,
        p.paymentMethod,
        new Date(p.createdAt).toLocaleDateString(),
        p.transactionId || ""
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

  const handleDownloadInvoice = (id: number) => {
    toast.success(`Generando factura para pago #${id}`);
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
      refunded: { variant: "outline", label: "Reembolsado", icon: XCircle },
    };
    const { variant, label, icon: Icon } = config[status] || config["pending"];
    return (
      <Badge variant={variant} className="gap-1" data-testid={`badge-status-${status}`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      stripe: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      paypal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return (
      <Badge variant="outline" className={colors[method.toLowerCase()] || ""} data-testid={`badge-method-${method.toLowerCase()}`}>
        <CreditCard className="h-3 w-3 mr-1" />
        {method}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pagos</h2>
          <p className="text-muted-foreground">
            Historial de transacciones y facturación
          </p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Cargando pagos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pagos</h2>
          <p className="text-muted-foreground">
            Historial de transacciones y facturación
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} data-testid="button-export">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border" data-testid="card-total-monthly">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total procesado
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-amount">
              €{stats.total.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pagos completados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-completed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-count">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-pending">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-count">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-failed">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fallidos
            </CardTitle>
            <div className="bg-destructive/10 p-2 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-failed-count">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>
            {payments.length} pago{payments.length !== 1 ? "s" : ""} encontrado{payments.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por cliente o ID transacción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              data-testid="input-search"
            />
            <Button variant="outline" onClick={() => setFilterDialogOpen(true)} data-testid="button-filters">
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
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>ID Transacción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead className="w-[70px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                      <TableCell className="font-mono text-sm">#{payment.id}</TableCell>
                      <TableCell className="font-medium">{payment.clientName}</TableCell>
                      <TableCell className="font-semibold">{payment.currency} {parseFloat(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                      <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {payment.transactionId || "—"}
                      </TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payment.paymentStatus === "completed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment.id)}
                            data-testid={`button-invoice-${payment.id}`}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${payment.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info(`Detalles del pago #${payment.id}`)}>
                              Ver detalles
                            </DropdownMenuItem>
                            {payment.paymentStatus === "completed" && (
                              <DropdownMenuItem onClick={() => handleDownloadInvoice(payment.id)}>
                                Descargar factura
                              </DropdownMenuItem>
                            )}
                            {payment.paymentStatus === "failed" && (
                              <DropdownMenuItem onClick={() => handleRetry(payment.id)}>
                                Reintentar pago
                              </DropdownMenuItem>
                            )}
                            {payment.paymentStatus === "completed" && (
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
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger data-testid="select-method">
                  <SelectValue placeholder="Todos los métodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
              Limpiar filtros
            </Button>
            <Button variant="hero" onClick={applyFilters} data-testid="button-apply-filters">
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
            <AlertDialogCancel data-testid="button-cancel-refund">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRefund} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-refund"
            >
              Reembolsar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Payments;
