import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "wouter";

const plans = [
  {
    name: "Starter",
    price: "0",
    contacts: "1.000",
    emails: "3.000",
    features: [
      "1.000 contactos",
      "3.000 emails/mes (150/día)",
      "2 landing pages",
      "1 automatización",
      "Templates base incluidos",
      "Estadísticas 7 días",
      "Branding LandFlow"
    ],
    popular: false,
    cta: "Comenzar gratis"
  },
  {
    name: "Essential",
    price: "15",
    contacts: "2.500",
    emails: "10.000",
    features: [
      "2.500 contactos",
      "10.000 emails/mes",
      "5 landing pages",
      "3 automatizaciones",
      "Sin branding",
      "Estadísticas 30 días",
      "Soporte por email"
    ],
    popular: false,
    cta: "Empezar ahora"
  },
  {
    name: "Professional",
    price: "49",
    contacts: "10.000",
    emails: "50.000",
    features: [
      "10.000 contactos",
      "50.000 emails/mes",
      "Landings ilimitadas",
      "10 automatizaciones",
      "A/B Testing",
      "Estadísticas ilimitadas",
      "Soporte prioritario",
      "Webhooks"
    ],
    popular: true,
    cta: "Comenzar prueba"
  },
  {
    name: "Business",
    price: "99",
    contacts: "25.000",
    emails: "150.000",
    features: [
      "25.000 contactos",
      "150.000 emails/mes",
      "Todo ilimitado",
      "API completa",
      "Subdominios custom",
      "Soporte 24/7",
      "Account manager"
    ],
    popular: false,
    cta: "Contactar ventas"
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Precios simples y{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                transparentes
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elige el plan perfecto para tu negocio. Todos incluyen acceso completo a la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border'
                } hover:shadow-xl transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Más popular
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-4">
                      {plan.price === "0" ? (
                        <span className="text-4xl font-bold text-foreground">Gratis</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
                          <span className="text-muted-foreground">/mes</span>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-sm">
                      <div>{plan.contacts} contactos</div>
                      <div>{plan.emails} emails/mes</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Link href="/registro" className="w-full">
                    <Button 
                      variant={plan.popular ? "hero" : "outline"} 
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Emails adicionales</CardTitle>
                <CardDescription>
                  Si necesitas enviar más emails, puedes comprar bloques adicionales:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="font-medium">Base</div>
                      <div className="text-sm text-muted-foreground">1,5 € por cada 1.000 emails extra</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="font-medium">+5.000 emails</div>
                      <div className="text-sm text-muted-foreground">+15 €/mes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="font-medium">+20.000 emails</div>
                      <div className="text-sm text-muted-foreground">+50 €/mes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="font-medium">+50.000 emails</div>
                      <div className="text-sm text-muted-foreground">+100 €/mes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
