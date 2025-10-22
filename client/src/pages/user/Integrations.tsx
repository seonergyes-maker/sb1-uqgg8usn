import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, Plus, Settings, ExternalLink, 
  Facebook, Linkedin, Twitter, ShoppingBag 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const integrations = [
  {
    id: 1,
    name: "Zapier",
    description: "Conecta con 5000+ aplicaciones",
    icon: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100",
    category: "automation",
    connected: true,
    popular: true
  },
  {
    id: 2,
    name: "Salesforce",
    description: "CRM líder del mercado",
    icon: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
    category: "crm",
    connected: false,
    popular: true
  },
  {
    id: 3,
    name: "HubSpot",
    description: "CRM y marketing automation",
    icon: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=100",
    category: "crm",
    connected: true,
    popular: true
  },
  {
    id: 4,
    name: "Shopify",
    description: "Plataforma de e-commerce",
    icon: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100",
    category: "ecommerce",
    connected: false,
    popular: true
  },
  {
    id: 5,
    name: "WooCommerce",
    description: "E-commerce para WordPress",
    icon: "https://images.unsplash.com/photo-1556742400-b5b7e5f27d3d?w=100",
    category: "ecommerce",
    connected: false,
    popular: false
  },
  {
    id: 6,
    name: "Google Analytics",
    description: "Analítica web avanzada",
    icon: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=100",
    category: "analytics",
    connected: true,
    popular: true
  },
  {
    id: 7,
    name: "Facebook Pixel",
    description: "Tracking de conversiones",
    icon: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100",
    category: "analytics",
    connected: false,
    popular: true
  },
  {
    id: 8,
    name: "Stripe",
    description: "Procesamiento de pagos",
    icon: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=100",
    category: "payment",
    connected: true,
    popular: true
  },
  {
    id: 9,
    name: "Pipedrive",
    description: "CRM para ventas",
    icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100",
    category: "crm",
    connected: false,
    popular: false
  },
  {
    id: 10,
    name: "Slack",
    description: "Notificaciones en tiempo real",
    icon: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100",
    category: "automation",
    connected: false,
    popular: false
  }
];

const socialIntegrations = [
  { name: "Facebook Ads", icon: Facebook, connected: false },
  { name: "LinkedIn Ads", icon: Linkedin, connected: true },
  { name: "Twitter Ads", icon: Twitter, connected: false }
];

const Integrations = () => {
  const connectedCount = integrations.filter(i => i.connected).length;
  const popularIntegrations = integrations.filter(i => i.popular);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integraciones</h1>
          <p className="text-muted-foreground mt-2">
            Conecta LandFlow con tus herramientas favoritas
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Documentación API
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Integraciones Activas</CardDescription>
            <CardTitle className="text-3xl">{connectedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {integrations.length} disponibles
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Más Populares</CardDescription>
            <CardTitle className="text-3xl">{popularIntegrations.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Recomendadas para ti
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categorías</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              CRM, Analytics, E-commerce...
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redes Sociales */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>
            Conecta tus cuentas publicitarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialIntegrations.map((social) => (
              <div key={social.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <social.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{social.name}</span>
                </div>
                {social.connected ? (
                  <Badge variant="default">
                    <Check className="h-3 w-3 mr-1" />
                    Conectado
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">Conectar</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Integraciones */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Integraciones</CardTitle>
          <CardDescription>
            Explora y conecta con las mejores herramientas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img 
                            src={integration.icon} 
                            alt={integration.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          {integration.popular && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>

                    <div className="flex gap-2">
                      {integration.connected ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Configurar
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Desconectar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>¿Desconectar {integration.name}?</DialogTitle>
                                <DialogDescription>
                                  Esta acción detendrá la sincronización de datos entre LandFlow y {integration.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancelar</Button>
                                <Button variant="destructive">Desconectar</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full">
                              <Plus className="h-3 w-3 mr-1" />
                              Conectar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Conectar con {integration.name}</DialogTitle>
                              <DialogDescription>
                                Introduce tus credenciales para conectar
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>API Key</Label>
                                <Input type="password" placeholder="sk_live_..." />
                              </div>
                              <div>
                                <Label>API Secret (Opcional)</Label>
                                <Input type="password" placeholder="********" />
                              </div>
                              <Button className="w-full">Conectar</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Pública */}
      <Card>
        <CardHeader>
          <CardTitle>API Pública</CardTitle>
          <CardDescription>
            Accede a todas las funcionalidades de LandFlow mediante nuestra API REST
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tu API Key</span>
              <Button variant="ghost" size="sm">
                Regenerar
              </Button>
            </div>
            <code className="block text-sm bg-background p-3 rounded border">
              lf_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx
            </code>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Documentación
            </Button>
            <Button variant="outline" className="flex-1">
              Ejemplos de Código
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;