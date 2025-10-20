import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración de tu plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Información general</CardTitle>
            <CardDescription>
              Datos básicos de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Nombre de la empresa</Label>
              <Input id="company" defaultValue="LandFlow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contacto</Label>
              <Input id="email" type="email" defaultValue="soporte@landflow.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" defaultValue="+34 900 000 000" />
            </div>
            <Button onClick={handleSave} variant="hero" className="w-full">
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Configuración de emails</CardTitle>
            <CardDescription>
              Parámetros para el envío de emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">Nombre del remitente</Label>
              <Input id="fromName" defaultValue="LandFlow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email del remitente</Label>
              <Input id="fromEmail" type="email" defaultValue="noreply@landflow.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyTo">Email de respuesta</Label>
              <Input id="replyTo" type="email" defaultValue="soporte@landflow.com" />
            </div>
            <Button onClick={handleSave} variant="hero" className="w-full">
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pagos completados</Label>
                <p className="text-sm text-muted-foreground">
                  Notificación por cada pago exitoso
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pagos fallidos</Label>
                <p className="text-sm text-muted-foreground">
                  Alerta cuando un pago no se complete
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cancelaciones</Label>
                <p className="text-sm text-muted-foreground">
                  Aviso cuando un cliente cancele su suscripción
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
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
                defaultValue="sk_test_********************"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sendgridKey">SendGrid API Key</Label>
              <Input 
                id="sendgridKey" 
                type="password" 
                placeholder="SG...."
                defaultValue="SG.********************"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analyticsId">Google Analytics ID</Label>
              <Input id="analyticsId" placeholder="G-XXXXXXXXXX" />
            </div>
            <Button onClick={handleSave} variant="hero" className="w-full">
              Guardar claves
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Términos y condiciones</CardTitle>
            <CardDescription>
              Texto legal que aparecerá en el registro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              rows={8}
              defaultValue="Al registrarte en LandFlow, aceptas nuestros términos de servicio y política de privacidad. Nos comprometemos a proteger tu información y a proporcionar un servicio de calidad..."
            />
            <Button onClick={handleSave} variant="hero">
              Guardar términos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
