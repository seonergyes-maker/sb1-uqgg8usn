import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío del formulario
    toast.success("Mensaje enviado correctamente. Te responderemos pronto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ¿Tienes alguna{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  pregunta?
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="juan@empresa.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Asunto</Label>
                        <Input
                          id="subject"
                          placeholder="¿En qué podemos ayudarte?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                          id="message"
                          placeholder="Cuéntanos más sobre tu consulta..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" variant="hero" className="w-full">
                        Enviar mensaje
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-border hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="bg-gradient-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Escríbenos directamente
                    </p>
                    <a 
                      href="mailto:soporte@landflow.com" 
                      className="text-primary hover:underline text-sm"
                    >
                      soporte@landflow.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-border hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="bg-gradient-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Chat en vivo</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Lun - Vie, 9:00 - 18:00 CET
                    </p>
                    <button className="text-primary hover:underline text-sm">
                      Iniciar chat
                    </button>
                  </CardContent>
                </Card>

                <Card className="border-border hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="bg-gradient-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Teléfono</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Soporte telefónico
                    </p>
                    <a 
                      href="tel:+34900000000" 
                      className="text-primary hover:underline text-sm"
                    >
                      +34 900 000 000
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
