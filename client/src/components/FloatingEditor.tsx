import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FloatingEditorProps {
  landingId: number;
  landingSlug: string;
}

export default function FloatingEditor({ landingId, landingSlug }: FloatingEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const contentElement = document.querySelector('[data-testid="landing-content"]');
      if (!contentElement) throw new Error("Content element not found");
      
      const updatedContent = contentElement.innerHTML;
      
      await apiRequest(`/api/landings/${landingId}`, {
        method: "PATCH",
        body: JSON.stringify({ content: updatedContent }),
        headers: { "Content-Type": "application/json" }
      });
      
      return updatedContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/public/landings", landingSlug] });
      toast({
        title: "Guardado exitoso",
        description: "Los cambios se han guardado correctamente",
      });
      setIsEditing(false);
      
      // Disable content editable
      const editableElements = document.querySelectorAll('[contenteditable="true"]');
      editableElements.forEach(el => {
        el.setAttribute("contenteditable", "false");
      });
    },
    onError: (error) => {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Intenta de nuevo.",
        variant: "destructive"
      });
      console.error("Error saving landing:", error);
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    
    // Enable content editable for all elements with contenteditable attribute
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
      el.setAttribute("contenteditable", "true");
      (el as HTMLElement).style.outline = "2px dashed rgba(102, 126, 234, 0.5)";
      (el as HTMLElement).style.outlineOffset = "4px";
    });

    toast({
      title: "Modo edición activado",
      description: "Haz clic en cualquier texto para editarlo",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    // Disable content editable and remove outline
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => {
      el.setAttribute("contenteditable", "false");
      (el as HTMLElement).style.outline = "none";
    });
    
    // Reload to discard changes
    window.location.reload();
  };

  const handleSave = () => {
    // Remove outline from all elements before saving
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(el => {
      (el as HTMLElement).style.outline = "none";
    });
    
    saveMutation.mutate();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {isEditing ? (
        <>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            data-testid="button-save-landing"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="shadow-lg"
            data-testid="button-cancel-edit"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </>
      ) : (
        <Button
          onClick={handleEdit}
          className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          data-testid="button-edit-landing"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Editar
        </Button>
      )}
    </div>
  );
}
