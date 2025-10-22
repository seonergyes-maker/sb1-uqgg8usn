import { Check, Zap, TrendingUp, Mail, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Check,
    title: "Landings profesionales optimizadas",
    description: "Crea páginas de captura y ventas optimizadas para conversión con nuestro editor drag & drop."
  },
  {
    icon: Zap,
    title: "Embudos completos automatizados",
    description: "Automatiza todo el proceso de venta desde la captura hasta el cierre, funcionando 24/7."
  },
  {
    icon: Mail,
    title: "Campañas de email sin límites",
    description: "Envía secuencias automatizadas y campañas puntuales sin restricciones de embudos."
  },
  {
    icon: BarChart3,
    title: "Métricas de rendimiento",
    description: "Control total con analíticas de leads, conversiones y ROI en tiempo real."
  },
  {
    icon: Users,
    title: "Segmentación avanzada",
    description: "Divide tu audiencia y personaliza mensajes para maximizar resultados."
  },
  {
    icon: TrendingUp,
    title: "Crecimiento escalable",
    description: "Crece de forma predecible con una plataforma diseñada para escalar tu negocio."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              vender más
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa que combina landing pages y email marketing 
            para que vendas en piloto automático
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="bg-gradient-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
