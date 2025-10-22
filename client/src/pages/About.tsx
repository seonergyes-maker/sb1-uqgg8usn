import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Zap, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Misión clara",
    description: "Democratizar el acceso a herramientas de marketing profesional para que cualquier negocio pueda crecer."
  },
  {
    icon: Users,
    title: "Cliente primero",
    description: "Tu éxito es nuestro éxito. Diseñamos cada funcionalidad pensando en maximizar tus resultados."
  },
  {
    icon: Zap,
    title: "Innovación constante",
    description: "Mejoramos continuamente nuestra plataforma con las últimas tecnologías y mejores prácticas."
  },
  {
    icon: Award,
    title: "Calidad garantizada",
    description: "Mantenemos los más altos estándares de deliverability, seguridad y rendimiento."
  }
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LandFlow
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Nacimos con una misión: ayudar a negocios de todos los tamaños a vender más 
                a través de la automatización inteligente del marketing digital.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Nuestra historia</h2>
                  <p className="text-muted-foreground mb-4">
                    LandFlow nació de la frustración de usar herramientas complejas y caras 
                    que no estaban diseñadas para emprendedores y pequeñas empresas.
                  </p>
                  <p className="text-muted-foreground">
                    Decidimos crear una plataforma que combinara la potencia de las grandes 
                    herramientas enterprise con la simplicidad que todo negocio necesita para 
                    empezar rápido y crecer sin límites.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold mb-4">Lo que nos impulsa</h2>
                  <p className="text-muted-foreground mb-4">
                    Creemos que toda empresa merece tener acceso a tecnología de marketing 
                    de primer nivel, sin complejidad innecesaria ni costes prohibitivos.
                  </p>
                  <p className="text-muted-foreground">
                    Nuestro equipo trabaja cada día para hacer que el email marketing y las 
                    landing pages sean accesibles, efectivas y rentables para todos.
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-12">Nuestros valores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <Card 
                      key={index}
                      className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="bg-gradient-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                          <value.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center bg-gradient-subtle rounded-2xl p-12">
                <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Más de 500 empresas confían en LandFlow para automatizar sus ventas y 
                  hacer crecer su negocio. Con un 98% de satisfacción del cliente y soporte 
                  en español disponible cuando lo necesites.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-muted-foreground">Uptime garantizado</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">500+</div>
                    <div className="text-muted-foreground">Empresas activas</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                    <div className="text-muted-foreground">Emails enviados/mes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
