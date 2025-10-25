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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword: string | null;
  smtpEncryption: string | null;
  smtpAuth: string | null;
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
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpEncryption: z.string().optional().nullable(),
  smtpAuth: z.string().optional().nullable(),
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
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      smtpEncryption: "tls",
      smtpAuth: "login",
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
        smtpHost: settings.smtpHost || "",
        smtpPort: settings.smtpPort || 587,
        smtpUser: settings.smtpUser || "",
        smtpPassword: settings.smtpPassword || "",
        smtpEncryption: settings.smtpEncryption || "tls",
        smtpAuth: settings.smtpAuth || "login",
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

  // Test SMTP mutation
  const testSMTPMutation = useMutation({
    mutationFn: async () => {
      const smtpData = {
        smtpHost: form.watch("smtpHost"),
        smtpPort: form.watch("smtpPort"),
        smtpUser: form.watch("smtpUser"),
        smtpPassword: form.watch("smtpPassword"),
      };
      return await apiRequest(`/api/user-settings/${clientId}/test-smtp`, "POST", smtpData);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Conexión exitosa",
        description: data.message || "La conexión SMTP se verificó correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error de conexión",
        description: error?.error || "No se pudo conectar con el servidor SMTP.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateMutation.mutate(data);
  };

  const handleTestSMTP = () => {
    testSMTPMutation.mutate();
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

          {/* SMTP Configuration */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Servidor SMTP</CardTitle>
              <CardDescription>
                Configura tu servidor de correo saliente para enviar automations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Host SMTP</Label>
                  <Input
                    id="smtpHost"
                    data-testid="input-smtpHost"
                    {...form.register("smtpHost")}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Puerto SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    data-testid="input-smtpPort"
                    {...form.register("smtpPort", { valueAsNumber: true })}
                    placeholder="587"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuario SMTP</Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    data-testid="input-smtpUser"
                    {...form.register("smtpUser")}
                    placeholder="tu-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    data-testid="input-smtpPassword"
                    {...form.register("smtpPassword")}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Cifrado</Label>
                  <Select
                    value={form.watch("smtpEncryption") || "tls"}
                    onValueChange={(value) => form.setValue("smtpEncryption", value)}
                  >
                    <SelectTrigger id="smtpEncryption" data-testid="select-smtpEncryption">
                      <SelectValue placeholder="Selecciona cifrado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpAuth">Autenticación</Label>
                  <Select
                    value={form.watch("smtpAuth") || "login"}
                    onValueChange={(value) => form.setValue("smtpAuth", value)}
                  >
                    <SelectTrigger id="smtpAuth" data-testid="select-smtpAuth">
                      <SelectValue placeholder="Tipo de autenticación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="login">LOGIN</SelectItem>
                      <SelectItem value="plain">PLAIN</SelectItem>
                      <SelectItem value="cram-md5">CRAM-MD5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestSMTP}
                  data-testid="button-test-smtp"
                  disabled={testSMTPMutation.isPending}
                >
                  {testSMTPMutation.isPending ? "Probando..." : "Probar conexión"}
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  data-testid="button-save-smtp"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Guardando..." : "Guardar configuración"}
                </Button>
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
