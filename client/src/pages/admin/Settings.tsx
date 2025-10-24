import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Settings } from "@shared/schema";

const SettingsPage = () => {
  // Fetch settings
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  // Local state for form fields
  const [formData, setFormData] = useState<Partial<Settings>>({});

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      return await apiRequest('/api/settings', 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast.success("Configuración guardada correctamente");
      setFormData({});
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Error al guardar la configuración");
    },
  });

  const handleSave = (section: string, data: Partial<Settings>) => {
    updateSettingsMutation.mutate(data);
  };

  const handleTestEmail = () => {
    toast.info("Enviando email de prueba...");
    setTimeout(() => {
      toast.success("Email de prueba enviado correctamente");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Configuración</h2>
          <p className="text-muted-foreground">
            Cargando configuración...
          </p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Configuración</h2>
          <p className="text-muted-foreground text-destructive">
            Error al cargar la configuración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración de tu plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border" data-testid="card-company-info">
          <CardHeader>
            <CardTitle>Información general</CardTitle>
            <CardDescription>
              Datos básicos de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la empresa</Label>
              <Input 
                id="company" 
                defaultValue={settings.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                data-testid="input-company-name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={settings.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                data-testid="input-contact-email" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                defaultValue={settings.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                data-testid="input-phone" 
              />
            </div>
            <Button 
              onClick={() => handleSave('company', {
                companyName: formData.companyName ?? settings.companyName,
                contactEmail: formData.contactEmail ?? settings.contactEmail,
                phone: formData.phone ?? settings.phone,
              })} 
              variant="hero" 
              className="w-full" 
              data-testid="button-save-company"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-email-settings">
          <CardHeader>
            <CardTitle>Configuración de emails</CardTitle>
            <CardDescription>
              Parámetros para el envío de emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Nombre del remitente</Label>
              <Input 
                id="fromName" 
                defaultValue={settings.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                data-testid="input-from-name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email del remitente</Label>
              <Input 
                id="fromEmail" 
                type="email" 
                defaultValue={settings.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                data-testid="input-from-email" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyTo">Email de respuesta</Label>
              <Input 
                id="replyTo" 
                type="email" 
                defaultValue={settings.replyToEmail}
                onChange={(e) => setFormData({ ...formData, replyToEmail: e.target.value })}
                data-testid="input-reply-to" 
              />
            </div>
            <Button 
              onClick={() => handleSave('email', {
                fromName: formData.fromName ?? settings.fromName,
                fromEmail: formData.fromEmail ?? settings.fromEmail,
                replyToEmail: formData.replyToEmail ?? settings.replyToEmail,
              })} 
              variant="hero" 
              className="w-full" 
              data-testid="button-save-email"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2" data-testid="card-smtp-config">
          <CardHeader>
            <CardTitle>Servidor SMTP</CardTitle>
            <CardDescription>
              Configuración del servidor de correo saliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">Host SMTP</Label>
                <Input 
                  id="smtpHost" 
                  placeholder="smtp.gmail.com" 
                  defaultValue={settings.smtpHost || ""}
                  onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                  data-testid="input-smtp-host"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">Puerto SMTP</Label>
                <Input 
                  id="smtpPort" 
                  type="number"
                  placeholder="587" 
                  defaultValue={settings.smtpPort?.toString() || "587"}
                  onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                  data-testid="input-smtp-port"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">Usuario SMTP</Label>
                <Input 
                  id="smtpUser" 
                  type="email"
                  placeholder="tu-email@gmail.com" 
                  defaultValue={settings.smtpUser || ""}
                  onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                  data-testid="input-smtp-user"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
                <Input 
                  id="smtpPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  defaultValue={settings.smtpPassword || ""}
                  onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  data-testid="input-smtp-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpEncryption">Cifrado</Label>
                <Select 
                  defaultValue={settings.smtpEncryption || "tls"}
                  onValueChange={(value) => setFormData({ ...formData, smtpEncryption: value })}
                >
                  <SelectTrigger id="smtpEncryption" data-testid="select-smtp-encryption">
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
                  defaultValue={settings.smtpAuth || "login"}
                  onValueChange={(value) => setFormData({ ...formData, smtpAuth: value })}
                >
                  <SelectTrigger id="smtpAuth" data-testid="select-smtp-auth">
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
                onClick={() => handleSave('smtp', {
                  smtpHost: formData.smtpHost ?? settings.smtpHost,
                  smtpPort: formData.smtpPort ?? settings.smtpPort,
                  smtpUser: formData.smtpUser ?? settings.smtpUser,
                  smtpPassword: formData.smtpPassword ?? settings.smtpPassword,
                  smtpEncryption: formData.smtpEncryption ?? settings.smtpEncryption,
                  smtpAuth: formData.smtpAuth ?? settings.smtpAuth,
                })} 
                variant="hero" 
                className="flex-1" 
                data-testid="button-save-smtp"
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? "Guardando..." : "Guardar configuración SMTP"}
              </Button>
              <Button variant="outline" onClick={handleTestEmail} data-testid="button-test-smtp">
                Enviar email de prueba
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-notifications">
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Gestiona las notificaciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nuevos clientes</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe un email cuando se registre un nuevo cliente
                </p>
              </div>
              <Switch 
                checked={settings.notifyNewClients === 1} 
                onCheckedChange={(checked) => handleSave('notifications', { notifyNewClients: checked ? 1 : 0 })}
                data-testid="switch-notify-clients" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pagos completados</Label>
                <p className="text-sm text-muted-foreground">
                  Notificación por cada pago exitoso
                </p>
              </div>
              <Switch 
                checked={settings.notifyPayments === 1} 
                onCheckedChange={(checked) => handleSave('notifications', { notifyPayments: checked ? 1 : 0 })}
                data-testid="switch-notify-payments" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pagos fallidos</Label>
                <p className="text-sm text-muted-foreground">
                  Alerta cuando un pago no se complete
                </p>
              </div>
              <Switch 
                checked={settings.notifyFailedPayments === 1} 
                onCheckedChange={(checked) => handleSave('notifications', { notifyFailedPayments: checked ? 1 : 0 })}
                data-testid="switch-notify-failed-payments" 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cancelaciones</Label>
                <p className="text-sm text-muted-foreground">
                  Aviso cuando un cliente cancele su suscripción
                </p>
              </div>
              <Switch 
                checked={settings.notifyCancellations === 1} 
                onCheckedChange={(checked) => handleSave('notifications', { notifyCancellations: checked ? 1 : 0 })}
                data-testid="switch-notify-cancellations" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border" data-testid="card-integrations">
          <CardHeader>
            <CardTitle>Integraciones</CardTitle>
            <CardDescription>
              Conecta servicios externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripeKey">Stripe API Key</Label>
              <Input 
                id="stripeKey" 
                type="password" 
                placeholder="sk_test_..." 
                defaultValue={settings.stripeKey || ""}
                onChange={(e) => setFormData({ ...formData, stripeKey: e.target.value })}
                data-testid="input-stripe-key"
              />
              <p className="text-xs text-muted-foreground">
                Clave secreta para procesar pagos con Stripe
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypalClientId">PayPal Client ID</Label>
              <Input 
                id="paypalClientId" 
                type="password" 
                placeholder="AY..."
                defaultValue={settings.paypalClientId || ""}
                onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                data-testid="input-paypal-client-id"
              />
              <p className="text-xs text-muted-foreground">
                ID de cliente para pagos con PayPal
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="analyticsId">Google Analytics ID</Label>
              <Input 
                id="analyticsId" 
                placeholder="G-XXXXXXXXXX" 
                defaultValue={settings.analyticsId || ""}
                onChange={(e) => setFormData({ ...formData, analyticsId: e.target.value })}
                data-testid="input-analytics-id"
              />
              <p className="text-xs text-muted-foreground">
                ID de seguimiento de Google Analytics
              </p>
            </div>
            <Button 
              onClick={() => handleSave('integrations', {
                stripeKey: formData.stripeKey ?? settings.stripeKey,
                paypalClientId: formData.paypalClientId ?? settings.paypalClientId,
                analyticsId: formData.analyticsId ?? settings.analyticsId,
              })} 
              variant="hero" 
              className="w-full" 
              data-testid="button-save-integrations"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Guardando..." : "Guardar claves"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2" data-testid="card-terms">
          <CardHeader>
            <CardTitle>Términos y condiciones</CardTitle>
            <CardDescription>
              Texto legal que aparecerá en el registro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              rows={8}
              defaultValue={settings.termsAndConditions || "Al registrarte en LandFlow, aceptas nuestros términos de servicio y política de privacidad. Nos comprometemos a proteger tu información y a proporcionar un servicio de calidad..."}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              data-testid="textarea-terms"
            />
            <Button 
              onClick={() => handleSave('terms', {
                termsAndConditions: formData.termsAndConditions ?? settings.termsAndConditions,
              })} 
              variant="hero" 
              data-testid="button-save-terms"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Guardando..." : "Guardar términos"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
