import type { Express } from "express";
import { storage } from "./storage.js";
import { insertClientSchema, updateClientSchema } from "../shared/schema.js";

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
}
