import { eq, like, and, or, SQL } from "drizzle-orm";
import { db } from "./db.js";
import { clients, type Client, type InsertClient, type UpdateClient } from "../shared/schema.js";

export interface IStorage {
  getClients(filters?: { plan?: string; status?: string; search?: string }): Promise<Client[]>;
  getClientById(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: UpdateClient): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
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
}

export const storage = new DbStorage();
