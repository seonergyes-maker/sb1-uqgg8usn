import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, Calendar, AlertCircle, Loader2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Subscription {
  id: number;
  clientId: number;
  plan: string;
  status: string;
  startDate: string;
  endDate: string | null;
  paypalSubscriptionId: string | null;
  paypalPlanId: string | null;
  billingCycleAnchor: string | null;
  lastBillingDate: string | null;
  paypalDetails?: any;
}

interface UsageData {
  plan: string;
  limits: {
    maxContacts: number;
    maxEmailsPerMonth: number;
    maxLandingPages: number;
    maxAutomations: number;
    customDomainAllowed: number;
    prioritySupport: number;
  };
  usage: {
    contactsCount: number;
    emailsSent: number;
    landingsCount: number;
    automationsCount: number;
  };
}

interface Payment {
  id: number;
  clientId: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId: string | null;
  paypalOrderId: string | null;
  createdAt: string;
}

interface PlanFeature {
  name: string;
  price: number;
  features: {
    contacts: string;
    emails: string;
    landings: string;
    automations: string;
    customDomain: boolean;
    prioritySupport: boolean;
  };
}

const PLANS: Record<string, PlanFeature> = {
  "Starter": {
    name: "Starter",
    price: 9,
    features: {
      contacts: "500 contactos",
      emails: "1,000 emails/mes",
      landings: "2 landing pages",
      automations: "1 automatización",
      customDomain: false,
      prioritySupport: false,
    }
  },
  "Essential": {
    name: "Essential",
    price: 29,
    features: {
      contacts: "2,000 contactos",
      emails: "5,000 emails/mes",
      landings: "10 landing pages",
      automations: "5 automatizaciones",
      customDomain: false,
      prioritySupport: false,
    }
  },
  "Professional": {
    name: "Professional",
    price: 79,
    features: {
      contacts: "10,000 contactos",
      emails: "25,000 emails/mes",
      landings: "50 landing pages",
      automations: "20 automatizaciones",
      customDomain: false,
      prioritySupport: true,
    }
  },
  "Business": {
    name: "Business",
    price: 199,
    features: {
      contacts: "Contactos ilimitados",
      emails: "100,000 emails/mes",
      landings: "Landing pages ilimitadas",
      automations: "Automatizaciones ilimitadas",
      customDomain: true,
      prioritySupport: true,
    }
  }
};

