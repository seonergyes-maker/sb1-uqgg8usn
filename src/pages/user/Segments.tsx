import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, TrendingUp, Calendar, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const segments = [
  {
    id: "1",
    name: "Leads Alta Calidad",
    description: "Leads con score superior a 80 puntos",
    count: 486,
    growth: "+12%",
    color: "bg-green-500",
    lastUpdated: "Hace 2 horas"
  },
  {
    id: "2",
    name: "Interesados en Scale",
    description: "Visitaron la página de pricing Scale",
    count: 234,
    growth: "+8%",
    color: "bg-blue-500",
    lastUpdated: "Hace 5 horas"
  },
  {
    id: "3",
    name: "Inactivos 30 días",
    description: "Sin abrir emails en el último mes",
    count: 892,
    growth: "-5%",
    color: "bg-orange-500",
    lastUpdated: "Ayer"
  },
  {
    id: "4",
    name: "Nuevos suscriptores",
    description: "Registrados en los últimos 7 días",
    count: 156,
    growth: "+24%",
    color: "bg-purple-500",
    lastUpdated: "Hace 1 hora"
  },
  {
    id: "5",
    name: "Abandonaron carrito",
    description: "Iniciaron compra pero no completaron",
    count: 68,
    growth: "+3%",
    color: "bg-red-500",
    lastUpdated: "Hace 3 horas"
  },
  {
    id: "6",
    name: "Clientes recurrentes",
    description: "Han renovado suscripción 2+ veces",
    count: 342,
    growth: "+6%",
    color: "bg-teal-500",
    lastUpdated: "Hace 4 horas"
  }
];

const Segments = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Segmentos</h2>
          <p className="text-muted-foreground">
            Organiza tus leads en grupos personalizados
          </p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Crear segmento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total segmentos</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">6 activos, 6 archivados</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Leads segmentados</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,178</p>
            <p className="text-xs text-muted-foreground mt-1">88.6% del total</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Mayor crecimiento</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+24%</p>
            <p className="text-xs text-primary mt-1">Nuevos suscriptores</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card key={segment.id} className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                  <div>
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {segment.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver leads</DropdownMenuItem>
                    <DropdownMenuItem>Editar reglas</DropdownMenuItem>
                    <DropdownMenuItem>Exportar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Archivar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Contactos</span>
                  </div>
                  <span className="text-2xl font-bold">{segment.count.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Crecimiento</span>
                  </div>
                  <Badge variant={segment.growth.startsWith('+') ? 'default' : 'outline'}>
                    {segment.growth}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>Actualizado {segment.lastUpdated}</span>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  Ver detalles
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
              <h3 className="text-lg font-bold mb-2">¿Cómo funcionan los segmentos?</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Los segmentos te permiten agrupar automáticamente tus leads según reglas que definas. 
                Puedes crear campañas específicas para cada segmento y mejorar la personalización.
              </p>
            </div>
            <Button variant="outline">
              Ver guía
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Segments;
