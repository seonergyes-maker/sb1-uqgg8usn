import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Mail, Eye, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const stats = [
  {
    title: "Total Leads",
    value: "2,458",
    change: "+12.5%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Emails enviados",
    value: "15,240",
    change: "+8.2%",
    icon: Mail,
    trend: "up"
  },
  {
    title: "Tasa de apertura",
    value: "32.8%",
    change: "+2.1%",
    icon: Eye,
    trend: "up"
  },
  {
    title: "Conversiones",
    value: "186",
    change: "+15.3%",
    icon: TrendingUp,
    trend: "up"
  }
];

const recentActivity = [
  { action: "Landing publicada", description: "Oferta Black Friday", time: "Hace 5 horas" },
  { action: "Automatización activada", description: "Secuencia abandono carrito", time: "Ayer" },
  { action: "45 nuevos leads", description: "Landing página principal", time: "Ayer" },
  { action: "Template creado", description: "Email de bienvenida", time: "Hace 2 días" },
];

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido de nuevo! 👋</h2>
          <p className="text-muted-foreground">
            Aquí está el resumen de tu actividad
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/panel/landings">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nueva landing
            </Button>
          </Link>
          <Link href="/panel/automatizaciones">
            <Button variant="hero">
              <Mail className="mr-2 h-4 w-4" />
              Nueva automatización
            </Button>
          </Link>
        </div>
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
            <div className="flex items-center justify-between">
              <CardTitle>Actividad reciente</CardTitle>
              <Button variant="ghost" size="sm">Ver todo</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
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

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Mejores landings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Oferta Black Friday", visits: "3,240", conversions: "248", rate: "7.6%" },
                { name: "Webinar gratuito", visits: "2,180", conversions: "186", rate: "8.5%" },
                { name: "Guía descargable", visits: "1,920", conversions: "142", rate: "7.4%" },
              ].map((landing, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{landing.name}</p>
                    <p className="text-sm text-muted-foreground">{landing.visits} visitas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{landing.rate}</p>
                    <p className="text-xs text-muted-foreground">{landing.conversions} conversiones</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-gradient-subtle">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda para empezar?</h3>
              <p className="text-muted-foreground">
                Consulta nuestra guía rápida para crear tu primera campaña exitosa
              </p>
            </div>
            <Button variant="hero">
              Ver guía
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
