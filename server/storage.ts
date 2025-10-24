import { eq, like, and, or, SQL } from "drizzle-orm";
import { db } from "./db.js";
import { 
  clients, 
  subscriptions,
  payments,
  settings,
  leads,
  segments,
  automations,
  landings,
  templates,
  scheduledTasks,
  emails,
  unsubscribes,
  type Client, 
  type InsertClient, 
  type UpdateClient,
  type Subscription,
  type InsertSubscription,
  type UpdateSubscription,
  type Payment,
  type InsertPayment,
  type UpdatePayment,
  type Settings,
  type InsertSettings,
  type UpdateSettings,
  type Lead,
  type InsertLead,
  type UpdateLead,
  type Segment,
  type InsertSegment,
  type UpdateSegment,
  type Automation,
  type InsertAutomation,
  type UpdateAutomation,
  type Landing,
  type InsertLanding,
  type UpdateLanding,
  type Template,
  type InsertTemplate,
  type UpdateTemplate,
  type ScheduledTask,
  type InsertScheduledTask,
  type UpdateScheduledTask,
  type Email,
  type InsertEmail,
  type UpdateEmail,
  type Unsubscribe,
  type InsertUnsubscribe
} from "../shared/schema.js";

export interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  recentClients: (Client & { daysAgo: number })[];
}

export interface UserStats {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  avgLeadScore: string;
  totalSegments: number;
  totalLeadsSegmented: number;
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  avgSuccessRate: string;
}

export interface IStorage {
  getClients(filters?: { plan?: string; status?: string; search?: string }): Promise<Client[]>;
  getClientById(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: UpdateClient): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  getSubscriptions(filters?: { plan?: string; status?: string; search?: string }): Promise<(Subscription & { clientName: string })[]>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: UpdateSubscription): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<boolean>;
  
  getPayments(filters?: { paymentMethod?: string; paymentStatus?: string; search?: string }): Promise<(Payment & { clientName: string })[]>;
  getPaymentById(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: UpdatePayment): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;
  
  getSettings(): Promise<Settings>;
  updateSettings(settingsData: UpdateSettings): Promise<Settings>;
  
  getDashboardStats(): Promise<DashboardStats>;
  getUserStats(clientId: number): Promise<UserStats>;
  
  getLeads(clientId: number, filters?: { status?: string; source?: string; search?: string }): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: UpdateLead): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  
  getSegments(clientId: number, filters?: { search?: string }): Promise<Segment[]>;
  getSegmentById(id: number): Promise<Segment | undefined>;
  createSegment(segment: InsertSegment): Promise<Segment>;
  updateSegment(id: number, segment: UpdateSegment): Promise<Segment | undefined>;
  deleteSegment(id: number): Promise<boolean>;
  
  getAutomations(clientId: number, filters?: { status?: string; search?: string }): Promise<Automation[]>;
  getAutomationById(id: number): Promise<Automation | undefined>;
  createAutomation(automation: InsertAutomation): Promise<Automation>;
  updateAutomation(id: number, automation: UpdateAutomation): Promise<Automation | undefined>;
  deleteAutomation(id: number): Promise<boolean>;
  
  getLandings(clientId: number, filters?: { status?: string; search?: string }): Promise<Landing[]>;
  getLandingById(id: number): Promise<Landing | undefined>;
  getLandingBySlug(slug: string): Promise<Landing | undefined>;
  createLanding(landing: InsertLanding): Promise<Landing>;
  updateLanding(id: number, landing: UpdateLanding): Promise<Landing | undefined>;
  deleteLanding(id: number): Promise<boolean>;
  
  getTemplates(clientId: number, filters?: { type?: string; category?: string; status?: string; search?: string }): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: UpdateTemplate): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  getScheduledTasks(clientId: number, filters?: { taskType?: string; status?: string; search?: string }): Promise<ScheduledTask[]>;
  getScheduledTaskById(id: number): Promise<ScheduledTask | undefined>;
  createScheduledTask(task: InsertScheduledTask): Promise<ScheduledTask>;
  updateScheduledTask(id: number, task: UpdateScheduledTask): Promise<ScheduledTask | undefined>;
  deleteScheduledTask(id: number): Promise<boolean>;
  
  getEmails(clientId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Email[]>;
  getEmailById(id: number): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: number, email: UpdateEmail): Promise<Email | undefined>;
  deleteEmail(id: number): Promise<boolean>;
  
  getUnsubscribes(clientId: number, filters?: { search?: string }): Promise<Unsubscribe[]>;
  getUnsubscribeByEmail(email: string, clientId: number): Promise<Unsubscribe | undefined>;
  createUnsubscribe(unsubscribe: InsertUnsubscribe): Promise<Unsubscribe>;
}

