import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xNmMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNHMxLjggNCA0IDQgNC0xLjggNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Listo para automatizar tus ventas?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya están vendiendo en piloto automático. 
              Empieza gratis hoy mismo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/registro">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
                >
                  Hablar con ventas
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-primary-foreground/70 mt-6">
              No se requiere tarjeta de crédito • Cancelación en cualquier momento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
