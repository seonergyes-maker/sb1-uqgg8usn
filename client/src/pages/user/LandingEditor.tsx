import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, Eye, Globe, Image, Type, Layout, Square, 
  Video, List, Smartphone, Monitor, Tablet, Code
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const LandingEditor = () => {
  const [pageName, setPageName] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [publishedUrl, setPublishedUrl] = useState("landflow.app/tu-landing");

  const sections = [
    { icon: Layout, label: "Hero", type: "hero" },
    { icon: Type, label: "Texto", type: "text" },
    { icon: Image, label: "Imagen", type: "image" },
    { icon: Video, label: "Video", type: "video" },
    { icon: Square, label: "CTA", type: "cta" },
    { icon: List, label: "Features", type: "features" },
    { icon: Layout, label: "Testimonios", type: "testimonials" },
    { icon: Code, label: "Formulario", type: "form" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor de Landing Pages</h1>
          <p className="text-muted-foreground mt-2">
            Construye landing pages de alta conversión
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button size="sm">
            <Globe className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Secciones */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Secciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => (
              <Button
                key={section.type}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Editor */}
        <div className="col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nombre de la Página</Label>
                  <Input
                    placeholder="Ej: Landing Producto X"
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>URL Publicada</Label>
                  <div className="flex gap-2">
                    <Input
                      value={publishedUrl}
                      onChange={(e) => setPublishedUrl(e.target.value)}
                    />
                    <Button variant="outline">
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="min-h-[700px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Canvas de Diseño</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className={`mx-auto bg-white border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 min-h-[600px] transition-all ${
                previewDevice === "desktop" ? "max-w-full" : 
                previewDevice === "tablet" ? "max-w-3xl" : "max-w-sm"
              }`}>
                <div className="text-center text-muted-foreground">
                  <Layout className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">Arrastra secciones aquí</p>
                  <p className="text-sm mt-2">
                    Construye tu landing page arrastrando secciones desde el panel izquierdo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuración */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-sm">Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="design">Diseño</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              <TabsContent value="design" className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs">Color primario</Label>
                  <div className="flex gap-2 mt-2">
                    <Input type="color" defaultValue="#8B5CF6" className="h-10" />
                    <Input placeholder="#8B5CF6" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Fuente</Label>
                  <select className="w-full h-10 px-3 rounded-md border bg-background">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Modo oscuro</Label>
                  <Switch />
                </div>
              </TabsContent>
              <TabsContent value="seo" className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs">Meta Title</Label>
                  <Input placeholder="Título de la página" />
                </div>
                <div>
                  <Label className="text-xs">Meta Description</Label>
                  <Input placeholder="Descripción para SEO" />
                </div>
                <div>
                  <Label className="text-xs">Keywords</Label>
                  <Input placeholder="palabra1, palabra2" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingEditor;