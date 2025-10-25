import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { storage } from '../storage';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  clientId?: number; // User ID for multi-tenant SMTP
}

class EmailService {
  private transporterCache: Map<number | string, Transporter> = new Map();
  private configCache: Map<number | string, any> = new Map();

  async loadSMTPConfig(clientId?: number) {
    try {
      const cacheKey = clientId || 'admin';
      let settings;

      if (clientId) {
        // Load user-specific SMTP config from clients table
        const client = await storage.getClientById(clientId);
        
        if (!client || !client.smtpHost || !client.smtpPort || !client.smtpUser || !client.smtpPassword) {
          throw new Error('Configuración SMTP incompleta. Por favor configura tu servidor SMTP en Configuración');
        }
        settings = client;
      } else {
        // Load admin SMTP config (backward compatibility)
        settings = await storage.getSettings();
        
        if (!settings || !settings.smtpHost || !settings.smtpPort || !settings.smtpUser || !settings.smtpPassword) {
          throw new Error('Configuración SMTP incompleta. Por favor configura el servidor SMTP en Admin > Configuración');
        }
      }

      this.configCache.set(cacheKey, settings);
      
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465,
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPassword,
        },
      });

      await transporter.verify();
      this.transporterCache.set(cacheKey, transporter);
      console.log(`✅ SMTP configurado correctamente para: ${cacheKey}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error configurando SMTP:', error);
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const cacheKey = options.clientId || 'admin';
    let transporter = this.transporterCache.get(cacheKey);
    
    if (!transporter) {
      await this.loadSMTPConfig(options.clientId);
      transporter = this.transporterCache.get(cacheKey);
    }

    if (!transporter) {
      throw new Error('No se pudo configurar el servicio de email');
    }

    const config = this.configCache.get(cacheKey);
    const fromAddress = options.from || config?.fromEmail || config?.smtpUser;
    const fromName = config?.fromName || 'LandFlow';

    const mailOptions = {
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      replyTo: options.replyTo || config?.replyTo || config?.replyToEmail || fromAddress,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  }

  personalizeContent(content: string, variables: Record<string, any>): string {
    let personalizedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      personalizedContent = personalizedContent.replace(regex, value || '');
    });
    
    return personalizedContent;
  }

  async sendBulkEmails(recipients: Array<{ email: string; variables?: Record<string, any> }>, subject: string, content: string, clientId?: number): Promise<Array<{ email: string; status: string; error?: string }>> {
    const results = [];

    for (const recipient of recipients) {
      try {
        const variables = {
          email: recipient.email,
          unsubscribe_link: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/unsubscribe?email=${encodeURIComponent(recipient.email)}`,
          ...recipient.variables
        };

        const personalizedSubject = this.personalizeContent(subject, variables);
        const personalizedContent = this.personalizeContent(content, variables);

        await this.sendEmail({
          to: recipient.email,
          subject: personalizedSubject,
          html: personalizedContent,
          clientId,
        });

        results.push({
          email: recipient.email,
          status: 'sent',
        });
        
        console.log(`✅ Email enviado a: ${recipient.email}`);
      } catch (error: any) {
        results.push({
          email: recipient.email,
          status: 'failed',
          error: error.message,
        });
        
        console.error(`❌ Error enviando a ${recipient.email}:`, error.message);
      }
    }

    return results;
  }

  async testConnection(clientId?: number): Promise<boolean> {
    try {
      await this.loadSMTPConfig(clientId);
      return true;
    } catch {
      return false;
    }
  }
}

export const emailService = new EmailService();
