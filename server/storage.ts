import { eq, like, and, or, SQL } from "drizzle-orm";
import { db } from "./db.js";
import { 
  clients, 
  subscriptions,
  payments,
  settings,
  leads,
  segments,
  campaigns,
  automations,
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
  type Campaign,
  type InsertCampaign,
  type UpdateCampaign,
  type Automation,
  type InsertAutomation,
  type UpdateAutomation
} from "../shared/schema.js";

export interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  recentClients: (Client & { daysAgo: number })[];
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
  
  getCampaigns(clientId: number, filters?: { status?: string; search?: string }): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: UpdateCampaign): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  getAutomations(clientId: number, filters?: { status?: string; search?: string }): Promise<Automation[]>;
  getAutomationById(id: number): Promise<Automation | undefined>;
  createAutomation(automation: InsertAutomation): Promise<Automation>;
  updateAutomation(id: number, automation: UpdateAutomation): Promise<Automation | undefined>;
  deleteAutomation(id: number): Promise<boolean>;
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

  async getCampaigns(clientId: number, filters?: { status?: string; search?: string }): Promise<Campaign[]> {
    const conditions: SQL[] = [eq(campaigns.clientId, clientId)];
    
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(campaigns.status, filters.status));
    }
    
    if (filters?.search) {
      const searchCondition = or(
        like(campaigns.name, `%${filters.search}%`),
        like(campaigns.subject, `%${filters.search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    const whereCondition = and(...conditions);
    if (whereCondition) {
      return await db.select().from(campaigns).where(whereCondition);
    }
    
    return await db.select().from(campaigns).where(eq(campaigns.clientId, clientId));
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const result = await db.insert(campaigns).values(campaign);
    const insertedId = Number(result[0].insertId);
    const newCampaign = await this.getCampaignById(insertedId);
    if (!newCampaign) {
      throw new Error("Failed to create campaign");
    }
    return newCampaign;
  }

  async updateCampaign(id: number, campaign: UpdateCampaign): Promise<Campaign | undefined> {
    await db.update(campaigns).set(campaign).where(eq(campaigns.id, id));
    return await this.getCampaignById(id);
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db.delete(campaigns).where(eq(campaigns.id, id));
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
}

export const storage = new DbStorage();
