import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, Play, Pause, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tests = [
  {
    id: 1,
    name: "Subject Line Test - Newsletter Marzo",
    status: "active",
    type: "email",
    variants: [
      { name: "Variante A", sent: 1250, opened: 387, clicks: 94, conversion: 31.0 },
      { name: "Variante B", sent: 1250, opened: 456, clicks: 112, conversion: 36.5 },
    ],
    winner: "B",
    confidence: 87,
    startDate: "2025-03-15"
  },
  {
    id: 2,
    name: "CTA Button Test - Landing Producto",
    status: "active",
    type: "landing",
    variants: [
      { name: "Variante A", sent: 2100, opened: 2100, clicks: 168, conversion: 8.0 },
      { name: "Variante B", sent: 2100, opened: 2100, clicks: 231, conversion: 11.0 },
    ],
    winner: "B",
    confidence: 94,
    startDate: "2025-03-18"
  },
  {
    id: 3,
    name: "Timing Test - Email Promocional",
    status: "completed",
    type: "email",
    variants: [
      { name: "9:00 AM", sent: 1500, opened: 525, clicks: 135, conversion: 35.0 },
      { name: "2:00 PM", sent: 1500, opened: 480, clicks: 118, conversion: 32.0 },
      { name: "7:00 PM", sent: 1500, opened: 615, clicks: 159, conversion: 41.0 },
    ],
    winner: "C",
    confidence: 92,
    startDate: "2025-03-10"
  },
  {
    id: 4,
    name: "Form Length Test - Lead Capture",
    status: "paused",
    type: "landing",
    variants: [
      { name: "Corto (3 campos)", sent: 890, opened: 890, clicks: 267, conversion: 30.0 },
      { name: "Largo (7 campos)", sent: 890, opened: 890, clicks: 151, conversion: 17.0 },
    ],
    winner: "A",
    confidence: 98,
    startDate: "2025-03-05"
  }
];

const ABTesting = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing</h1>
          <p className="text-muted-foreground mt-2">
            Optimiza tus campañas probando diferentes variantes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Test
        </Button>
      </div>

      {/* Resumen de Tests */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tests Activos</CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              En ejecución
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tests Completados</CardDescription>
            <CardTitle className="text-3xl">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Resultados disponibles
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mejora Promedio</CardDescription>
            <CardTitle className="text-3xl">+23%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Conversión mejorada
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Confianza Promedio</CardDescription>
            <CardTitle className="text-3xl">90%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Significancia estadística
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Tests Recientes</CardTitle>
          <CardDescription>
            Gestiona y analiza tus tests A/B
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Test</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ganador</TableHead>
                <TableHead>Confianza</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {test.type === "email" ? "Email" : "Landing"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      test.status === "active" ? "default" :
                      test.status === "completed" ? "secondary" : "outline"
                    }>
                      {test.status === "active" ? "Activo" :
                       test.status === "completed" ? "Completado" : "Pausado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">
                      Variante {test.winner}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{test.confidence}%</span>
                      </div>
                      <Progress value={test.confidence} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        {test.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalles del Test Destacado */}
      <Card>
        <CardHeader>
          <CardTitle>Test Destacado: Subject Line Test</CardTitle>
          <CardDescription>
            Comparación detallada de variantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {tests[0].variants.map((variant) => (
              <Card key={variant.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{variant.name}</CardTitle>
                    {variant.name === "Variante B" && (
                      <Badge variant="default">Ganador</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Enviados</p>
                      <p className="text-2xl font-bold">{variant.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Abiertos</p>
                      <p className="text-2xl font-bold">{variant.opened}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clics</p>
                      <p className="text-2xl font-bold">{variant.clicks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa Apertura</p>
                      <p className="text-2xl font-bold text-primary">{variant.conversion}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTesting;