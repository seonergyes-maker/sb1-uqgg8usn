import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Clientes totales",
    value: "248",
    change: "+12.5%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Suscripciones activas",
    value: "186",
    change: "+8.2%",
    icon: CreditCard,
    trend: "up"
  },
  {
    title: "Ingresos mensuales",
    value: "€18,450",
    change: "+15.3%",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Tasa de conversión",
    value: "24.8%",
    change: "+3.1%",
    icon: TrendingUp,
    trend: "up"
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Vista general de tu plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary font-medium">{stat.change}</span> vs mes anterior
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
            <div className="space-y-4">
              {[
                { name: "María García", email: "maria@empresa.com", plan: "Growth", date: "Hoy" },
                { name: "Juan Martínez", email: "juan@startup.es", plan: "Essential", date: "Ayer" },
                { name: "Ana López", email: "ana@business.com", plan: "Scale", date: "Hace 2 días" },
                { name: "Carlos Ruiz", email: "carlos@tech.io", plan: "Growth", date: "Hace 3 días" },
              ].map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{client.plan}</p>
                    <p className="text-xs text-muted-foreground">{client.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Nuevo pago", description: "€99.00 - Growth Plan", time: "Hace 5 min" },
                { action: "Suscripción renovada", description: "Scale Plan - Carlos R.", time: "Hace 1 hora" },
                { action: "Cliente nuevo", description: "María García", time: "Hace 2 horas" },
                { action: "Email enviado", description: "Campaña bienvenida (245 destinatarios)", time: "Hace 3 horas" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
