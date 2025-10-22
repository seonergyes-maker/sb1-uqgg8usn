import type { Express } from "express";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Example API route
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  // Add your API routes here
}
