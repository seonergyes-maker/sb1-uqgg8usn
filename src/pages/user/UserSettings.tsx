import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const UserSettings = () => {
  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Configuración</h2>
        <p className="text-muted-foreground">
          Personaliza tu experiencia en LandFlow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Input id="fromName" defaultValue="Tu Empresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email del remitente</Label>
              <Input id="fromEmail" type="email" defaultValue="noreply@tuempresa.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replyTo">Email de respuesta</Label>
              <Input id="replyTo" type="email" defaultValue="soporte@tuempresa.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Firma de email</Label>
              <Textarea 
                id="signature" 
                rows={4}
                defaultValue="Saludos,&#10;El equipo de Tu Empresa"
              />
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campañas enviadas</Label>
                <p className="text-sm text-muted-foreground">
                  Confirmación cuando una campaña se envíe
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Informes semanales</Label>
                <p className="text-sm text-muted-foreground">
                  Resumen semanal de tu actividad
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tips y novedades</Label>
                <p className="text-sm text-muted-foreground">
                  Consejos y nuevas funcionalidades
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Dominio personalizado</CardTitle>
            <CardDescription>
              Usa tu propio dominio para las landings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Tu dominio</Label>
              <Input id="domain" placeholder="tuempresa.com" />
              <p className="text-xs text-muted-foreground">
                Necesitarás configurar los registros DNS. Te enviaremos las instrucciones.
              </p>
            </div>
            <Button onClick={handleSave} variant="outline" className="w-full">
              Verificar dominio
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Integraciones</CardTitle>
            <CardDescription>
              Conecta con otras herramientas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">GA</span>
                </div>
                <div>
                  <p className="font-medium">Google Analytics</p>
                  <p className="text-sm text-muted-foreground">No conectado</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Conectar</Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">FB</span>
                </div>
                <div>
                  <p className="font-medium">Facebook Pixel</p>
                  <p className="text-sm text-muted-foreground">No conectado</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Conectar</Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">ZP</span>
                </div>
                <div>
                  <p className="font-medium">Zapier</p>
                  <p className="text-sm text-green-500">Conectado</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
