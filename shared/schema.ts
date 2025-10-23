import { mysqlTable, int, varchar, timestamp, decimal, date, text } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const clients = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  isActive: int("is_active").notNull().default(1),
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

export const automations = mysqlTable("automations", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  conditions: text("conditions").notNull().default("{}"),
  actions: text("actions").notNull().default("{}"),
  status: varchar("status", { length: 50 }).notNull().default("Inactiva"),
  executionCount: int("execution_count").notNull().default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const landings = mysqlTable("landings", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }),
  description: text("description"),
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Borrador"),
  publishedAt: timestamp("published_at"),
  views: int("views").notNull().default(0),
  conversions: int("conversions").notNull().default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const templates = mysqlTable("templates", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  content: text("content").notNull(),
  variables: text("variables"),
  thumbnail: varchar("thumbnail", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default("Activa"),
  timesUsed: int("times_used").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const scheduledTasks = mysqlTable("scheduled_tasks", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  taskType: varchar("task_type", { length: 100 }).notNull(),
  referenceId: int("reference_id"),
  referenceName: varchar("reference_name", { length: 255 }),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Programada"),
  executedAt: timestamp("executed_at"),
  result: text("result"),
  recurrence: varchar("recurrence", { length: 50 }).notNull().default("none"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  subscriptions: many(subscriptions),
  payments: many(payments),
  leads: many(leads),
  segments: many(segments),
  automations: many(automations),
  landings: many(landings),
  templates: many(templates),
  scheduledTasks: many(scheduledTasks),
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

export const automationsRelations = relations(automations, ({ one }) => ({
  client: one(clients, {
    fields: [automations.clientId],
    references: [clients.id],
  }),
}));

export const landingsRelations = relations(landings, ({ one }) => ({
  client: one(clients, {
    fields: [landings.clientId],
    references: [clients.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  client: one(clients, {
    fields: [templates.clientId],
    references: [clients.id],
  }),
}));

export const scheduledTasksRelations = relations(scheduledTasks, ({ one }) => ({
  client: one(clients, {
    fields: [scheduledTasks.clientId],
    references: [clients.id],
  }),
}));

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  registeredAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es requerido"),
});

export const updateClientSchema = insertClientSchema.partial();

export const registerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

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

export const insertAutomationSchema = createInsertSchema(automations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  trigger: z.string().min(1, "El trigger es requerido"),
  conditions: z.string().default("{}"),
  actions: z.string().default("{}"),
  status: z.string().default("Inactiva"),
});

export const updateAutomationSchema = insertAutomationSchema.partial();

export const insertLandingSchema = createInsertSchema(landings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().min(1, "El contenido es requerido"),
  status: z.string().default("Borrador"),
});

export const updateLandingSchema = insertLandingSchema.partial();

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  type: z.string().min(1, "El tipo es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  subject: z.string().optional().nullable(),
  content: z.string().min(1, "El contenido es requerido"),
  variables: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  status: z.string().default("Activa"),
});

export const updateTemplateSchema = insertTemplateSchema.partial();

export const insertScheduledTaskSchema = createInsertSchema(scheduledTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  executedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  taskType: z.string().min(1, "El tipo de tarea es requerido"),
  referenceId: z.number().optional().nullable(),
  referenceName: z.string().optional().nullable(),
  scheduledFor: z.string().min(1, "La fecha programada es requerida"),
  status: z.string().default("Programada"),
  result: z.string().optional().nullable(),
  recurrence: z.string().default("none"),
});

export const updateScheduledTaskSchema = insertScheduledTaskSchema.partial();

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

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = z.infer<typeof insertAutomationSchema>;
export type UpdateAutomation = z.infer<typeof updateAutomationSchema>;

export type Landing = typeof landings.$inferSelect;
export type InsertLanding = z.infer<typeof insertLandingSchema>;
export type UpdateLanding = z.infer<typeof updateLandingSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type UpdateTemplate = z.infer<typeof updateTemplateSchema>;

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = z.infer<typeof insertScheduledTaskSchema>;
export type UpdateScheduledTask = z.infer<typeof updateScheduledTaskSchema>;
