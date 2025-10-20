import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, Users, Mail, Eye, MousePointer } from "lucide-react";

const Statistics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Estadísticas</h2>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tus campañas
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar informe
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="landings">Landings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Leads
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,458</div>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.5%</span>
                  <span className="text-muted-foreground">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emails enviados
                </CardTitle>
                <Mail className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,240</div>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8.2%</span>
                  <span className="text-muted-foreground">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa de apertura
                </CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.8%</div>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+2.1%</span>
                  <span className="text-muted-foreground">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa de clics
                </CardTitle>
                <MousePointer className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5%</div>
                <div className="flex items-center gap-1 text-xs text-primary mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+1.3%</span>
                  <span className="text-muted-foreground">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Crecimiento de leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-secondary/30 rounded-lg">
                  <p className="text-muted-foreground">Gráfico de línea temporal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Fuentes de tráfico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { source: "Landing Black Friday", leads: 486, percentage: 32 },
                    { source: "Campaña email", leads: 342, percentage: 23 },
                    { source: "Formulario contacto", leads: 298, percentage: 20 },
                    { source: "Landing webinar", leads: 245, percentage: 16 },
                    { source: "Otros", leads: 142, percentage: 9 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.source}</span>
                        <span className="text-sm text-muted-foreground">{item.leads} leads</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Mejores campañas del mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Oferta Black Friday", sent: 3240, opened: 1296, clicked: 486, rate: "40.0%" },
                  { name: "Newsletter Febrero", sent: 2180, opened: 715, clicked: 198, rate: "32.8%" },
                  { name: "Bienvenida nuevos leads", sent: 2458, opened: 806, clicked: 245, rate: "32.8%" },
                ].map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.sent.toLocaleString()} enviados • {campaign.opened.toLocaleString()} aperturas • {campaign.clicked} clics
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{campaign.rate}</p>
                      <p className="text-xs text-muted-foreground">Tasa apertura</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Estadísticas detalladas de leads</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Estadísticas detalladas de emails</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landings" className="space-y-6">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Estadísticas detalladas de landings</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