const Billing = () => {
  const { toast } = useToast();
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery<Subscription>({
    queryKey: ["/api/user/subscription"],
  });

  const { data: usageData, isLoading: isLoadingUsage } = useQuery<UsageData>({
    queryKey: ["/api/user/subscription/usage"],
  });

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/user/payments"],
  });

  const changePlanMutation = useMutation({
    mutationFn: async (newPlan: string) => {
      return await apiRequest("/api/user/subscription/change-plan", "POST", { newPlan });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription/usage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Plan cambiado",
        description: `Has cambiado exitosamente al plan ${data.newPlan}.`,
      });
      setShowChangePlanDialog(false);
      setSelectedPlan(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al cambiar de plan",
        description: error.message || "No se pudo cambiar el plan.",
      });
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/user/subscription/cancel", "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payments"] });
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción ha sido cancelada exitosamente.",
      });
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error al cancelar",
        description: error.message || "No se pudo cancelar la suscripción.",
      });
    }
  });

  const calculatePercentage = (current: number, max: number) => {
    if (max === -1) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const formatLimit = (value: number) => {
    if (value === -1) return "Ilimitado";
    return value.toLocaleString("es-ES");
  };

  const handleChangePlan = (planName: string) => {
    changePlanMutation.mutate(planName);
  };

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };

  if (subscriptionError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Pagos y Facturación</h2>
          <p className="text-muted-foreground">
            Gestiona tu suscripción y métodos de pago
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se encontró una suscripción activa. Contacta al administrador para activar tu plan.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
              {isLoadingSubscription ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <Badge className="text-base px-4 py-1" data-testid="badge-current-plan">
                  {subscription?.plan || "N/A"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingSubscription || isLoadingUsage ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precio mensual</p>
                    <p className="text-3xl font-bold" data-testid="text-monthly-price">
                      €{PLANS[subscription?.plan || "Starter"]?.price || 0}
                      <span className="text-lg font-normal text-muted-foreground">/mes</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Próxima facturación</p>
                    <p className="text-lg font-semibold flex items-center gap-2" data-testid="text-next-billing">
                      <Calendar className="h-4 w-4" />
                      {subscription?.billingCycleAnchor 
                        ? format(new Date(subscription.billingCycleAnchor), "dd MMM yyyy", { locale: es })
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  {/* Contactos */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Contactos activos</span>
                      <span className="font-medium" data-testid="text-contacts-usage">
                        {usageData?.usage.contactsCount.toLocaleString("es-ES") || 0} / {formatLimit(usageData?.limits.maxContacts || 0)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${calculatePercentage(usageData?.usage.contactsCount || 0, usageData?.limits.maxContacts || 1)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Emails enviados este mes</span>
                      <span className="font-medium" data-testid="text-emails-usage">
                        {usageData?.usage.emailsSent.toLocaleString("es-ES") || 0} / {formatLimit(usageData?.limits.maxEmailsPerMonth || 0)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${calculatePercentage(usageData?.usage.emailsSent || 0, usageData?.limits.maxEmailsPerMonth || 1)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Landing Pages */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Landing pages activas</span>
                      <span className="font-medium" data-testid="text-landings-usage">
                        {usageData?.usage.landingsCount || 0} / {formatLimit(usageData?.limits.maxLandingPages || 0)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${calculatePercentage(usageData?.usage.landingsCount || 0, usageData?.limits.maxLandingPages || 1)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Automatizaciones */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Automatizaciones activas</span>
                      <span className="font-medium" data-testid="text-automations-usage">
                        {usageData?.usage.automationsCount || 0} / {formatLimit(usageData?.limits.maxAutomations || 0)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${calculatePercentage(usageData?.usage.automationsCount || 0, usageData?.limits.maxAutomations || 1)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="hero" 
                    className="flex-1" 
                    onClick={() => setShowChangePlanDialog(true)}
                    data-testid="button-change-plan"
                  >
                    Cambiar de plan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCancelDialog(true)}
                    data-testid="button-cancel-subscription"
                  >
                    Cancelar suscripción
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Método de pago</CardTitle>
            <CardDescription>
              Gestión vía PayPal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSubscription ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription?.status === "active" ? "Activo" : "Inactivo"}
                    </p>
                    {subscription?.paypalSubscriptionId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {subscription.paypalSubscriptionId.slice(0, 12)}...
                      </p>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    Los pagos se procesan de forma segura a través de PayPal. Puedes gestionar tu método de pago directamente desde tu cuenta de PayPal.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de pagos</CardTitle>
              <CardDescription>
                Tus transacciones recientes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPayments ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay pagos registrados todavía</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>ID Transacción</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell data-testid={`text-payment-date-${payment.id}`}>
                      {format(new Date(payment.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="font-mono text-sm" data-testid={`text-payment-id-${payment.id}`}>
                      {payment.transactionId?.slice(0, 16) || payment.paypalOrderId?.slice(0, 16) || "N/A"}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold" data-testid={`text-payment-amount-${payment.id}`}>
                      €{payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={payment.status === "completed" ? "default" : "secondary"}
                        data-testid={`badge-payment-status-${payment.id}`}
                      >
                        {payment.status === "completed" ? "Completado" : payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={showChangePlanDialog} onOpenChange={setShowChangePlanDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cambiar de plan</DialogTitle>
            <DialogDescription>
              Selecciona el plan que mejor se adapte a tus necesidades
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {Object.values(PLANS).map((plan) => {
              const isCurrentPlan = subscription?.plan === plan.name;
              return (
                <Card 
                  key={plan.name} 
                  className={`border-2 transition-all ${isCurrentPlan ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {isCurrentPlan && (
                        <Badge variant="default">Actual</Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold">
                      €{plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/mes</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{plan.features.contacts}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{plan.features.emails}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{plan.features.landings}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{plan.features.automations}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features.customDomain ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.features.customDomain ? "text-muted-foreground" : ""}>
                          Dominio personalizado
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features.prioritySupport ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={!plan.features.prioritySupport ? "text-muted-foreground" : ""}>
                          Soporte prioritario
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={isCurrentPlan ? "outline" : "default"}
                      className="w-full mt-4"
                      disabled={isCurrentPlan}
                      onClick={() => handleChangePlan(plan.name)}
                      data-testid={`button-select-plan-${plan.name}`}
                    >
                      {isCurrentPlan ? "Plan actual" : "Seleccionar plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              El cambio de plan se procesará a través de PayPal. Se te redirigirá para completar el proceso de pago de forma segura.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowChangePlanDialog(false)}
              data-testid="button-close-change-plan-dialog"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar suscripción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará tu suscripción activa. Podrás seguir usando el servicio hasta el final del período de facturación actual, pero no se te cobrará en el próximo ciclo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-cancel-dialog">
              No, mantener suscripción
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={cancelSubscriptionMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-cancel-subscription"
            >
              {cancelSubscriptionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sí, cancelar suscripción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Billing;
