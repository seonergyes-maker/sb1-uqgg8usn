import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Mail, Eye, MousePointer, Target, Zap, TrendingUp, BarChart3 } from "lucide-react";

interface UserStats {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  avgLeadScore: string;
  totalSegments: number;
  totalLeadsSegmented: number;
  totalCampaigns: number;
  sentCampaigns: number;
  totalRecipients: number;
  avgOpenRate: string;
  avgClickRate: string;
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  avgSuccessRate: string;
}

const Statistics = () => {
  const clientId = 1;

  // Fetch user statistics
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/user-stats", clientId],
    queryFn: () => fetch(`/api/user-stats/${clientId}`).then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No hay estadísticas disponibles</p>
      </div>
    );
  }

  const conversionRate = stats.totalLeads > 0
    ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(2)
    : "0.00";

  const qualificationRate = stats.totalLeads > 0
    ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Estadísticas</h2>
          <p className="text-muted-foreground">
            Panel de métricas y rendimiento de tu plataforma
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="automations">Automatizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Leads
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-leads">{stats.totalLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.qualifiedLeads} calificados · {stats.convertedLeads} convertidos
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emails Enviados
                </CardTitle>
                <Mail className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-recipients">{stats.totalRecipients.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.sentCampaigns} campañas enviadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa de Apertura
                </CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-avg-open-rate">{stats.avgOpenRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio de campañas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa de Clics
                </CardTitle>
                <MousePointer className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-avg-click-rate">{stats.avgClickRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio de campañas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Tasa de Conversión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{conversionRate}%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.convertedLeads} de {stats.totalLeads} leads convertidos
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Score Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.avgLeadScore}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Puntuación promedio de leads
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Tasa de Calificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{qualificationRate}%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.qualifiedLeads} de {stats.totalLeads} leads calificados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Segmentación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total segmentos</span>
                    <span className="text-2xl font-bold">{stats.totalSegments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Leads segmentados</span>
                    <span className="text-2xl font-bold">{stats.totalLeadsSegmented}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {stats.totalSegments > 0 
                        ? `Promedio de ${(stats.totalLeadsSegmented / stats.totalSegments).toFixed(0)} leads por segmento`
                        : "Crea tu primer segmento"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Automatizaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total automatizaciones</span>
                    <span className="text-2xl font-bold">{stats.totalAutomations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Activas</span>
                    <span className="text-2xl font-bold text-green-600">{stats.activeAutomations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ejecutadas</span>
                    <span className="text-2xl font-bold">{stats.totalExecutions.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Tasa de éxito promedio: {stats.avgSuccessRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">Leads totales capturados</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Calificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.qualifiedLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">{qualificationRate}% del total</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Convertidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.convertedLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">{conversionRate}% de conversión</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Score Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.avgLeadScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Puntuación de calidad</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Embudo de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Leads</span>
                    <span className="text-sm font-medium">{stats.totalLeads} (100%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Calificados</span>
                    <span className="text-sm font-medium">{stats.qualifiedLeads} ({qualificationRate}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full" style={{ width: `${qualificationRate}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Convertidos</span>
                    <span className="text-sm font-medium">{stats.convertedLeads} ({conversionRate}%)</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: `${conversionRate}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Campañas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">Campañas creadas</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Enviadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.sentCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalCampaigns > 0 
                    ? `${((stats.sentCampaigns / stats.totalCampaigns) * 100).toFixed(0)}% del total`
                    : "0% del total"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Destinatarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalRecipients.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Emails totales enviados</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa Apertura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.avgOpenRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Promedio</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Rendimiento de Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Tasa de Apertura</span>
                      <span className="text-sm font-medium text-primary">{stats.avgOpenRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: `${stats.avgOpenRate}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Tasa de Clics</span>
                      <span className="text-sm font-medium text-primary">{stats.avgClickRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full" style={{ width: `${stats.avgClickRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Emails enviados</span>
                    <span className="font-bold">{stats.totalRecipients.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Campañas activas</span>
                    <span className="font-bold">{stats.sentCampaigns}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Promedio por campaña</span>
                    <span className="font-bold">
                      {stats.sentCampaigns > 0 
                        ? (stats.totalRecipients / stats.sentCampaigns).toLocaleString(undefined, { maximumFractionDigits: 0 })
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Automatizaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalAutomations}</div>
                <p className="text-xs text-muted-foreground mt-1">Automatizaciones creadas</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.activeAutomations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalAutomations > 0 
                    ? `${((stats.activeAutomations / stats.totalAutomations) * 100).toFixed(0)}% del total`
                    : "0% del total"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ejecutadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalExecutions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Total de ejecuciones</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasa de Éxito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.avgSuccessRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Promedio</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Rendimiento de Automatizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Tasa de Éxito Promedio</span>
                    <span className="text-sm font-medium text-primary">{stats.avgSuccessRate}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{ width: `${stats.avgSuccessRate}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.totalAutomations}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Activas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeAutomations}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ejecuciones</p>
                    <p className="text-2xl font-bold">{stats.totalExecutions}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
