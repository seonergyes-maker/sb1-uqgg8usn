import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, MoreVertical, ExternalLink, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const landings = [
  {
    id: "1",
    title: "Oferta Black Friday 2024",
    url: "blackfriday2024.landflow.app",
    status: "Publicada",
    views: "3,240",
    conversions: "248",
    rate: "7.6%",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=250&fit=crop"
  },
  {
    id: "2",
    title: "Webinar Marketing Digital",
    url: "webinar-marketing.landflow.app",
    status: "Publicada",
    views: "2,180",
    conversions: "186",
    rate: "8.5%",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop"
  },
  {
    id: "3",
    title: "Guía Email Marketing PDF",
    url: "guia-email.landflow.app",
    status: "Publicada",
    views: "1,920",
    conversions: "142",
    rate: "7.4%",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop"
  },
  {
    id: "4",
    title: "Prueba Gratis 14 Días",
    url: "prueba-gratis.landflow.app",
    status: "Borrador",
    views: "-",
    conversions: "-",
    rate: "-",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
  }
];

const Landings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Landings</h2>
          <p className="text-muted-foreground">
            Crea y gestiona tus páginas de captura
          </p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 h-4 w-4" />
          Nueva landing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Total landings</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mt-1">8 publicadas</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Visitas totales</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24,580</p>
            <p className="text-xs text-primary mt-1">+18.2% este mes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Conversiones</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,842</p>
            <p className="text-xs text-green-500 mt-1">7.5% tasa promedio</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <span className="text-sm font-medium text-muted-foreground">Mejor tasa</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Webinar Marketing</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar landings..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landings.map((landing) => (
              <Card key={landing.id} className="border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                <div className="relative h-40 bg-secondary overflow-hidden">
                  <img 
                    src={landing.image} 
                    alt={landing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={landing.status === "Publicada" ? "default" : "secondary"}>
                      {landing.status}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{landing.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Vista previa
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar URL
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <a 
                    href={`https://${landing.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {landing.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Visitas</p>
                      <p className="text-lg font-bold">{landing.views}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversiones</p>
                      <p className="text-lg font-bold">{landing.conversions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa</p>
                      <p className="text-lg font-bold text-primary">{landing.rate}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border pt-4">
                  <Button variant="outline" className="w-full">
                    Ver estadísticas
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landings;
