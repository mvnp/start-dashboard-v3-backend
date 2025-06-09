import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStaffSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Staff routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staff = await storage.getStaff(id);
      if (!staff) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff member" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const validatedData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(validatedData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertStaffSchema.partial().parse(req.body);
      const staff = await storage.updateStaff(id, validatedData);
      if (!staff) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update staff member" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteStaff(id);
      if (!deleted) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete staff member" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
