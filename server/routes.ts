import type { Express } from "express";
import { storage } from "./storage.js";
import { 
  insertClientSchema, 
  updateClientSchema,
  insertSubscriptionSchema,
  updateSubscriptionSchema,
  insertPaymentSchema,
  updatePaymentSchema,
  updateSettingsSchema,
  insertLeadSchema,
  updateLeadSchema,
  insertSegmentSchema,
  updateSegmentSchema,
  insertCampaignSchema,
  updateCampaignSchema,
  insertAutomationSchema,
  updateAutomationSchema,
  insertLandingSchema,
  updateLandingSchema,
  insertTemplateSchema,
  updateTemplateSchema
} from "../shared/schema.js";

export function registerRoutes(app: Express) {
  // GET /api/clients - List all clients with optional filters
  app.get("/api/clients", async (req, res) => {
    try {
      const { plan, status, search } = req.query;
      const clients = await storage.getClients({
        plan: plan as string,
        status: status as string,
        search: search as string,
      });
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // GET /api/clients/:id - Get a single client by ID
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClientById(id);
      
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  // POST /api/clients - Create a new client
  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const newClient = await storage.createClient(validatedData);
      res.status(201).json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid client data", details: error });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // PATCH /api/clients/:id - Update a client
  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateClientSchema.parse(req.body);
      const updatedClient = await storage.updateClient(id, validatedData);
      
      if (!updatedClient) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.json(updatedClient);
    } catch (error) {
      console.error("Error updating client:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid client data", details: error });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // DELETE /api/clients/:id - Delete a client
  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClient(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // GET /api/subscriptions - List all subscriptions with optional filters
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const { plan, status, search } = req.query;
      const subscriptions = await storage.getSubscriptions({
        plan: plan as string,
        status: status as string,
        search: search as string,
      });
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // GET /api/subscriptions/:id - Get a single subscription by ID
  app.get("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subscription = await storage.getSubscriptionById(id);
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // POST /api/subscriptions - Create a new subscription
  app.post("/api/subscriptions", async (req, res) => {
    try {
      const validatedData = insertSubscriptionSchema.parse(req.body);
      const newSubscription = await storage.createSubscription(validatedData);
      res.status(201).json(newSubscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid subscription data", details: error });
      }
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // PATCH /api/subscriptions/:id - Update a subscription
  app.patch("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateSubscriptionSchema.parse(req.body);
      const updatedSubscription = await storage.updateSubscription(id, validatedData);
      
      if (!updatedSubscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(updatedSubscription);
    } catch (error) {
      console.error("Error updating subscription:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid subscription data", details: error });
      }
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  // DELETE /api/subscriptions/:id - Delete a subscription
  app.delete("/api/subscriptions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSubscription(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      res.status(500).json({ error: "Failed to delete subscription" });
    }
  });

  // GET /api/dashboard/stats - Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // GET /api/payments - List all payments with optional filters
  app.get("/api/payments", async (req, res) => {
    try {
      const { paymentMethod, paymentStatus, search } = req.query;
      const payments = await storage.getPayments({
        paymentMethod: paymentMethod as string,
        paymentStatus: paymentStatus as string,
        search: search as string,
      });
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // GET /api/payments/:id - Get a single payment by ID
  app.get("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await storage.getPaymentById(id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  // POST /api/payments - Create a new payment
  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const newPayment = await storage.createPayment(validatedData);
      res.status(201).json(newPayment);
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid payment data", details: error });
      }
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // PATCH /api/payments/:id - Update a payment
  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updatePaymentSchema.parse(req.body);
      const updatedPayment = await storage.updatePayment(id, validatedData);
      
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(updatedPayment);
    } catch (error) {
      console.error("Error updating payment:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid payment data", details: error });
      }
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  // DELETE /api/payments/:id - Delete a payment
  app.delete("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePayment(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  });

  // GET /api/settings - Get application settings
  app.get("/api/settings", async (req, res) => {
    try {
      const appSettings = await storage.getSettings();
      res.json(appSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // PATCH /api/settings - Update application settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = updateSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSettings(validatedData);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid settings data", details: error });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // GET /api/leads - List all leads for a client with optional filters
  app.get("/api/leads", async (req, res) => {
    try {
      const { clientId, status, source, search } = req.query;
      
      if (!clientId) {
        return res.status(400).json({ error: "clientId is required" });
      }
      
      const leads = await storage.getLeads(parseInt(clientId as string), {
        status: status as string,
        source: source as string,
        search: search as string,
      });
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // GET /api/leads/:id - Get a single lead by ID
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLeadById(id);
      
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // POST /api/leads - Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const newLead = await storage.createLead(validatedData);
      res.status(201).json(newLead);
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid lead data", details: error });
      }
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // PATCH /api/leads/:id - Update a lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateLeadSchema.parse(req.body);
      const updatedLead = await storage.updateLead(id, validatedData);
      
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid lead data", details: error });
      }
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // DELETE /api/leads/:id - Delete a lead
  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLead(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // GET /api/segments - List all segments for a client with optional filters
  app.get("/api/segments", async (req, res) => {
    try {
      const { clientId, search } = req.query;
      
      if (!clientId) {
        return res.status(400).json({ error: "clientId is required" });
      }
      
      const segments = await storage.getSegments(parseInt(clientId as string), {
        search: search as string,
      });
      res.json(segments);
    } catch (error) {
      console.error("Error fetching segments:", error);
      res.status(500).json({ error: "Failed to fetch segments" });
    }
  });

  // GET /api/segments/:id - Get a single segment by ID
  app.get("/api/segments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const segment = await storage.getSegmentById(id);
      
      if (!segment) {
        return res.status(404).json({ error: "Segment not found" });
      }
      
      res.json(segment);
    } catch (error) {
      console.error("Error fetching segment:", error);
      res.status(500).json({ error: "Failed to fetch segment" });
    }
  });

  // POST /api/segments - Create a new segment
  app.post("/api/segments", async (req, res) => {
    try {
      const validatedData = insertSegmentSchema.parse(req.body);
      const newSegment = await storage.createSegment(validatedData);
      res.status(201).json(newSegment);
    } catch (error) {
      console.error("Error creating segment:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid segment data", details: error });
      }
      res.status(500).json({ error: "Failed to create segment" });
    }
  });

  // PATCH /api/segments/:id - Update a segment
  app.patch("/api/segments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateSegmentSchema.parse(req.body);
      const updatedSegment = await storage.updateSegment(id, validatedData);
      
      if (!updatedSegment) {
        return res.status(404).json({ error: "Segment not found" });
      }
      
      res.json(updatedSegment);
    } catch (error) {
      console.error("Error updating segment:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid segment data", details: error });
      }
      res.status(500).json({ error: "Failed to update segment" });
    }
  });

  // DELETE /api/segments/:id - Delete a segment
  app.delete("/api/segments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSegment(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Segment not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting segment:", error);
      res.status(500).json({ error: "Failed to delete segment" });
    }
  });

  // GET /api/campaigns - List all campaigns for a client with optional filters
  app.get("/api/campaigns", async (req, res) => {
    try {
      const { clientId, status, search } = req.query;
      
      if (!clientId) {
        return res.status(400).json({ error: "clientId is required" });
      }
      
      const campaigns = await storage.getCampaigns(parseInt(clientId as string), {
        status: status as string,
        search: search as string,
      });
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  // GET /api/campaigns/:id - Get a single campaign by ID
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaignById(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });

  // POST /api/campaigns - Create a new campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const newCampaign = await storage.createCampaign(validatedData);
      res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid campaign data", details: error });
      }
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  // PATCH /api/campaigns/:id - Update a campaign
  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateCampaignSchema.parse(req.body);
      const updatedCampaign = await storage.updateCampaign(id, validatedData);
      
      if (!updatedCampaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      
      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid campaign data", details: error });
      }
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  // DELETE /api/campaigns/:id - Delete a campaign
  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCampaign(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // GET /api/automations - List all automations for a client with optional filters
  app.get("/api/automations", async (req, res) => {
    try {
      const { clientId, status, search } = req.query;
      
      if (!clientId) {
        return res.status(400).json({ error: "clientId is required" });
      }
      
      const automations = await storage.getAutomations(parseInt(clientId as string), {
        status: status as string,
        search: search as string,
      });
      res.json(automations);
    } catch (error) {
      console.error("Error fetching automations:", error);
      res.status(500).json({ error: "Failed to fetch automations" });
    }
  });

  // GET /api/automations/:id - Get a single automation by ID
  app.get("/api/automations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const automation = await storage.getAutomationById(id);
      
      if (!automation) {
        return res.status(404).json({ error: "Automation not found" });
      }
      
      res.json(automation);
    } catch (error) {
      console.error("Error fetching automation:", error);
      res.status(500).json({ error: "Failed to fetch automation" });
    }
  });

  // POST /api/automations - Create a new automation
  app.post("/api/automations", async (req, res) => {
    try {
      const validatedData = insertAutomationSchema.parse(req.body);
      const newAutomation = await storage.createAutomation(validatedData);
      res.status(201).json(newAutomation);
    } catch (error) {
      console.error("Error creating automation:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid automation data", details: error });
      }
      res.status(500).json({ error: "Failed to create automation" });
    }
  });

  // PATCH /api/automations/:id - Update an automation
  app.patch("/api/automations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateAutomationSchema.parse(req.body);
      const updatedAutomation = await storage.updateAutomation(id, validatedData);
      
      if (!updatedAutomation) {
        return res.status(404).json({ error: "Automation not found" });
      }
      
      res.json(updatedAutomation);
    } catch (error) {
      console.error("Error updating automation:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid automation data", details: error });
      }
      res.status(500).json({ error: "Failed to update automation" });
    }
  });

  // DELETE /api/automations/:id - Delete an automation
  app.delete("/api/automations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAutomation(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Automation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting automation:", error);
      res.status(500).json({ error: "Failed to delete automation" });
    }
  });

  // GET /api/user-stats/:clientId - Get aggregated user statistics
  app.get("/api/user-stats/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const stats = await storage.getUserStats(clientId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // GET /api/landings/:clientId - Get landings for a client
  app.get("/api/landings/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { status, search } = req.query;
      const landings = await storage.getLandings(clientId, {
        status: status as string,
        search: search as string,
      });
      res.json(landings);
    } catch (error) {
      console.error("Error fetching landings:", error);
      res.status(500).json({ error: "Failed to fetch landings" });
    }
  });

  // GET /api/landings/:clientId/:id - Get a single landing
  app.get("/api/landings/:clientId/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const landing = await storage.getLandingById(id);
      
      if (!landing) {
        return res.status(404).json({ error: "Landing not found" });
      }
      
      res.json(landing);
    } catch (error) {
      console.error("Error fetching landing:", error);
      res.status(500).json({ error: "Failed to fetch landing" });
    }
  });

  // POST /api/landings - Create a new landing
  app.post("/api/landings", async (req, res) => {
    try {
      const validatedData = insertLandingSchema.parse(req.body);
      const landing = await storage.createLanding(validatedData);
      res.status(201).json(landing);
    } catch (error) {
      console.error("Error creating landing:", error);
      res.status(400).json({ error: "Failed to create landing" });
    }
  });

  // PATCH /api/landings/:id - Update a landing
  app.patch("/api/landings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateLandingSchema.parse(req.body);
      const landing = await storage.updateLanding(id, validatedData);
      
      if (!landing) {
        return res.status(404).json({ error: "Landing not found" });
      }
      
      res.json(landing);
    } catch (error) {
      console.error("Error updating landing:", error);
      res.status(400).json({ error: "Failed to update landing" });
    }
  });

  // DELETE /api/landings/:id - Delete a landing
  app.delete("/api/landings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLanding(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Landing not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting landing:", error);
      res.status(500).json({ error: "Failed to delete landing" });
    }
  });

  // GET /api/templates/:clientId - List all templates with optional filters
  app.get("/api/templates/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { type, category, status, search } = req.query;
      const templates = await storage.getTemplates(clientId, {
        type: type as string,
        category: category as string,
        status: status as string,
        search: search as string,
      });
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // GET /api/templates/:clientId/:id - Get a single template
  app.get("/api/templates/:clientId/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // POST /api/templates - Create a new template
  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Failed to create template" });
    }
  });

  // PATCH /api/templates/:id - Update a template
  app.patch("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateTemplateSchema.parse(req.body);
      const template = await storage.updateTemplate(id, validatedData);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(400).json({ error: "Failed to update template" });
    }
  });

  // DELETE /api/templates/:id - Delete a template
  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTemplate(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });
}
