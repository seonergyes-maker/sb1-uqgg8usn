import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Mail, Clock, ArrowDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Segment, Email } from "@shared/schema";

interface AutomationAction {
  type: 'send_email' | 'wait';
  emailId?: number;
  emailName?: string;
  duration?: number;
  unit?: 'minutes' | 'hours' | 'days';
}

interface AutomationBuilderProps {
  trigger: string;
  triggerSegmentId?: number;
  actions: AutomationAction[];
  onTriggerChange: (trigger: string) => void;
  onTriggerSegmentChange: (segmentId: number | undefined) => void;
  onActionsChange: (actions: AutomationAction[]) => void;
}

export function AutomationBuilder({
  trigger,
  triggerSegmentId,
  actions,
  onTriggerChange,
  onTriggerSegmentChange,
  onActionsChange,
}: AutomationBuilderProps) {
  const { user } = useAuth();
  const clientId = user?.id || 0;

  // Fetch segments for trigger selection
  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: ["/api/segments", clientId],
    queryFn: () =>
      fetch(`/api/segments?clientId=${clientId}`).then((res) => res.json()),
  });

  // Fetch emails for action selection
  const { data: emails = [] } = useQuery<Email[]>({
    queryKey: ["/api/emails", clientId],
    queryFn: () =>
      fetch(`/api/emails?clientId=${clientId}`).then((res) => res.json()),
  });

  const addAction = () => {
    onActionsChange([...actions, { type: 'send_email' }]);
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    onActionsChange(newActions);
  };

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    
    // If changing type, reset type-specific fields
    if (updates.type) {
      if (updates.type === 'send_email') {
        delete newActions[index].duration;
        delete newActions[index].unit;
      } else if (updates.type === 'wait') {
        delete newActions[index].emailId;
        delete newActions[index].emailName;
      }
    }
    
    onActionsChange(newActions);
  };

  const getTriggerLabel = (triggerType: string) => {
    switch (triggerType) {
      case 'segment_enter':
        return 'Lead entra al segmento';
      case 'segment_exit':
        return 'Lead sale del segmento';
      case 'segment_belongs':
        return 'Lead pertenece al segmento';
      default:
        return 'Selecciona un trigger';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trigger Configuration */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            Configurar Trigger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipo de Trigger</Label>
            <Select
              value={trigger}
              onValueChange={onTriggerChange}
            >
              <SelectTrigger data-testid="select-trigger-type">
                <SelectValue placeholder="Selecciona un trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="segment_enter">Lead entra al segmento</SelectItem>
                <SelectItem value="segment_exit">Lead sale del segmento</SelectItem>
                <SelectItem value="segment_belongs">Lead pertenece al segmento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {trigger && (
            <div>
              <Label>Segmento</Label>
              <Select
                value={triggerSegmentId?.toString() || ""}
                onValueChange={(value) => onTriggerSegmentChange(parseInt(value))}
              >
                <SelectTrigger data-testid="select-trigger-segment">
                  <SelectValue placeholder="Selecciona un segmento" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id.toString()}>
                      {segment.name} ({segment.leadCount} leads)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Builder */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">2</span>
            </div>
            Configurar Acciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay acciones configuradas. Agrega la primera acción para comenzar.
            </p>
          ) : (
            actions.map((action, index) => (
              <div key={index} className="space-y-3">
                {index > 0 && (
                  <div className="flex justify-center">
                    <ArrowDown className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                
                <Card className="border-dashed">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Acción {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAction(index)}
                        data-testid={`button-remove-action-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label>Tipo de Acción</Label>
                      <Select
                        value={action.type}
                        onValueChange={(value: 'send_email' | 'wait') =>
                          updateAction(index, { type: value })
                        }
                      >
                        <SelectTrigger data-testid={`select-action-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send_email">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Enviar Email
                            </div>
                          </SelectItem>
                          <SelectItem value="wait">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Esperar
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {action.type === 'send_email' && (
                      <div>
                        <Label>Email a Enviar</Label>
                        <Select
                          value={action.emailId?.toString() || ""}
                          onValueChange={(value) => {
                            const email = emails.find(e => e.id === parseInt(value));
                            updateAction(index, { 
                              emailId: parseInt(value),
                              emailName: email?.name 
                            });
                          }}
                        >
                          <SelectTrigger data-testid={`select-email-${index}`}>
                            <SelectValue placeholder="Selecciona un email" />
                          </SelectTrigger>
                          <SelectContent>
                            {emails.map((email) => (
                              <SelectItem key={email.id} value={email.id.toString()}>
                                {email.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {action.type === 'wait' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Duración</Label>
                          <Input
                            type="number"
                            min="1"
                            value={action.duration || ""}
                            onChange={(e) =>
                              updateAction(index, { duration: parseInt(e.target.value) || 1 })
                            }
                            placeholder="Ej: 2"
                            data-testid={`input-wait-duration-${index}`}
                          />
                        </div>
                        <div>
                          <Label>Unidad</Label>
                          <Select
                            value={action.unit || "hours"}
                            onValueChange={(value: 'minutes' | 'hours' | 'days') =>
                              updateAction(index, { unit: value })
                            }
                          >
                            <SelectTrigger data-testid={`select-wait-unit-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutos</SelectItem>
                              <SelectItem value="hours">Horas</SelectItem>
                              <SelectItem value="days">Días</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={addAction}
            data-testid="button-add-action"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Acción
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