export class DbStorage implements IStorage {
  async getClients(filters?: { plan?: string; status?: string; search?: string }): Promise<Client[]> {
    const conditions: SQL[] = [];
    
    if (filters?.plan && filters.plan !== 'all') {
      conditions.push(eq(clients.plan, filters.plan));
    }
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(clients.status, filters.status));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(clients.name, `%${filters.search}%`),
        like(clients.email, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      if (whereCondition) {
        return await db.select().from(clients).where(whereCondition);
      }
    }
    
    return await db.select().from(clients);
  }

  async getClientById(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client);
    const insertedId = Number(result[0].insertId);
    const newClient = await this.getClientById(insertedId);
    if (!newClient) {
      throw new Error("Failed to create client");
    }
    return newClient;
  }

  async updateClient(id: number, client: UpdateClient): Promise<Client | undefined> {
    await db.update(clients).set(client).where(eq(clients.id, id));
    return await this.getClientById(id);
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result[0].affectedRows > 0;
  }

  async getSubscriptions(filters?: { plan?: string; status?: string; search?: string }): Promise<(Subscription & { clientName: string })[]> {
    const conditions: SQL[] = [];
    
    if (filters?.plan && filters.plan !== 'all') {
      conditions.push(eq(subscriptions.plan, filters.plan));
    }
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(subscriptions.status, filters.status));
    }
    
    let subs: Subscription[];
    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      if (whereCondition) {
        subs = await db.select().from(subscriptions).where(whereCondition);
      } else {
        subs = await db.select().from(subscriptions);
      }
    } else {
      subs = await db.select().from(subscriptions);
    }
    
    const subsWithClient = await Promise.all(
      subs.map(async (sub) => {
        const client = await this.getClientById(sub.clientId);
        return {
          ...sub,
          clientName: client?.name || 'Unknown'
        };
      })
    );
    
    if (filters?.search) {
      return subsWithClient.filter(sub => 
        sub.clientName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        sub.plan.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    return subsWithClient;
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result[0];
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription);
    const insertedId = Number(result[0].insertId);
    const newSubscription = await this.getSubscriptionById(insertedId);
    if (!newSubscription) {
      throw new Error("Failed to create subscription");
    }
    return newSubscription;
  }

  async updateSubscription(id: number, subscription: UpdateSubscription): Promise<Subscription | undefined> {
    await db.update(subscriptions).set(subscription).where(eq(subscriptions.id, id));
    return await this.getSubscriptionById(id);
  }

  async deleteSubscription(id: number): Promise<boolean> {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));
    return result[0].affectedRows > 0;
  }

  async getPayments(filters?: { paymentMethod?: string; paymentStatus?: string; search?: string }): Promise<(Payment & { clientName: string })[]> {
    const conditions: SQL[] = [];
    
    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      conditions.push(eq(payments.paymentMethod, filters.paymentMethod));
    }
    
    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      conditions.push(eq(payments.paymentStatus, filters.paymentStatus));
    }
    
    let paymentsList: Payment[];
    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      if (whereCondition) {
        paymentsList = await db.select().from(payments).where(whereCondition);
      } else {
        paymentsList = await db.select().from(payments);
      }
    } else {
      paymentsList = await db.select().from(payments);
    }
    
    const paymentsWithClient = await Promise.all(
      paymentsList.map(async (payment) => {
        const client = await this.getClientById(payment.clientId);
        return {
          ...payment,
          clientName: client?.name || 'Unknown'
        };
      })
    );
    
    if (filters?.search) {
      return paymentsWithClient.filter(payment => 
        payment.clientName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(filters.search!.toLowerCase()) ||
        payment.paymentMethod.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    return paymentsWithClient;
  }

  async getPaymentById(id: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment);
    const insertedId = Number(result[0].insertId);
    const newPayment = await this.getPaymentById(insertedId);
    if (!newPayment) {
      throw new Error("Failed to create payment");
    }
    return newPayment;
  }

  async updatePayment(id: number, payment: UpdatePayment): Promise<Payment | undefined> {
    await db.update(payments).set(payment).where(eq(payments.id, id));
    return await this.getPaymentById(id);
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id));
    return result[0].affectedRows > 0;
  }

  async getSettings(): Promise<Settings> {
    const result = await db.select().from(settings).limit(1);
    if (result.length === 0) {
      const defaultSettings = await db.insert(settings).values({});
      const settingsId = Number(defaultSettings[0].insertId);
      const newSettings = await db.select().from(settings).where(eq(settings.id, settingsId)).limit(1);
      return newSettings[0];
    }
    return result[0];
  }

  async updateSettings(settingsData: UpdateSettings): Promise<Settings> {
    const currentSettings = await this.getSettings();
    await db.update(settings).set(settingsData).where(eq(settings.id, currentSettings.id));
    return await this.getSettings();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    // Get total clients
    const allClients = await db.select().from(clients);
    const totalClients = allClients.length;

    // Get active subscriptions
    const activeSubs = await db.select().from(subscriptions).where(eq(subscriptions.status, "active"));
    const activeSubscriptions = activeSubs.length;

    // Calculate monthly revenue (sum of all active subscription prices)
    const monthlyRevenue = activeSubs.reduce((sum, sub) => {
      return sum + parseFloat(sub.price);
    }, 0);

    // Get recent clients (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentClientsData = allClients
      .filter(client => new Date(client.registeredAt) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
      .slice(0, 5)
      .map(client => {
        const daysAgo = Math.floor((Date.now() - new Date(client.registeredAt).getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...client,
          daysAgo
        };
      });

    return {
      totalClients,
      activeSubscriptions,
      monthlyRevenue,
      recentClients: recentClientsData,
    };
  }

  async getLeads(clientId: number, filters?: { status?: string; source?: string; search?: string }): Promise<Lead[]> {
    const conditions: SQL[] = [eq(leads.clientId, clientId)];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(leads.status, filters.status));
    }
    
    if (filters?.source && filters.source !== 'all') {
      conditions.push(eq(leads.source, filters.source));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(leads.name, `%${filters.search}%`),
        like(leads.email, `%${filters.search}%`),
        like(leads.phone, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (whereCondition) {
      return await db.select().from(leads).where(whereCondition);
    }
    
    return await db.select().from(leads).where(eq(leads.clientId, clientId));
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return result[0];
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead);
    const insertedId = Number(result[0].insertId);
    const newLead = await this.getLeadById(insertedId);
    if (!newLead) {
      throw new Error("Failed to create lead");
    }
    return newLead;
  }

  async updateLead(id: number, lead: UpdateLead): Promise<Lead | undefined> {
    await db.update(leads).set(lead).where(eq(leads.id, id));
    return await this.getLeadById(id);
  }

  async deleteLead(id: number): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return result[0].affectedRows > 0;
  }

  async getSegments(clientId: number, filters?: { search?: string }): Promise<Segment[]> {
    const conditions: SQL[] = [eq(segments.clientId, clientId)];
    
    if (filters?.search) {
      const searchCondition = or(
        like(segments.name, `%${filters.search}%`),
        like(segments.description, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (whereCondition) {
      return await db.select().from(segments).where(whereCondition);
    }
    
    return await db.select().from(segments).where(eq(segments.clientId, clientId));
  }

  async getSegmentById(id: number): Promise<Segment | undefined> {
    const result = await db.select().from(segments).where(eq(segments.id, id)).limit(1);
    return result[0];
  }

  async createSegment(segment: InsertSegment): Promise<Segment> {
    const result = await db.insert(segments).values(segment);
    const insertedId = Number(result[0].insertId);
    const newSegment = await this.getSegmentById(insertedId);
    if (!newSegment) {
      throw new Error("Failed to create segment");
    }
    return newSegment;
  }

  async updateSegment(id: number, segment: UpdateSegment): Promise<Segment | undefined> {
    await db.update(segments).set(segment).where(eq(segments.id, id));
    return await this.getSegmentById(id);
  }

  async deleteSegment(id: number): Promise<boolean> {
    const result = await db.delete(segments).where(eq(segments.id, id));
    return result[0].affectedRows > 0;
  }

  async getAutomations(clientId: number, filters?: { status?: string; search?: string }): Promise<Automation[]> {
    const conditions: SQL[] = [eq(automations.clientId, clientId)];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(automations.status, filters.status));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(automations.name, `%${filters.search}%`),
        like(automations.description, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (whereCondition) {
      return await db.select().from(automations).where(whereCondition);
    }
    
    return await db.select().from(automations).where(eq(automations.clientId, clientId));
  }

  async getAutomationById(id: number): Promise<Automation | undefined> {
    const result = await db.select().from(automations).where(eq(automations.id, id)).limit(1);
    return result[0];
  }

  async createAutomation(automation: InsertAutomation): Promise<Automation> {
    const result = await db.insert(automations).values(automation);
    const insertedId = Number(result[0].insertId);
    const newAutomation = await this.getAutomationById(insertedId);
    if (!newAutomation) {
      throw new Error("Failed to create automation");
    }
    return newAutomation;
  }

  async updateAutomation(id: number, automation: UpdateAutomation): Promise<Automation | undefined> {
    await db.update(automations).set(automation).where(eq(automations.id, id));
    return await this.getAutomationById(id);
  }

  async deleteAutomation(id: number): Promise<boolean> {
    const result = await db.delete(automations).where(eq(automations.id, id));
    return result[0].affectedRows > 0;
  }

  async getLandings(clientId: number, filters?: { status?: string; search?: string }): Promise<Landing[]> {
    const conditions: SQL[] = [eq(landings.clientId, clientId)];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(landings.status, filters.status));
    }
    
    let landingsList: Landing[];
    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      if (whereCondition) {
        landingsList = await db.select().from(landings).where(whereCondition);
      } else {
        landingsList = await db.select().from(landings).where(eq(landings.clientId, clientId));
      }
    } else {
      landingsList = await db.select().from(landings).where(eq(landings.clientId, clientId));
    }
    
    if (filters?.search) {
      return landingsList.filter(landing => 
        landing.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        landing.slug.toLowerCase().includes(filters.search!.toLowerCase()) ||
        (landing.title && landing.title.toLowerCase().includes(filters.search!.toLowerCase()))
      );
    }
    
    return landingsList;
  }

  async getLandingById(id: number): Promise<Landing | undefined> {
    const result = await db.select().from(landings).where(eq(landings.id, id)).limit(1);
    return result[0];
  }

  async getLandingBySlug(slug: string): Promise<Landing | undefined> {
    const result = await db.select().from(landings).where(eq(landings.slug, slug)).limit(1);
    return result[0];
  }

  async createLanding(landing: InsertLanding): Promise<Landing> {
    const result = await db.insert(landings).values(landing);
    const insertedId = Number(result[0].insertId);
    const newLanding = await this.getLandingById(insertedId);
    if (!newLanding) {
      throw new Error("Failed to create landing");
    }
    return newLanding;
  }

  async updateLanding(id: number, landing: UpdateLanding): Promise<Landing | undefined> {
    await db.update(landings).set(landing).where(eq(landings.id, id));
    return await this.getLandingById(id);
  }

  async deleteLanding(id: number): Promise<boolean> {
    const result = await db.delete(landings).where(eq(landings.id, id));
    return result[0].affectedRows > 0;
  }

  async getTemplates(clientId: number, filters?: { type?: string; category?: string; status?: string; search?: string }): Promise<Template[]> {
    const conditions: SQL[] = [eq(templates.clientId, clientId)];
    
    if (filters?.type) {
      conditions.push(eq(templates.type, filters.type));
    }
    
    if (filters?.category) {
      conditions.push(eq(templates.category, filters.category));
    }
    
    if (filters?.status) {
      conditions.push(eq(templates.status, filters.status));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(templates.name, `%${filters.search}%`),
          like(templates.description, `%${filters.search}%`)
        )!
      );
    }
    
    const templatesList = await db.select().from(templates).where(and(...conditions));
    return templatesList;
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    return result[0];
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const result = await db.insert(templates).values(template);
    const insertedId = Number(result[0].insertId);
    const newTemplate = await this.getTemplateById(insertedId);
    if (!newTemplate) {
      throw new Error("Failed to create template");
    }
    return newTemplate;
  }

  async updateTemplate(id: number, template: UpdateTemplate): Promise<Template | undefined> {
    await db.update(templates).set(template).where(eq(templates.id, id));
    return await this.getTemplateById(id);
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return result[0].affectedRows > 0;
  }

  async getScheduledTasks(clientId: number, filters?: { taskType?: string; status?: string; search?: string }): Promise<ScheduledTask[]> {
    const conditions: SQL[] = [eq(scheduledTasks.clientId, clientId)];
    
    if (filters?.taskType && filters.taskType !== 'all') {
      conditions.push(eq(scheduledTasks.taskType, filters.taskType));
    }
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(scheduledTasks.status, filters.status));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(scheduledTasks.name, `%${filters.search}%`),
        like(scheduledTasks.description, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (whereCondition) {
      return await db.select().from(scheduledTasks).where(whereCondition);
    }
    
    return await db.select().from(scheduledTasks).where(eq(scheduledTasks.clientId, clientId));
  }

  async getScheduledTaskById(id: number): Promise<ScheduledTask | undefined> {
    const result = await db.select().from(scheduledTasks).where(eq(scheduledTasks.id, id)).limit(1);
    return result[0];
  }

  async createScheduledTask(task: InsertScheduledTask): Promise<ScheduledTask> {
    const result = await db.insert(scheduledTasks).values(task);
    const insertedId = Number(result[0].insertId);
    const newTask = await this.getScheduledTaskById(insertedId);
    if (!newTask) {
      throw new Error("Failed to create scheduled task");
    }
    return newTask;
  }

  async updateScheduledTask(id: number, task: UpdateScheduledTask): Promise<ScheduledTask | undefined> {
    await db.update(scheduledTasks).set(task).where(eq(scheduledTasks.id, id));
    return this.getScheduledTaskById(id);
  }

  async deleteScheduledTask(id: number): Promise<boolean> {
    const result = await db.delete(scheduledTasks).where(eq(scheduledTasks.id, id));
    return result[0].affectedRows > 0;
  }

  async getEmails(clientId: number, filters?: { status?: string; type?: string; search?: string }): Promise<Email[]> {
    const conditions: SQL[] = [eq(emails.clientId, clientId)];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(emails.status, filters.status));
    }
    
    if (filters?.type && filters.type !== 'all') {
      conditions.push(eq(emails.type, filters.type));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(emails.subject, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (!whereCondition) {
      return db.select().from(emails).orderBy(emails.createdAt);
    }
    
    return db.select().from(emails).where(whereCondition).orderBy(emails.createdAt);
  }

  async getEmailById(id: number): Promise<Email | undefined> {
    const result = await db.select().from(emails).where(eq(emails.id, id)).limit(1);
    return result[0];
  }

  async createEmail(email: InsertEmail): Promise<Email> {
    const result = await db.insert(emails).values(email);
    const insertedId = Number(result[0].insertId);
    const newEmail = await this.getEmailById(insertedId);
    if (!newEmail) {
      throw new Error("Failed to create email");
    }
    return newEmail;
  }

  async updateEmail(id: number, email: UpdateEmail): Promise<Email | undefined> {
    await db.update(emails).set(email).where(eq(emails.id, id));
    return this.getEmailById(id);
  }

  async deleteEmail(id: number): Promise<boolean> {
    const result = await db.delete(emails).where(eq(emails.id, id));
    return result[0].affectedRows > 0;
  }

  async getUnsubscribes(clientId: number, filters?: { search?: string }): Promise<Unsubscribe[]> {
    const conditions: SQL[] = [eq(unsubscribes.clientId, clientId)];
    
    if (filters?.search) {
      const searchCondition = like(unsubscribes.email, `%${filters.search}%`);
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (!whereCondition) {
      return db.select().from(unsubscribes).orderBy(unsubscribes.unsubscribedAt);
    }
    
    return db.select().from(unsubscribes).where(whereCondition).orderBy(unsubscribes.unsubscribedAt);
  }

  async getUnsubscribeByEmail(email: string, clientId: number): Promise<Unsubscribe | undefined> {
    const result = await db.select().from(unsubscribes)
      .where(and(eq(unsubscribes.email, email), eq(unsubscribes.clientId, clientId)))
      .limit(1);
    return result[0];
  }

  async createUnsubscribe(unsubscribe: InsertUnsubscribe): Promise<Unsubscribe> {
    const result = await db.insert(unsubscribes).values(unsubscribe);
    const insertedId = Number(result[0].insertId);
    const newUnsubscribe = await db.select().from(unsubscribes).where(eq(unsubscribes.id, insertedId)).limit(1);
    if (!newUnsubscribe[0]) {
      throw new Error("Failed to create unsubscribe");
    }
    return newUnsubscribe[0];
  }

  async getUserStats(clientId: number): Promise<UserStats> {
    // Get lead statistics
    const allLeads = await db.select().from(leads).where(eq(leads.clientId, clientId));
    const qualifiedLeads = allLeads.filter(l => l.status === "Calificado" || l.status === "Convertido");
    const convertedLeads = allLeads.filter(l => l.status === "Convertido");
    const avgLeadScore = allLeads.length > 0
      ? (allLeads.reduce((sum, l) => sum + l.score, 0) / allLeads.length).toFixed(2)
      : "0.00";

    // Get segment statistics
    const allSegments = await db.select().from(segments).where(eq(segments.clientId, clientId));
    const totalLeadsSegmented = allSegments.reduce((sum, s) => sum + s.leadCount, 0);

    // Get automation statistics
    const allAutomations = await db.select().from(automations).where(eq(automations.clientId, clientId));
    const activeAutomations = allAutomations.filter(a => a.status === "Activa");
    const totalExecutions = allAutomations.reduce((sum, a) => sum + a.executionCount, 0);
    const automationsWithRate = allAutomations.filter(a => a.successRate !== null && Number(a.successRate) > 0);
    const avgSuccessRate = automationsWithRate.length > 0
      ? (automationsWithRate.reduce((sum, a) => sum + Number(a.successRate || 0), 0) / automationsWithRate.length).toFixed(2)
      : "0.00";

    return {
      totalLeads: allLeads.length,
      qualifiedLeads: qualifiedLeads.length,
      convertedLeads: convertedLeads.length,
      avgLeadScore,
      totalSegments: allSegments.length,
      totalLeadsSegmented,
      totalAutomations: allAutomations.length,
      activeAutomations: activeAutomations.length,
      totalExecutions,
      avgSuccessRate,
    };
  }
}

export const storage = new DbStorage();
