import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  plan: varchar("plan", { length: 50 }).notNull().default("Essential"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  contacts: integer("contacts").notNull().default(0),
  emailsSent: integer("emails_sent").notNull().default(0),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  registeredAt: true,
  updatedAt: true,
});

export const updateClientSchema = insertClientSchema.partial();

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
