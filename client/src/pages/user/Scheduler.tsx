import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Mail, FileText, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scheduledItems = [
  {
    id: 1,
    type: "email",
    title: "Newsletter Semanal - Marzo",
    date: new Date(2025, 2, 20, 10, 0),
    recipients: 3450,
    status: "scheduled"
  },
  {
    id: 2,
    type: "email",
    title: "Oferta Flash - Producto X",
    date: new Date(2025, 2, 22, 15, 30),
    recipients: 1200,
    status: "scheduled"
  },
  {
    id: 3,
    type: "landing",
    title: "Landing Campaña Primavera",
    date: new Date(2025, 2, 25, 9, 0),
    recipients: null,
    status: "scheduled"
  },
  {
    id: 4,
    type: "email",
    title: "Seguimiento Cart Abandono",
    date: new Date(2025, 2, 21, 18, 0),
    recipients: 567,
    status: "scheduled"
  },
  {
    id: 5,
    type: "email",
    title: "Invitación Webinar",
    date: new Date(2025, 2, 28, 11, 0),
    recipients: 2890,
    status: "scheduled"
  }
];

const Scheduler = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateItems = scheduledItems.filter(item => {
    if (!date) return false;
    return item.date.toDateString() === date.toDateString();
  });

  const getDatesWithEvents = () => {
    return scheduledItems.map(item => item.date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programación</h1>
          <p className="text-muted-foreground mt-2">
            Programa tus campañas y landings para el momento perfecto
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Programar Envío
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario de Envíos</CardTitle>
            <CardDescription>
              Visualiza todos tus envíos programados
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvent: getDatesWithEvents()
              }}
              modifiersStyles={{
                hasEvent: { 
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximos 7 días</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Emails programados</span>
                <span className="text-2xl font-bold">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Landings programadas</span>
                <span className="text-2xl font-bold">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total destinatarios</span>
                <span className="text-2xl font-bold">8,107</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mejor horario</CardTitle>
              <CardDescription>Basado en tus métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Martes</p>
                    <p className="text-sm text-muted-foreground">10:00 AM</p>
                  </div>
                  <Badge variant="default">+45% apertura</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Jueves</p>
                    <p className="text-sm text-muted-foreground">3:00 PM</p>
                  </div>
                  <Badge variant="secondary">+38% clics</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de envíos programados */}
      <Card>
        <CardHeader>
          <CardTitle>
            {date ? `Envíos programados para ${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Todos los envíos programados'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(selectedDateItems.length > 0 ? selectedDateItems : scheduledItems).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'email' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    {item.type === 'email' ? (
                      <Mail className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.date.toLocaleString('es-ES', { 
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {item.recipients && (
                        <span>{item.recipients.toLocaleString()} destinatarios</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.status === 'scheduled' ? 'Programado' : 'Enviado'}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Reprogramar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduler;