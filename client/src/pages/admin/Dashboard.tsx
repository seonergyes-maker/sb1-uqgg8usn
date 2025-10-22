import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import type { Client } from "@shared/schema";

interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  recentClients: (Client & { daysAgo: number })[];
}

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const getTimeText = (daysAgo: number) => {
    if (daysAgo === 0) return "Hoy";
    if (daysAgo === 1) return "Ayer";
    return `Hace ${daysAgo} días`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Vista general de tu plataforma
          </p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Cargando estadísticas...
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Vista general de tu plataforma
          </p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Clientes totales",
      value: stats.totalClients.toString(),
      icon: Users,
      testId: "stat-total-clients"
    },
    {
      title: "Suscripciones activas",
      value: stats.activeSubscriptions.toString(),
      icon: CreditCard,
      testId: "stat-active-subscriptions"
    },
    {
      title: "Ingresos mensuales",
      value: `€${stats.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      testId: "stat-monthly-revenue"
    },
    {
      title: "Tasa de conversión",
      value: stats.totalClients > 0 
        ? `${((stats.activeSubscriptions / stats.totalClients) * 100).toFixed(1)}%`
        : "0%",
      icon: TrendingUp,
      testId: "stat-conversion-rate"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Vista general de tu plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card 
            key={index}
            className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={stat.testId}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="bg-gradient-primary/10 p-2 rounded-lg">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`${stat.testId}-value`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Datos en tiempo real
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Nuevos clientes (últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay clientes nuevos en los últimos 7 días
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentClients.map((client) => (
                  <div 
                    key={client.id} 
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    data-testid={`recent-client-${client.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{client.plan}</p>
                      <p className="text-xs text-muted-foreground">{getTimeText(client.daysAgo)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Distribución de planes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                // Calculate plan distribution from all clients
                const planCounts: Record<string, number> = {};
                stats.recentClients.forEach(client => {
                  planCounts[client.plan] = (planCounts[client.plan] || 0) + 1;
                });

                const plans = Object.entries(planCounts).map(([plan, count]) => ({
                  plan,
                  count,
                  percentage: ((count / stats.recentClients.length) * 100).toFixed(0)
                }));

                const planColors: Record<string, string> = {
                  Essential: "bg-blue-500",
                  Growth: "bg-purple-500",
                  Scale: "bg-green-500",
                  Enterprise: "bg-orange-500"
                };

                return plans.length > 0 ? (
                  plans.map((planData, index) => (
                    <div key={index} className="space-y-2" data-testid={`plan-dist-${planData.plan}`}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{planData.plan}</span>
                        <span className="text-muted-foreground">{planData.count} clientes ({planData.percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`${planColors[planData.plan] || 'bg-primary'} h-2 rounded-full transition-all`}
                          style={{ width: `${planData.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay datos de distribución disponibles
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
