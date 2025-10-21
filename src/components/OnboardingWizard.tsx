import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Rocket, Users, Mail, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "Bienvenido a LandFlow",
    description: "Crea campañas de email marketing efectivas en minutos",
    icon: Rocket,
    content: "LandFlow es tu plataforma completa para gestionar leads, crear landing pages y automatizar tus campañas de email marketing."
  },
  {
    title: "Gestiona tus Leads",
    description: "Importa y segmenta tu audiencia",
    icon: Users,
    content: "Importa contactos desde CSV, crea segmentos personalizados y organiza tu base de datos de leads de forma eficiente."
  },
  {
    title: "Crea Campañas",
    description: "Diseña emails profesionales",
    icon: Mail,
    content: "Usa nuestros templates prediseñados o crea tus propios emails con nuestro editor visual drag & drop."
  },
  {
    title: "Analiza Resultados",
    description: "Mide el éxito de tus campañas",
    icon: BarChart3,
    content: "Accede a métricas en tiempo real: tasas de apertura, clics, conversiones y más. Optimiza continuamente tus campañas."
  }
];

export function OnboardingWizard({ open, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const progress = ((currentStep + 1) / steps.length) * 100;
  const StepIcon = steps[currentStep].icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Configuración Inicial
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Progress value={progress} className="h-2" />
          
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <StepIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>{steps[currentStep].title}</CardTitle>
                  <CardDescription>{steps[currentStep].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {steps[currentStep].content}
              </p>
              
              {currentStep === steps.length - 1 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">¡Todo listo!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ya puedes empezar a crear tu primera campaña.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}