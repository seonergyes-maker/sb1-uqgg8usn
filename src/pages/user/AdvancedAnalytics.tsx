import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, MousePointer, Users, Mail } from "lucide-react";

const AdvancedAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Avanzado</h1>
          <p className="text-muted-foreground mt-2">
            Análisis profundo del comportamiento de tus usuarios
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa de Conversión</CardDescription>
            <CardTitle className="text-3xl">4.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              +1.2% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo Promedio</CardDescription>
            <CardTitle className="text-3xl">3:24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Minutos en landing pages
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tasa de Rebote</CardDescription>
            <CardTitle className="text-3xl">28%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              -5% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor por Usuario</CardDescription>
            <CardTitle className="text-3xl">€42</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Promedio mensual
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="heatmaps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="heatmaps">Mapas de Calor</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="comparison">Comparativas</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones IA</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor - Landing Principal</CardTitle>
              <CardDescription>
                Visualiza dónde hacen clic tus usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-muted to-background rounded-lg p-8 min-h-[500px] border-2 border-dashed">
                {/* Simulación de mapa de calor */}
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="space-y-4">
                    <div className="bg-primary/20 p-4 rounded-lg">
                      <p className="text-sm font-medium">Header</p>
                      <p className="text-xs text-muted-foreground mt-2">234 clics</p>
                    </div>
                    <div className="bg-destructive/30 p-4 rounded-lg">
                      <p className="text-sm font-medium">Hero CTA</p>
                      <p className="text-xs text-muted-foreground mt-2">1,243 clics</p>
                      <Badge variant="destructive" className="mt-2">Zona caliente</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-sm font-medium">Features</p>
                      <p className="text-xs text-muted-foreground mt-2">567 clics</p>
                    </div>
                    <div className="bg-primary/15 p-4 rounded-lg">
                      <p className="text-sm font-medium">Pricing</p>
                      <p className="text-xs text-muted-foreground mt-2">432 clics</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-accent/25 p-4 rounded-lg">
                      <p className="text-sm font-medium">Testimonios</p>
                      <p className="text-xs text-muted-foreground mt-2">321 clics</p>
                    </div>
                    <div className="bg-destructive/25 p-4 rounded-lg">
                      <p className="text-sm font-medium">Form CTA</p>
                      <p className="text-xs text-muted-foreground mt-2">987 clics</p>
                      <Badge variant="destructive" className="mt-2">Zona caliente</Badge>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-destructive/30"></div>
                      <span>Alta actividad</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-accent/20"></div>
                      <span>Media actividad</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-primary/15"></div>
                      <span>Baja actividad</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Embudo de Conversión</CardTitle>
              <CardDescription>
                Seguimiento completo del journey del usuario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: "Landing Page Vista", users: 10000, rate: 100, icon: Users },
                  { step: "Email Abierto", users: 3200, rate: 32, icon: Mail },
                  { step: "Click en CTA", users: 1280, rate: 12.8, icon: MousePointer },
                  { step: "Formulario Iniciado", users: 640, rate: 6.4, icon: Users },
                  { step: "Conversión Final", users: 480, rate: 4.8, icon: TrendingUp }
                ].map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <stage.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{stage.step}</span>
                            <div className="text-right">
                              <span className="text-xl font-bold">{stage.users.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground ml-2">usuarios</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-primary rounded-full"
                                style={{ width: `${stage.rate}%` }}
                              />
                            </div>
                            <Badge variant="secondary">{stage.rate}%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < 4 && (
                      <div className="ml-8 h-4 w-0.5 bg-border"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa de Campañas</CardTitle>
              <CardDescription>
                Compara el rendimiento entre diferentes campañas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Campaña A - Marzo", opens: 4250, clicks: 1240, conversions: 186, rate: 4.4 },
                  { name: "Campaña B - Marzo", opens: 3890, clicks: 1320, conversions: 214, rate: 5.5 },
                  { name: "Campaña C - Febrero", opens: 4100, clicks: 1150, conversions: 172, rate: 4.2 }
                ].map((campaign, index) => (
                  <Card key={index} className={index === 1 ? "border-primary" : ""}>
                    <CardHeader>
                      <CardTitle className="text-base">{campaign.name}</CardTitle>
                      {index === 1 && (
                        <Badge variant="default">Mejor Rendimiento</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Aperturas</span>
                        <span className="font-semibold">{campaign.opens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Clics</span>
                        <span className="font-semibold">{campaign.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Conversiones</span>
                        <span className="font-semibold">{campaign.conversions}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasa Conversión</span>
                          <span className="text-xl font-bold text-primary">{campaign.rate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicciones con IA</CardTitle>
              <CardDescription>
                Optimiza tus campañas con inteligencia artificial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-primary/50">
                  <CardHeader>
                    <Badge variant="default" className="w-fit">Recomendación</Badge>
                    <CardTitle className="text-lg mt-2">Mejor Horario de Envío</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="font-semibold">Martes 10:00 AM</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          +45% tasa de apertura esperada
                        </p>
                      </div>
                      <p className="text-sm">
                        Basado en el análisis de tus últimas 50 campañas, este horario maximiza la interacción.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/50">
                  <CardHeader>
                    <Badge variant="default" className="w-fit">Predicción</Badge>
                    <CardTitle className="text-lg mt-2">Tasa de Conversión Esperada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <p className="text-4xl font-bold text-primary">5.2%</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Para tu próxima campaña
                        </p>
                      </div>
                      <p className="text-sm">
                        Considerando tu audiencia actual y el rendimiento histórico.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Segmentos de Alto Valor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: "Usuarios Premium", value: "€89/usuario", rate: "12% conversión" },
                        { name: "Recurrentes", value: "€56/usuario", rate: "8.5% conversión" }
                      ].map((segment, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <p className="font-medium">{segment.name}</p>
                          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                            <span>{segment.value}</span>
                            <span>{segment.rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contenido Sugerido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">Subject Lines con Mejor CTR:</p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li>• Preguntas directas (+38%)</li>
                          <li>• Personalización (+32%)</li>
                          <li>• Urgencia limitada (+28%)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;