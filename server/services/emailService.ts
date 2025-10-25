import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { storage } from '../storage';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private config: any = null;

  async loadSMTPConfig() {
    try {
      const settings = await storage.getSettings();
      
      if (!settings || !settings.smtpHost || !settings.smtpPort || !settings.smtpUser || !settings.smtpPassword) {
        throw new Error('Configuración SMTP incompleta. Por favor configura el servidor SMTP en Admin > Configuración');
      }

      this.config = settings;
      
      this.transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465,
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPassword,
        },
      });

      await this.transporter.verify();
      console.log('✅ SMTP configurado correctamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error configurando SMTP:', error);
      this.transporter = null;
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      await this.loadSMTPConfig();
    }

    if (!this.transporter) {
      throw new Error('No se pudo configurar el servicio de email');
    }

    const fromAddress = options.from || this.config?.fromEmail || this.config?.smtpUser;
    const fromName = this.config?.fromName || 'LandFlow';

    const mailOptions = {
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      replyTo: options.replyTo || this.config?.replyToEmail || fromAddress,
      subject: options.subject,
      html: options.html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  personalizeContent(content: string, variables: Record<string, any>): string {
    let personalizedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      personalizedContent = personalizedContent.replace(regex, value || '');
    });
    
    return personalizedContent;
  }

  async sendBulkEmails(recipients: Array<{ email: string; variables?: Record<string, any> }>, subject: string, content: string): Promise<Array<{ email: string; status: string; error?: string }>> {
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

  async testConnection(): Promise<boolean> {
    try {
      await this.loadSMTPConfig();
      return true;
    } catch {
      return false;
    }
  }
}

export const emailService = new EmailService();
