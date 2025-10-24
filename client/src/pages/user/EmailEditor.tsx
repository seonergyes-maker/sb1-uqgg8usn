import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save, X, Eye, EyeOff, RefreshCw, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateSelector } from "@/components/TemplateSelector";

interface Email {
  id: number;
  clientId: number;
  name: string;
  subject: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailVariable {
  name: string;
  variable: string;
  description: string;
  example: string;
}

// Variables disponibles para los emails
const EMAIL_VARIABLES: EmailVariable[] = [
  {
    name: 'Nombre del Lead',
    variable: '{{lead_name}}',
    description: 'Nombre del contacto',
    example: 'Juan Pérez',
  },
  {
    name: 'Email del Lead',
    variable: '{{lead_email}}',
    description: 'Dirección de email del contacto',
    example: 'juan@ejemplo.com',
  },
  {
    name: 'Nombre de la Empresa',
    variable: '{{company_name}}',
    description: 'Nombre de tu empresa',
    example: 'Mi Empresa SL',
  },
  {
    name: 'Email de la Empresa',
    variable: '{{company_email}}',
    description: 'Email de contacto de tu empresa',
    example: 'contacto@miempresa.com',
  },
  {
    name: 'Dirección de la Empresa',
    variable: '{{company_address}}',
    description: 'Dirección física de tu empresa',
    example: 'Calle Principal 123, Madrid',
  },
  {
    name: 'Link de Desuscripción',
    variable: '{{unsubscribe_link}}',
    description: 'Link para que el usuario se dé de baja (OBLIGATORIO)',
    example: 'https://tudominio.com/unsubscribe/...',
  },
];

const EmailEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/panel/emails/:id/edit");
  const emailId = params && params.id ? parseInt(params.id) : null;
  const clientId = user?.id || 0;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  // Fetch email data
  const { data: email, isLoading } = useQuery<Email>({
    queryKey: ["/api/emails", clientId, emailId],
    queryFn: () => fetch(`/api/emails/${clientId}/${emailId}`).then(res => res.json()),
    enabled: !!emailId && !!clientId,
  });

  // Update content when email loads
  useEffect(() => {
    if (email) {
      setContent(email.content);
      setOriginalContent(email.content);
    }
  }, [email]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      apiRequest(`/api/emails/${emailId}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails", clientId, emailId] });
      setIsEditing(false);
      setOriginalContent(content);
      toast({
        title: "Email guardado",
        description: "Los cambios se han guardado correctamente.",
      });
      // Reload page to show updated content
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error al guardar",
        description: error?.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!content.includes('{{unsubscribe_link}}')) {
      toast({
        title: "Variable obligatoria faltante",
        description: "El email debe incluir la variable {{unsubscribe_link}} para cumplir con las normativas.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({ content });
  };

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
    // Remove contentEditable from all elements
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((el) => {
      el.setAttribute('contenteditable', 'false');
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Enable contentEditable on the preview container
    setTimeout(() => {
      const previewContainer = document.getElementById('email-preview-container');
      if (previewContainer) {
        previewContainer.setAttribute('contenteditable', 'true');
        previewContainer.focus();
      }
    }, 100);
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast({
      title: "Variable copiada",
      description: `${variable} copiado al portapapeles.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando email...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Email no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Barra superior con variables */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex items-center gap-4 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation("/panel/emails")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">Variables Disponibles:</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMAIL_VARIABLES.map((variable) => (
                <Badge
                  key={variable.variable}
                  variant={variable.variable === '{{unsubscribe_link}}' ? "destructive" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    variable.variable === '{{unsubscribe_link}}' 
                      ? "font-semibold hover:bg-destructive/80" 
                      : "hover:bg-secondary/80"
                  }`}
                  onClick={() => copyVariable(variable.variable)}
                  title={`${variable.description} - Click para copiar`}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {variable.variable}
                  {variable.variable === '{{unsubscribe_link}}' && " (OBLIGATORIA)"}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del email */}
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{email.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Asunto: {email.subject}</p>
          </div>
        </div>

        {/* Preview del email */}
        <div className="bg-white border rounded-lg shadow-sm p-8">
          <div
            id="email-preview-container"
            className={`min-h-[600px] ${isEditing ? 'outline outline-2 outline-primary' : ''}`}
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => {
              if (isEditing) {
                setContent(e.currentTarget.innerHTML);
              }
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
          />
        </div>
      </div>

      {/* Floating Editor Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        {!isEditing ? (
          <>
            <Button
              onClick={handleEdit}
              size="lg"
              data-testid="button-edit"
              className="shadow-lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setTemplateSelectorOpen(true)}
              size="lg"
              data-testid="button-change-template"
              className="shadow-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Cambiar Template
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/panel/emails")}
              size="lg"
              data-testid="button-back-panel"
              className="shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              size="lg"
              data-testid="button-save"
              className="shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              size="lg"
              data-testid="button-cancel"
              className="shadow-lg"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </>
        )}
      </div>

      {/* Template Selector Dialog */}
      <Dialog open={templateSelectorOpen} onOpenChange={setTemplateSelectorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Cambiar Template de Email</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] p-4">
            <TemplateSelector
              type="Email"
              onSelect={(template) => {
                if (template.content) {
                  setContent(template.content);
                  setTemplateSelectorOpen(false);
                  toast({
                    title: "Template aplicado",
                    description: "El nuevo template se ha aplicado correctamente. Recuerda guardar los cambios.",
                  });
                }
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailEditor;