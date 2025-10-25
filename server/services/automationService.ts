import { storage } from '../storage';
import { emailService } from './emailService';

interface AutomationAction {
  type: string;
  emailId?: number;
  delay?: number;
  subject?: string;
}

class AutomationService {
  async triggerAutomations(trigger: string, leadId: number, clientId: number) {
    try {
      const automations = await storage.getAutomations(clientId, { status: 'Activa' });
      
      const matchingAutomations = automations.filter(automation => {
        return automation.trigger === trigger && automation.status === 'Activa';
      });

      console.log(`🔔 Trigger '${trigger}' activado para lead ${leadId}, ${matchingAutomations.length} automatizaciones encontradas`);

      for (const automation of matchingAutomations) {
        await this.executeAutomation(automation, leadId);
      }
    } catch (error) {
      console.error('Error ejecutando automatizaciones:', error);
    }
  }

  async executeAutomation(automation: any, leadId: number) {
    try {
      let actions: AutomationAction[] = [];
      
      try {
        const parsedActions = JSON.parse(automation.actions);
        if (Array.isArray(parsedActions)) {
          actions = parsedActions;
        } else if (parsedActions.emails && Array.isArray(parsedActions.emails)) {
          actions = parsedActions.emails.map((emailAction: any) => ({
            type: 'send_email',
            emailId: emailAction.emailId,
            delay: emailAction.delay || 0,
            subject: emailAction.subject,
          }));
        }
      } catch (parseError) {
        console.error(`Error parseando acciones de automatización ${automation.id}:`, parseError);
        return;
      }

      if (actions.length === 0) {
        console.log(`⚠️ Automatización ${automation.id} no tiene acciones definidas`);
        return;
      }

      const lead = await storage.getLeadById(leadId);
      if (!lead) {
        console.error(`Lead ${leadId} no encontrado`);
        return;
      }

      console.log(`🚀 Ejecutando automatización "${automation.name}" para lead ${lead.email}`);

      for (const action of actions) {
        if (action.type === 'send_email' && action.emailId) {
          const delayMs = (action.delay || 0) * 24 * 60 * 60 * 1000;
          
          if (delayMs > 0) {
            console.log(`⏱️ Email programado para envío en ${action.delay} días`);
            await this.scheduleEmail(automation.id, leadId, action.emailId, delayMs);
          } else {
            await this.sendAutomationEmail(automation.id, leadId, action.emailId);
          }
        }
      }

      await storage.updateAutomation(automation.id, {
        executionCount: automation.executionCount + 1,
      });
    } catch (error) {
      console.error(`Error ejecutando automatización ${automation.id}:`, error);
    }
  }

  async sendAutomationEmail(automationId: number, leadId: number, emailId: number) {
    try {
      const email = await storage.getEmailById(emailId);
      if (!email) {
        console.error(`Email ${emailId} no encontrado`);
        return;
      }

      const lead = await storage.getLeadById(leadId);
      if (!lead) {
        console.error(`Lead ${leadId} no encontrado`);
        return;
      }

      const recipients = [{
        email: lead.email,
        variables: {
          nombre: lead.name,
          empresa: lead.company || '',
        }
      }];

      // Use lead's client SMTP configuration for multi-tenant support
      const results = await emailService.sendBulkEmails(recipients, email.subject, email.content, lead.clientId);
      
      const successCount = results.filter(r => r.status === 'sent').length;
      console.log(`✅ Email de automatización enviado: ${email.name} → ${lead.email}`);

      return successCount > 0;
    } catch (error) {
      console.error(`Error enviando email de automatización:`, error);
      return false;
    }
  }

  async scheduleEmail(automationId: number, leadId: number, emailId: number, delayMs: number) {
    try {
      const scheduledFor = new Date(Date.now() + delayMs);
      
      const email = await storage.getEmailById(emailId);
      const lead = await storage.getLeadById(leadId);
      
      if (!email || !lead) {
        console.error('Email o Lead no encontrado para programación');
        return;
      }

      await storage.createScheduledTask({
        clientId: lead.clientId,
        name: `Envío automático: ${email.name}`,
        description: `Envío programado para ${lead.email} como parte de la automatización ${automationId}`,
        taskType: 'send_automation_email',
        referenceId: emailId,
        referenceName: JSON.stringify({ automationId, leadId, emailId }),
        scheduledFor: scheduledFor.toISOString(),
        status: 'Programada',
        recurrence: 'none',
      });

      console.log(`📅 Email programado: ${email.name} → ${lead.email} para ${scheduledFor.toLocaleString()}`);
    } catch (error) {
      console.error('Error programando email:', error);
    }
  }

  async processScheduledTasks() {
    try {
      const now = new Date().toISOString();
      const tasks = await storage.getScheduledTasks({ status: 'Programada' });
      
      const dueTasks = tasks.filter(task => task.scheduledFor <= now);

      for (const task of dueTasks) {
        if (task.taskType === 'send_automation_email') {
          try {
            const taskData = JSON.parse(task.referenceName || '{}');
            const { automationId, leadId, emailId } = taskData;
            
            const success = await this.sendAutomationEmail(automationId, leadId, emailId);
            
            await storage.updateScheduledTask(task.id, {
              status: success ? 'Completada' : 'Fallida',
              executedAt: new Date().toISOString(),
              result: success ? 'Email enviado exitosamente' : 'Error al enviar email',
            });
          } catch (error: any) {
            await storage.updateScheduledTask(task.id, {
              status: 'Fallida',
              executedAt: new Date().toISOString(),
              result: error.message,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error procesando tareas programadas:', error);
    }
  }
}

export const automationService = new AutomationService();

setInterval(() => {
  automationService.processScheduledTasks();
}, 60000);
