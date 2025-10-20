import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, MoreVertical, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const automations = [
  {
    id: "1",
    name: "Bienvenida nuevos leads",
    description: "Serie de 5 emails para nuevos suscriptores",
    status: "Activa",
    triggers: 245,
    emails: 1225,
    conversions: 86,
    rate: "35.1%"
  },
  {
    id: "2",
    name: "Abandono de carrito",
    description: "Recordatorio 24h después del abandono",
    status: "Activa",
    triggers: 142,
    emails: 426,
    conversions: 68,
    rate: "47.9%"
  },
  {
    id: "3",
    name: "Re-engagement inactivos",
    description: "Recupera leads sin actividad 30 días",
    status: "Activa",
    triggers: 892,
    emails: 2676,
    conversions: 178,
    rate: "20.0%"
  },
  {
    id: "4",
    name: "Upsell clientes Essential",
    description: "Ofrece upgrade a plan Growth",
    status: "Pausada",
    triggers: 56,
    emails: 168,
    conversions: 12,
    rate: "21.4%"
  },
  {
    id: "5",
    name: "Onboarding día 7",
    description: "Tips y mejores prácticas",
    status: "Borrador",
    triggers: 0,
    emails: 0,
    conversions: 0,
    rate: "-"
  }
];

const Automations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Automatizaciones</h2>
          <p className="text-muted-foreground">
            Crea secuencias automatizadas de emails
          </p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Nueva automatización
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Automatizaciones</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground mt-1">5 activas, 3 pausadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Ejecutadas</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,335</p>
            <p className="text-xs text-primary mt-1">Este mes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Emails enviados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4,495</p>
            <p className="text-xs text-muted-foreground mt-1">Promedio 3.4 por secuencia</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Tasa conversión</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">25.7%</p>
            <p className="text-xs text-green-500 mt-1">+4.2% vs manual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <Card key={automation.id} className="border-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-primary/10 p-2 rounded-lg mt-1">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{automation.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {automation.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      automation.status === "Activa" ? "default" : 
                      automation.status === "Pausada" ? "secondary" : 
                      "outline"
                    }
                  >
                    {automation.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver flujo</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver estadísticas</DropdownMenuItem>
                      {automation.status === "Activa" ? (
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          Pausar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Activar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Activaciones</p>
                  <p className="text-xl font-bold">{automation.triggers}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Emails</p>
                  <p className="text-xl font-bold">{automation.emails}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conversiones</p>
                  <p className="text-xl font-bold">{automation.conversions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tasa</p>
                  <p className="text-xl font-bold text-primary">{automation.rate}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" className="w-full">
                  Ver detalles completos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-gradient-subtle">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Plantillas de automatización</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Empieza rápido con nuestras plantillas pre-configuradas de automatizaciones 
                que han demostrado mejores resultados.
              </p>
            </div>
            <Button variant="outline">
              Explorar plantillas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Automations;
