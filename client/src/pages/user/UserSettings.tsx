import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Lock } from "lucide-react";

interface UserSettings {
  fromName: string | null;
  fromEmail: string | null;
  replyTo: string | null;
  emailSignature: string | null;
  notifyNewLeads: number;
  notifyCampaigns: number;
  notifyWeekly: number;
  notifyTips: number;
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
  customDomain: string | null;
  domainVerified: number;
  plan: string;
}

const settingsSchema = z.object({
  fromName: z.string().optional().nullable(),
  fromEmail: z.string().email("Email inválido").optional().or(z.literal("")).nullable(),
  replyTo: z.string().email("Email de respuesta inválido").optional().or(z.literal("")).nullable(),
  emailSignature: z.string().optional().nullable(),
  notifyNewLeads: z.number().min(0).max(1),
  notifyCampaigns: z.number().min(0).max(1),
  notifyWeekly: z.number().min(0).max(1),
  notifyTips: z.number().min(0).max(1),
  googleAnalyticsId: z.string().optional().or(z.literal("")).nullable(),
  metaPixelId: z.string().optional().or(z.literal("")).nullable(),
  customDomain: z.string().optional().or(z.literal("")).nullable(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const UserSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const clientId = user?.id || 0;

  // Fetch user settings
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/user-settings", clientId],
    queryFn: () => apiRequest(`/api/user-settings/${clientId}`),
    enabled: !!clientId,
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fromName: "",
      fromEmail: "",
      replyTo: "",
      emailSignature: "",
      notifyNewLeads: 1,
      notifyCampaigns: 1,
      notifyWeekly: 1,
      notifyTips: 0,
      googleAnalyticsId: "",
      metaPixelId: "",
      customDomain: "",
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        fromName: settings.fromName || "",
        fromEmail: settings.fromEmail || "",
        replyTo: settings.replyTo || "",
        emailSignature: settings.emailSignature || "",
        notifyNewLeads: settings.notifyNewLeads,
        notifyCampaigns: settings.notifyCampaigns,
        notifyWeekly: settings.notifyWeekly,
        notifyTips: settings.notifyTips,
        googleAnalyticsId: settings.googleAnalyticsId || "",
        metaPixelId: settings.metaPixelId || "",
        customDomain: settings.customDomain || "",
      });
    }
  }, [settings, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: SettingsFormData) =>
      apiRequest(`/api/user-settings/${clientId}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-settings", clientId] });
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al guardar",
        description: error?.message || "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  const isBusiness = settings?.plan === "Business";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
        <p className="text-muted-foreground">
          Personaliza tu experiencia en LandFlow
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Configuration */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Configuración de emails</CardTitle>
              <CardDescription>
                Personaliza cómo aparecen tus emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">Nombre del remitente</Label>
                <Input
                  id="fromName"
                  data-testid="input-fromName"
                  {...form.register("fromName")}
                  placeholder="Tu Empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">Email del remitente</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  data-testid="input-fromEmail"
                  {...form.register("fromEmail")}
                  placeholder="noreply@tuempresa.com"
                />
                {form.formState.errors.fromEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.fromEmail.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Email de respuesta</Label>
                <Input
                  id="replyTo"
                  type="email"
                  data-testid="input-replyTo"
                  {...form.register("replyTo")}
                  placeholder="soporte@tuempresa.com"
                />
                {form.formState.errors.replyTo && (
                  <p className="text-sm text-red-500">{form.formState.errors.replyTo.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailSignature">Firma de email</Label>
                <Textarea
                  id="emailSignature"
                  rows={4}
                  data-testid="input-emailSignature"
                  {...form.register("emailSignature")}
                  placeholder="Saludos,&#10;El equipo de Tu Empresa"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Gestiona qué notificaciones recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuevos leads</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificación cada vez que captes un nuevo lead
                  </p>
                </div>
                <Switch
                  data-testid="switch-notifyNewLeads"
                  checked={form.watch("notifyNewLeads") === 1}
                  onCheckedChange={(checked) => form.setValue("notifyNewLeads", checked ? 1 : 0)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Campañas enviadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Confirmación cuando una campaña se envíe
                  </p>
                </div>
                <Switch
                  data-testid="switch-notifyCampaigns"
                  checked={form.watch("notifyCampaigns") === 1}
                  onCheckedChange={(checked) => form.setValue("notifyCampaigns", checked ? 1 : 0)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Informes semanales</Label>
                  <p className="text-sm text-muted-foreground">
                    Resumen semanal de tu actividad
                  </p>
                </div>
                <Switch
                  data-testid="switch-notifyWeekly"
                  checked={form.watch("notifyWeekly") === 1}
                  onCheckedChange={(checked) => form.setValue("notifyWeekly", checked ? 1 : 0)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tips y novedades</Label>
                  <p className="text-sm text-muted-foreground">
                    Consejos y nuevas funcionalidades
                  </p>
                </div>
                <Switch
                  data-testid="switch-notifyTips"
                  checked={form.watch("notifyTips") === 1}
                  onCheckedChange={(checked) => form.setValue("notifyTips", checked ? 1 : 0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tracking y Analíticas</CardTitle>
              <CardDescription>
                Conecta tus herramientas de análisis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  data-testid="input-googleAnalyticsId"
                  {...form.register("googleAnalyticsId")}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Se inyectará automáticamente en todas tus landing pages
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
                <Input
                  id="metaPixelId"
                  data-testid="input-metaPixelId"
                  {...form.register("metaPixelId")}
                  placeholder="1234567890"
                />
                <p className="text-xs text-muted-foreground">
                  Se inyectará automáticamente en todas tus landing pages
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>Dominio personalizado</CardTitle>
                  <CardDescription>
                    Usa tu propio dominio para las landings
                  </CardDescription>
                </div>
                {!isBusiness && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Business
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isBusiness ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Tu dominio</Label>
                    <Input
                      id="customDomain"
                      data-testid="input-customDomain"
                      {...form.register("customDomain")}
                      placeholder="miempresa.com"
                    />
                    {settings?.domainVerified === 1 && (
                      <Badge variant="default" className="text-xs">
                        ✓ Dominio verificado
                      </Badge>
                    )}
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">Instrucciones DNS:</p>
                      <ol className="text-sm space-y-1 ml-4 list-decimal">
                        <li>Configura un registro CNAME apuntando a: <code className="bg-secondary px-1 rounded">landflow.app</code></li>
                        <li>O configura un registro A apuntando a nuestra IP</li>
                        <li>Guarda los cambios y espera la propagación DNS (puede tardar hasta 48h)</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    El dominio personalizado está disponible solo para usuarios del plan Business. 
                    Actualiza tu plan para desbloquear esta funcionalidad.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="hero"
            size="lg"
            data-testid="button-save"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
