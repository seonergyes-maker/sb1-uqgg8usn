import { mysqlTable, int, varchar, timestamp, decimal, date, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const clients = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  plan: varchar("plan", { length: 50 }).notNull().default("Essential"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  contacts: int("contacts").notNull().default(0),
  emailsSent: int("emails_sent").notNull().default(0),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  startDate: date("start_date").notNull(),
  nextBilling: date("next_billing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  subscriptionId: int("subscription_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("EUR"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  transactionId: varchar("transaction_id", { length: 255 }),
  description: text("description"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const settings = mysqlTable("settings", {
  id: int("id").primaryKey().autoincrement(),
  companyName: varchar("company_name", { length: 255 }).notNull().default("LandFlow"),
  contactEmail: varchar("contact_email", { length: 255 }).notNull().default("soporte@landflow.com"),
  phone: varchar("phone", { length: 50 }).notNull().default("+34 900 000 000"),
  fromName: varchar("from_name", { length: 255 }).notNull().default("LandFlow"),
  fromEmail: varchar("from_email", { length: 255 }).notNull().default("noreply@landflow.com"),
  replyToEmail: varchar("reply_to_email", { length: 255 }).notNull().default("soporte@landflow.com"),
  smtpHost: varchar("smtp_host", { length: 255 }),
  smtpPort: int("smtp_port").default(587),
  smtpUser: varchar("smtp_user", { length: 255 }),
  smtpPassword: varchar("smtp_password", { length: 255 }),
  smtpEncryption: varchar("smtp_encryption", { length: 10 }).default("tls"),
  smtpAuth: varchar("smtp_auth", { length: 20 }).default("login"),
  notifyNewClients: int("notify_new_clients").notNull().default(1),
  notifyPayments: int("notify_payments").notNull().default(1),
  notifyFailedPayments: int("notify_failed_payments").notNull().default(1),
  notifyCancellations: int("notify_cancellations").notNull().default(1),
  stripeKey: varchar("stripe_key", { length: 255 }),
  paypalClientId: varchar("paypal_client_id", { length: 255 }),
  analyticsId: varchar("analytics_id", { length: 100 }),
  termsAndConditions: text("terms_and_conditions"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leads = mysqlTable("leads", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  source: varchar("source", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Nuevo"),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const segments = mysqlTable("segments", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  filters: text("filters").notNull(),
  leadCount: int("lead_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Borrador"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipientCount: int("recipient_count").notNull().default(0),
  openRate: decimal("open_rate", { precision: 5, scale: 2 }).default("0.00"),
  clickRate: decimal("click_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  leads: many(leads),
  segments: many(segments),
  campaigns: many(campaigns),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  client: one(clients, {
    fields: [subscriptions.clientId],
    references: [clients.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  client: one(clients, {
    fields: [payments.clientId],
    references: [clients.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  client: one(clients, {
    fields: [leads.clientId],
    references: [clients.id],
  }),
}));

export const segmentsRelations = relations(segments, ({ one }) => ({
  client: one(clients, {
    fields: [segments.clientId],
    references: [clients.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  client: one(clients, {
    fields: [campaigns.clientId],
    references: [clients.id],
  }),
}));

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  registeredAt: true,
  updatedAt: true,
});

export const updateClientSchema = insertClientSchema.partial();

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSubscriptionSchema = insertSubscriptionSchema.partial();

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePaymentSchema = insertPaymentSchema.partial();

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const updateSettingsSchema = insertSettingsSchema.partial();

export const insertLeadSchema = createInsertSchema(leads, {
  clientId: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  source: z.string().min(1, "El origen es requerido"),
  status: z.string().default("Nuevo"),
  score: z.number().min(0).max(100).default(0),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = insertLeadSchema.partial();

export const insertSegmentSchema = createInsertSchema(segments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  filters: z.string().default("{}"),
});

export const updateSegmentSchema = insertSegmentSchema.partial();

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  subject: z.string().min(1, "El asunto es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  status: z.string().default("Borrador"),
  scheduledAt: z.string().optional().nullable(),
});

export const updateCampaignSchema = insertCampaignSchema.partial();

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type UpdatePayment = z.infer<typeof updatePaymentSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;

export type Segment = typeof segments.$inferSelect;
export type InsertSegment = z.infer<typeof insertSegmentSchema>;
export type UpdateSegment = z.infer<typeof updateSegmentSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;
