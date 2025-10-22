import { Layers, Settings, Rocket, BarChart } from "lucide-react";

const steps = [
  {
    icon: Layers,
    title: "1. Crea tu landing",
    description: "Diseña páginas profesionales en minutos con plantillas optimizadas para conversión. Sin necesidad de código."
  },
  {
    icon: Settings,
    title: "2. Configura tu embudo",
    description: "Automatiza secuencias de emails que guían a tus leads desde el primer contacto hasta la venta."
  },
  {
    icon: Rocket,
    title: "3. Lanza tu campaña",
    description: "Publica tu landing, conecta tu dominio y empieza a captar leads mientras tu embudo trabaja por ti."
  },
  {
    icon: BarChart,
    title: "4. Optimiza con datos",
    description: "Analiza métricas en tiempo real: tasas de conversión, apertura de emails y ROI para mejorar continuamente."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En 4 pasos simples, puedes tener tu sistema de ventas automatizado funcionando
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-glow transition-all duration-300">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2"></div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
