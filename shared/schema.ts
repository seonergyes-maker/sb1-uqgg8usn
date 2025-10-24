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
  plan: varchar("plan", { length: 50 }).notNull().default("Starter"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  contacts: int("contacts").notNull().default(0),
  emailsSent: int("emails_sent").notNull().default(0),
  
  // Profile information
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  
  // Email configuration
  fromName: varchar("from_name", { length: 255 }),
  fromEmail: varchar("from_email", { length: 255 }),
  replyTo: varchar("reply_to", { length: 255 }),
  emailSignature: text("email_signature"),
  
  // Notification preferences
  notifyNewLeads: int("notify_new_leads").notNull().default(1),
  notifyCampaigns: int("notify_campaigns").notNull().default(1),
  notifyWeekly: int("notify_weekly").notNull().default(1),
  notifyTips: int("notify_tips").notNull().default(0),
  
  // Tracking IDs
  googleAnalyticsId: varchar("google_analytics_id", { length: 50 }),
  metaPixelId: varchar("meta_pixel_id", { length: 50 }),
  
  // Custom domain (Business plan only)
  customDomain: varchar("custom_domain", { length: 255 }),
  domainVerified: int("domain_verified").notNull().default(0),
  
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
  paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
  paypalPlanId: varchar("paypal_plan_id", { length: 255 }),
  billingCycleAnchor: date("billing_cycle_anchor"),
  lastBillingDate: date("last_billing_date"),
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

export const emails = mysqlTable("emails", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("Campaña"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const automationExecutions = mysqlTable("automation_executions", {
  id: int("id").primaryKey().autoincrement(),
  automationId: int("automation_id").notNull(),
  leadId: int("lead_id").notNull(),
  currentStep: int("current_step").notNull().default(0),
  status: varchar("status", { length: 50 }).notNull().default("En proceso"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  nextExecutionAt: timestamp("next_execution_at"),
  emailsSent: int("emails_sent").notNull().default(0),
  emailsOpened: int("emails_opened").notNull().default(0),
  emailsBounced: int("emails_bounced").notNull().default(0),
  emailsUnsubscribed: int("emails_unsubscribed").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const unsubscribes = mysqlTable("unsubscribes", {
  id: int("id").primaryKey().autoincrement(),
  leadId: int("lead_id"),
  clientId: int("client_id").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  reason: text("reason"),
  unsubscribedAt: timestamp("unsubscribed_at").notNull().defaultNow(),
});

export const planLimits = mysqlTable("plan_limits", {
  id: int("id").primaryKey().autoincrement(),
  planName: varchar("plan_name", { length: 50 }).notNull().unique(),
  maxContacts: int("max_contacts").notNull(),
  maxEmailsPerMonth: int("max_emails_per_month").notNull(),
  maxLandingPages: int("max_landing_pages").notNull(),
  maxAutomations: int("max_automations").notNull(),
  customDomainAllowed: int("custom_domain_allowed").notNull().default(0),
  prioritySupport: int("priority_support").notNull().default(0),
});

export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  emailsSent: int("emails_sent").notNull().default(0),
  contactsCount: int("contacts_count").notNull().default(0),
  landingsCount: int("landings_count").notNull().default(0),
  automationsCount: int("automations_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  emails: many(emails),
  unsubscribes: many(unsubscribes),
  automationExecutions: many(automationExecutions),
  usageTracking: many(usageTracking),
}));

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  client: one(clients, {
    fields: [usageTracking.clientId],
    references: [clients.id],
  }),
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

export const automationsRelations = relations(automations, ({ one, many }) => ({
  client: one(clients, {
    fields: [automations.clientId],
    references: [clients.id],
  }),
  executions: many(automationExecutions),
}));

export const automationExecutionsRelations = relations(automationExecutions, ({ one }) => ({
  automation: one(automations, {
    fields: [automationExecutions.automationId],
    references: [automations.id],
  }),
  lead: one(leads, {
    fields: [automationExecutions.leadId],
    references: [leads.id],
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

export const emailsRelations = relations(emails, ({ one }) => ({
  client: one(clients, {
    fields: [emails.clientId],
    references: [clients.id],
  }),
}));

export const unsubscribesRelations = relations(unsubscribes, ({ one }) => ({
  client: one(clients, {
    fields: [unsubscribes.clientId],
    references: [clients.id],
  }),
  lead: one(leads, {
    fields: [unsubscribes.leadId],
    references: [leads.id],
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
  clientId: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional().nullable(),
  trigger: z.string().min(1, "El trigger es requerido"),
  conditions: z.string().default("{}"),
  actions: z.string().default("[]"),
  status: z.string().default("Inactiva"),
  executionCount: z.number().default(0),
  successRate: z.string().default("0.00"),
});

export const updateAutomationSchema = insertAutomationSchema.partial();

export const insertLandingSchema = z.object({
  clientId: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional(),
  status: z.string().optional().default("Borrador"),
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

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "El nombre es requerido"),
  subject: z.string().min(1, "El asunto es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  type: z.string().default("Campaña"),
});

export const updateEmailSchema = insertEmailSchema.partial();

export const insertAutomationExecutionSchema = createInsertSchema(automationExecutions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  automationId: z.number().min(1, "El ID de automatización es requerido"),
  leadId: z.number().min(1, "El ID de lead es requerido"),
  currentStep: z.number().default(0),
  status: z.string().default("En proceso"),
});

export const updateAutomationExecutionSchema = insertAutomationExecutionSchema.partial();

export const insertUnsubscribeSchema = createInsertSchema(unsubscribes).omit({
  id: true,
  unsubscribedAt: true,
}).extend({
  email: z.string().email("Email inválido"),
  reason: z.string().optional().nullable(),
});

export const insertPlanLimitSchema = createInsertSchema(planLimits).omit({
  id: true,
});

export const updatePlanLimitSchema = insertPlanLimitSchema.partial();

export const insertUsageTrackingSchema = createInsertSchema(usageTracking).omit({
  id: true,
  createdAt: true,
});

export const updateUsageTrackingSchema = insertUsageTrackingSchema.partial();

// User Settings Schema - for updating client configuration
export const updateUserSettingsSchema = z.object({
  // Email configuration
  fromName: z.string().optional().nullable(),
  fromEmail: z.string().email("Email inválido").optional().nullable(),
  replyTo: z.string().email("Email de respuesta inválido").optional().nullable(),
  emailSignature: z.string().optional().nullable(),
  
  // Notification preferences
  notifyNewLeads: z.number().min(0).max(1).optional(),
  notifyCampaigns: z.number().min(0).max(1).optional(),
  notifyWeekly: z.number().min(0).max(1).optional(),
  notifyTips: z.number().min(0).max(1).optional(),
  
  // Tracking IDs
  googleAnalyticsId: z.string().max(50).optional().nullable(),
  metaPixelId: z.string().max(50).optional().nullable(),
  
  // Custom domain (Business plan only)
  customDomain: z.string().max(255).optional().nullable(),
});

// User Profile Schema - for updating basic profile information
export const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255).optional(),
  email: z.string().email("Email inválido").max(255).optional(),
  company: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  avatarUrl: z.string().max(500).optional().nullable(),
});

// Change Password Schema - for updating password
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Debes confirmar la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

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

export type Email = typeof emails.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type UpdateEmail = z.infer<typeof updateEmailSchema>;

export type AutomationExecution = typeof automationExecutions.$inferSelect;
export type InsertAutomationExecution = z.infer<typeof insertAutomationExecutionSchema>;
export type UpdateAutomationExecution = z.infer<typeof updateAutomationExecutionSchema>;

export type Unsubscribe = typeof unsubscribes.$inferSelect;
export type InsertUnsubscribe = z.infer<typeof insertUnsubscribeSchema>;

export type PlanLimit = typeof planLimits.$inferSelect;
export type InsertPlanLimit = z.infer<typeof insertPlanLimitSchema>;
export type UpdatePlanLimit = z.infer<typeof updatePlanLimitSchema>;

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = z.infer<typeof insertUsageTrackingSchema>;
export type UpdateUsageTracking = z.infer<typeof updateUsageTrackingSchema>;
