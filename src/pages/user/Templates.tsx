import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, FileText, Eye, Copy, Star } from "lucide-react";

const emailTemplates = [
  {
    id: 1,
    name: "Newsletter Semanal",
    category: "newsletter",
    description: "Plantilla moderna para newsletters semanales",
    thumbnail: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400",
    rating: 4.8,
    uses: 1234
  },
  {
    id: 2,
    name: "Promoción Flash",
    category: "promotional",
    description: "Email promocional con cuenta regresiva",
    thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
    rating: 4.6,
    uses: 982
  },
  {
    id: 3,
    name: "Bienvenida",
    category: "transactional",
    description: "Email de bienvenida para nuevos suscriptores",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
    rating: 4.9,
    uses: 2156
  },
  {
    id: 4,
    name: "Carrito Abandonado",
    category: "transactional",
    description: "Recupera ventas de carritos abandonados",
    thumbnail: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
    rating: 4.7,
    uses: 1543
  },
  {
    id: 5,
    name: "Evento Especial",
    category: "newsletter",
    description: "Invitación elegante para eventos",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400",
    rating: 4.5,
    uses: 876
  },
  {
    id: 6,
    name: "Encuesta Feedback",
    category: "transactional",
    description: "Solicita opiniones de tus clientes",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    rating: 4.4,
    uses: 654
  }
];

const landingTemplates = [
  {
    id: 1,
    name: "SaaS Moderno",
    category: "saas",
    description: "Landing page para productos SaaS",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    rating: 4.9,
    uses: 3421
  },
  {
    id: 2,
    name: "E-commerce",
    category: "ecommerce",
    description: "Página de producto con carrito",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    rating: 4.7,
    uses: 2198
  },
  {
    id: 3,
    name: "Captura de Leads",
    category: "leadgen",
    description: "Formulario de captación optimizado",
    thumbnail: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400",
    rating: 4.8,
    uses: 1876
  },
  {
    id: 4,
    name: "Webinar",
    category: "event",
    description: "Registro para webinars y eventos online",
    thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400",
    rating: 4.6,
    uses: 1342
  }
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plantillas</h1>
        <p className="text-muted-foreground mt-2">
          Elige entre cientos de plantillas profesionales para emails y landing pages
        </p>
      </div>

      <Tabs defaultValue="emails" className="space-y-6">
        <TabsList>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="landings" className="gap-2">
            <FileText className="h-4 w-4" />
            Landing Pages
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              Todas
            </Button>
            <Button
              variant={selectedCategory === "popular" ? "default" : "outline"}
              onClick={() => setSelectedCategory("popular")}
            >
              Populares
            </Button>
            <Button
              variant={selectedCategory === "new" ? "default" : "outline"}
              onClick={() => setSelectedCategory("new")}
            >
              Nuevas
            </Button>
          </div>
        </div>

        <TabsContent value="emails" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        Vista Previa
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Copy className="h-4 w-4 mr-2" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{template.rating}</span>
                      </div>
                      <span>{template.uses.toLocaleString()} usos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="landings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-2" />
                        Vista Previa
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Copy className="h-4 w-4 mr-2" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{template.rating}</span>
                      </div>
                      <span>{template.uses.toLocaleString()} usos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Templates;