import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, Eye, Send, Image, Type, Layout, Square, 
  AlignLeft, Code, Smartphone, Monitor, Tablet 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const EmailEditor = () => {
  const [subject, setSubject] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const components = [
    { icon: Type, label: "Texto", type: "text" },
    { icon: Image, label: "Imagen", type: "image" },
    { icon: Square, label: "Botón", type: "button" },
    { icon: Layout, label: "Columnas", type: "columns" },
    { icon: AlignLeft, label: "Espaciador", type: "spacer" },
    { icon: Code, label: "HTML", type: "html" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor de Emails</h1>
          <p className="text-muted-foreground mt-2">
            Crea emails profesionales con drag & drop
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
            <Send className="h-4 w-4 mr-2" />
            Enviar Prueba
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Componentes */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Componentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {components.map((component) => (
              <Button
                key={component.type}
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <component.icon className="h-4 w-4 mr-2" />
                {component.label}
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
                  <Label>Asunto del Email</Label>
                  <Input
                    placeholder="Ej: ¡Oferta especial solo para ti!"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="min-h-[600px]">
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
              <div className={`mx-auto bg-white border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 min-h-[500px] transition-all ${
                previewDevice === "desktop" ? "max-w-full" : 
                previewDevice === "tablet" ? "max-w-2xl" : "max-w-sm"
              }`}>
                <div className="text-center text-muted-foreground">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Arrastra componentes aquí</p>
                  <p className="text-sm mt-2">
                    Usa los componentes de la izquierda para construir tu email
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Propiedades */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-sm">Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="style">Estilo</TabsTrigger>
                <TabsTrigger value="content">Contenido</TabsTrigger>
              </TabsList>
              <TabsContent value="style" className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs">Color de fondo</Label>
                  <div className="flex gap-2 mt-2">
                    <Input type="color" defaultValue="#ffffff" className="h-10" />
                    <Input placeholder="#ffffff" className="flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Padding</Label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <Label className="text-xs">Tamaño de fuente</Label>
                  <Input type="number" placeholder="16" />
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Selecciona un componente para editar su contenido
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailEditor;