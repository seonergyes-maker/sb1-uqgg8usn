import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Webhook, CheckCircle2, XCircle, RefreshCw, Copy, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const webhooks = [
  {
    id: 1,
    name: "Zapier Integration",
    url: "https://hooks.zapier.com/hooks/catch/xxxxx",
    events: ["email.sent", "email.opened", "email.clicked"],
    status: "active",
    lastTriggered: "2025-03-19 15:30",
    successRate: 98.5
  },
  {
    id: 2,
    name: "CRM Sync",
    url: "https://api.hubspot.com/webhooks/xxxxx",
    events: ["lead.created", "lead.updated"],
    status: "active",
    lastTriggered: "2025-03-19 16:45",
    successRate: 100
  },
  {
    id: 3,
    name: "Analytics Tracker",
    url: "https://analytics.example.com/webhook",
    events: ["campaign.completed", "landing.conversion"],
    status: "inactive",
    lastTriggered: "2025-03-15 10:20",
    successRate: 95.2
  }
];

const availableEvents = [
  { value: "email.sent", label: "Email Enviado" },
  { value: "email.opened", label: "Email Abierto" },
  { value: "email.clicked", label: "Email Clic" },
  { value: "email.bounced", label: "Email Rebotado" },
  { value: "email.unsubscribed", label: "Desuscripción" },
  { value: "lead.created", label: "Lead Creado" },
  { value: "lead.updated", label: "Lead Actualizado" },
  { value: "campaign.started", label: "Campaña Iniciada" },
  { value: "campaign.completed", label: "Campaña Completada" },
  { value: "landing.view", label: "Landing Vista" },
  { value: "landing.conversion", label: "Landing Conversión" }
];

const Webhooks = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
          <p className="text-muted-foreground mt-2">
            Conecta LandFlow con tus aplicaciones favoritas mediante webhooks
          </p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Webhook
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Webhooks Activos</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              3 total configurados
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Llamadas Hoy</CardDescription>
            <CardTitle className="text-3xl">847</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              99.2% exitosas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa de Éxito</CardDescription>
            <CardTitle className="text-3xl">98%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Promedio últimos 7 días
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Último Evento</CardDescription>
            <CardTitle className="text-lg">16:45</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              lead.updated
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de creación */}
      {isCreating && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Configurar Nuevo Webhook</CardTitle>
            <CardDescription>
              Define la URL y los eventos que deseas monitorear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre del Webhook</Label>
              <Input placeholder="Ej: Integración con Slack" />
            </div>
            <div>
              <Label>URL de Destino</Label>
              <Input placeholder="https://..." type="url" />
            </div>
            <div>
              <Label>Eventos a Escuchar</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona eventos..." />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Activar inmediatamente</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Crear Webhook</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados</CardTitle>
          <CardDescription>
            Gestiona tus webhooks y monitorea su actividad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Trigger</TableHead>
                <TableHead>Tasa Éxito</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4 text-muted-foreground" />
                      {webhook.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {webhook.url}
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 2).map(event => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                      {webhook.status === "active" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactivo
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.lastTriggered}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      webhook.successRate >= 95 ? "text-primary" : "text-destructive"
                    }`}>
                      {webhook.successRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log de actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas 10 llamadas a webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "16:45:23", webhook: "CRM Sync", event: "lead.updated", status: "success" },
              { time: "16:42:15", webhook: "Zapier Integration", event: "email.opened", status: "success" },
              { time: "16:38:07", webhook: "Zapier Integration", event: "email.sent", status: "success" },
              { time: "16:35:42", webhook: "CRM Sync", event: "lead.created", status: "success" },
              { time: "16:30:18", webhook: "Analytics Tracker", event: "campaign.completed", status: "failed" },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={log.status === "success" ? "default" : "destructive"}>
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {log.status === "success" ? "Exitoso" : "Fallido"}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{log.webhook}</p>
                    <p className="text-xs text-muted-foreground">{log.event}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Webhooks;