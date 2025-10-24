import type { Express } from "express";
import { storage } from "./storage.js";
import { DEFAULT_LANDING_TEMPLATE } from "../shared/defaultLandingTemplate.js";
import { z } from "zod";
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
  insertAutomationSchema,
  updateAutomationSchema,
  insertLandingSchema,
  updateLandingSchema,
  insertTemplateSchema,
  updateTemplateSchema,
  insertEmailSchema,
  updateEmailSchema,
  insertUnsubscribeSchema,
  registerSchema,
  loginSchema
} from "../shared/schema.js";
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  authenticateAdmin, 
  authMiddleware,
  requireAdmin,
  requireUser,
  type AuthRequest 
} from "./auth.js";
import { db } from "./db.js";
import { clients } from "../shared/schema.js";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // AUTH ROUTES - Public
  
  // POST /api/auth/register - Register a new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingClient = await db.select().from(clients).where(eq(clients.email, validatedData.email)).limit(1);
      if (existingClient.length > 0) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create client
      const newClient = await storage.createClient({
        ...validatedData,
        password: hashedPassword,
        role: "user",
        isActive: 1,
        plan: "Starter",
        status: "active",
        contacts: 0,
        emailsSent: 0
      });
      
      // Generate token
      const token = generateToken({
        id: newClient.id,
        email: newClient.email,
        role: newClient.role,
        name: newClient.name
      });
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Return user data (without password)
      const { password, ...clientData } = newClient;
      res.status(201).json({ user: clientData, token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(400).json({ error: "Error al registrar usuario" });
    }
  });
  
  // POST /api/auth/login - Login user or admin
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Check if admin login
      if (await authenticateAdmin(validatedData.email, validatedData.password)) {
        const token = generateToken({
          id: 0,
          email: validatedData.email,
          role: "admin",
          name: "Administrador"
        });
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        return res.json({
          user: {
            id: 0,
            email: validatedData.email,
            role: "admin",
            name: "Administrador"
          },
          token
        });
      }
      
      // Check regular user
      const client = await db.select().from(clients).where(eq(clients.email, validatedData.email)).limit(1);
      if (client.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      
      const user = client[0];
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ error: "Cuenta desactivada" });
      }
      
      // Verify password
      const isValidPassword = await comparePassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }
      
      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      // Return user data (without password)
      const { password, ...userData } = user;
      res.json({ user: userData, token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(400).json({ error: "Error al iniciar sesión" });
    }
  });
  
  // GET /api/auth/me - Get current user
  app.get("/api/auth/me", authMiddleware, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });
  
  // POST /api/auth/logout - Logout user
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada exitosamente" });
  });
  
  // PROTECTED ROUTES - Require authentication
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
      
      // Use default template from filesystem if no content provided
      let content = validatedData.content;
      if (!content) {
        const { loadTemplateContent } = await import('./templates/index');
        content = loadTemplateContent('consultoria'); // Default to consultoria template
      }
      
      const landingData = {
        ...validatedData,
        content
      };
      
      const landing = await storage.createLanding(landingData);
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

  // GET /api/templates/base - List all base templates from filesystem
  app.get("/api/templates/base", async (req, res) => {
    try {
      const { getBaseTemplates } = await import('./templates/index');
      const { type, category, search } = req.query;
      
      const templates = getBaseTemplates({
        type: type as string,
        category: category as string,
        search: search as string,
      });
      
      // Transform to match expected API format
      const formattedTemplates = templates.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        type: t.type,
        category: t.category,
        status: 'Activa',
        // Don't send content in list view for performance
        content: null,
      }));
      
      res.json(formattedTemplates);
    } catch (error) {
      console.error("Error fetching base templates:", error);
      res.status(500).json({ error: "Failed to fetch base templates" });
    }
  });

  // GET /api/templates/base/:id - Get a specific base template with content
  app.get("/api/templates/base/:id", async (req, res) => {
    try {
      const { loadTemplateContent, BASE_TEMPLATES } = await import('./templates/index');
      const { id } = req.params;
      
      const template = BASE_TEMPLATES.find(t => t.id === id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      const content = loadTemplateContent(id);
      
      res.json({
        id: template.id,
        name: template.name,
        description: template.description,
        type: template.type,
        category: template.category,
        status: 'Activa',
        content,
      });
    } catch (error) {
      console.error("Error loading template content:", error);
      res.status(500).json({ error: "Failed to load template" });
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

  // GET /api/public/landings/:slug - Get landing by slug (public, no auth)
  app.get("/api/public/landings/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const landing = await storage.getLandingBySlug(slug);
      
      if (!landing) {
        return res.status(404).json({ error: "Landing not found" });
      }
      
      res.json(landing);
    } catch (error) {
      console.error("Error fetching public landing:", error);
      res.status(500).json({ error: "Failed to fetch landing" });
    }
  });

  // POST /api/public/landings/:slug/track-visit - Track landing visit (public)
  app.post("/api/public/landings/:slug/track-visit", async (req, res) => {
    try {
      const { slug } = req.params;
      const landing = await storage.getLandingBySlug(slug);
      
      if (landing) {
        await storage.updateLanding(landing.id, {
          views: (landing.views || 0) + 1
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking visit:", error);
      res.status(500).json({ error: "Failed to track visit" });
    }
  });

  // POST /api/public/leads - Create lead from public landing (no auth required)
  app.post("/api/public/leads", async (req, res) => {
    try {
      const { clientId, name, email, phone, company, message, source } = req.body;
      
      if (!clientId || !name || !email) {
        return res.status(400).json({ error: "clientId, name y email son requeridos" });
      }
      
      const leadData = {
        clientId: parseInt(clientId),
        name,
        email,
        phone: phone || null,
        company: company || null,
        tags: source ? source : null,
        notes: message || null,
        status: "Nuevo",
        score: 0,
        source: source || "Landing Page",
      };
      
      const newLead = await storage.createLead(leadData);
      
      // Track conversion on the landing if source contains landing slug
      if (source && source.startsWith("landing-")) {
        const landingSlug = source.replace("landing-", "");
        const landing = await storage.getLandingBySlug(landingSlug);
        if (landing) {
          const currentConversions = landing.conversions || 0;
          const currentViews = landing.views || 1;
          const newConversions = currentConversions + 1;
          const newConversionRate = ((newConversions / currentViews) * 100).toFixed(2);
          
          await storage.updateLanding(landing.id, {
            conversions: newConversions,
            conversionRate: newConversionRate
          });
        }
      }
      
      res.status(201).json({ success: true, lead: newLead });
    } catch (error) {
      console.error("Error creating public lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // EMAILS ROUTES
  
  // GET /api/emails/:clientId - Get all emails for a client
  app.get("/api/emails/:clientId", requireUser, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const { status, type, search } = req.query;
      const emails = await storage.getEmails(clientId, {
        status: status as string,
        type: type as string,
        search: search as string,
      });
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // GET /api/emails/:clientId/:id - Get a single email
  app.get("/api/emails/:clientId/:id", requireUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmailById(id);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      
      res.json(email);
    } catch (error) {
      console.error("Error fetching email:", error);
      res.status(500).json({ error: "Failed to fetch email" });
    }
  });

  // POST /api/emails - Create a new email
  app.post("/api/emails", requireUser, async (req, res) => {
    try {
      const validatedData = insertEmailSchema.parse(req.body);
      
      // Use default template from filesystem if no content provided
      let content = validatedData.content;
      if (!content) {
        const { loadTemplateContent } = await import('./templates/index');
        content = loadTemplateContent('bienvenida'); // Default to bienvenida template
      }
      
      const emailData = {
        ...validatedData,
        content
      };
      
      const email = await storage.createEmail(emailData);
      res.status(201).json(email);
    } catch (error) {
      console.error("Error creating email:", error);
      res.status(400).json({ error: "Failed to create email" });
    }
  });

  // PATCH /api/emails/:id - Update an email
  app.patch("/api/emails/:id", requireUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateEmailSchema.parse(req.body);
      const email = await storage.updateEmail(id, validatedData);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      
      res.json(email);
    } catch (error) {
      console.error("Error updating email:", error);
      res.status(400).json({ error: "Failed to update email" });
    }
  });

  // DELETE /api/emails/:id - Delete an email
  app.delete("/api/emails/:id", requireUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEmail(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Email not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting email:", error);
      res.status(500).json({ error: "Failed to delete email" });
    }
  });

  // POST /api/emails/:id/send - Send personalized email to leads
  app.post("/api/emails/:id/send", requireUser, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate recipients
      const recipientsSchema = z.object({
        recipients: z.array(z.object({
          email: z.string().email("Email inválido"),
          name: z.string().optional(),
          empresa: z.string().optional(),
        })).min(1, "Debe haber al menos un destinatario"),
      });
      
      const { recipients } = recipientsSchema.parse(req.body);
      
      const email = await storage.getEmailById(id);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      
      const { replaceEmailVariables, generateUnsubscribeLink } = await import('./utils/emailVariables.js');
      
      const results = [];
      for (const recipient of recipients) {
        const variables = {
          nombre: recipient.name || '',
          email: recipient.email,
          empresa: recipient.empresa || '',
          unsubscribe_link: generateUnsubscribeLink(recipient.email, email.clientId),
        };
        
        const personalizedContent = replaceEmailVariables(email.content, variables);
        const personalizedSubject = replaceEmailVariables(email.subject, variables);
        
        // TODO: Replace with actual SES sending logic
        console.log(`[SIMULATED] Sending email to: ${recipient.email}`);
        console.log(`Subject: ${personalizedSubject}`);
        
        results.push({
          email: recipient.email,
          status: 'sent',
          personalizedSubject,
        });
      }
      
      // Update email statistics
      await storage.updateEmail(id, {
        status: "Enviado",
        sentAt: new Date().toISOString(),
      });
      
      res.json({
        success: true,
        sent: results.length,
        results,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ error: "Datos de destinatarios inválidos", details: error });
      }
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // GET /api/public/unsubscribe - Unsubscribe from emails via link (no auth required)
  app.get("/api/public/unsubscribe", async (req, res) => {
    try {
      const { email, clientId } = req.query;
      
      if (!email || !clientId) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Error - LandFlow</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>❌ Error</h1>
              <p>Link de desuscripción inválido.</p>
            </body>
          </html>
        `);
      }
      
      const parsedClientId = parseInt(clientId as string);
      
      if (isNaN(parsedClientId)) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Error - LandFlow</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>❌ Error</h1>
              <p>Link de desuscripción inválido.</p>
            </body>
          </html>
        `);
      }
      
      // Check if already unsubscribed
      const existing = await storage.getUnsubscribeByEmail(email as string, parsedClientId);
      if (existing) {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head><title>Ya Desuscrito - LandFlow</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>✓ Ya Desuscrito</h1>
              <p>El email <strong>${email}</strong> ya estaba desuscrito de nuestras comunicaciones.</p>
            </body>
          </html>
        `);
      }
      
      // Create unsubscribe record
      await storage.createUnsubscribe({
        email: email as string,
        clientId: parsedClientId,
        reason: null,
      });
      
      res.send(`
        <!DOCTYPE html>
        <html>
          <head><title>Desuscrito Exitosamente - LandFlow</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>✓ Desuscrito Exitosamente</h1>
            <p>El email <strong>${email}</strong> ha sido eliminado de nuestras comunicaciones.</p>
            <p>Lamentamos verte partir.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Error - LandFlow</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>❌ Error</h1>
            <p>Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.</p>
          </body>
        </html>
      `);
    }
  });

  // POST /api/public/unsubscribe - Unsubscribe from emails (no auth required)
  app.post("/api/public/unsubscribe", async (req, res) => {
    try {
      const validatedData = insertUnsubscribeSchema.parse(req.body);
      
      // Check if already unsubscribed
      const existing = await storage.getUnsubscribeByEmail(validatedData.email, validatedData.clientId);
      if (existing) {
        return res.json({ success: true, message: "Already unsubscribed" });
      }
      
      await storage.createUnsubscribe(validatedData);
      res.json({ success: true, message: "Successfully unsubscribed" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });
}
