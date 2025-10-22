import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODg4ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6bTAtMTZjLTIuMiAwLTQgMS44LTQgNHMxLjggNCA0IDQgNC0xLjggNC00LTEuOC00LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Crea y automatiza sin límites
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            Landings profesionales que{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              convierten
            </span>
            {" "}y email marketing automatizado
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Todo lo que necesitas para vender en piloto automático: landings optimizadas, 
            embudos completos y campañas de email ilimitadas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/registro">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Empieza gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/precios">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver precios
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            ✓ Sin tarjeta de crédito  ✓ Configuración en 5 minutos  ✓ Soporte en español
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
