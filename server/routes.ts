import type { Express } from "express";
import { storage } from "./storage.js";
import { 
  insertClientSchema, 
  updateClientSchema,
  insertSubscriptionSchema,
  updateSubscriptionSchema,
  insertPaymentSchema,
  updatePaymentSchema
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
}
