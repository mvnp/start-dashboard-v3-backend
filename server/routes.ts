import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBusinessSchema, insertStaffSchema, insertClientSchema, insertBarberPlanSchema, insertServiceSchema, insertAppointmentSchema, insertPaymentGatewaySchema, insertAccountingTransactionSchema, insertSupportTicketSchema, insertFaqSchema, insertWhatsappInstanceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Business routes
  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  app.post("/api/businesses", async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create business" });
    }
  });

  app.put("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBusinessSchema.partial().parse(req.body);
      const business = await storage.updateBusiness(id, validatedData);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update business" });
    }
  });

  app.delete("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBusiness(id);
      if (!success) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json({ message: "Business deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete business" });
    }
  });

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
      const { username, password, ...staffData } = req.body;
      
      // First create the user if username and password are provided
      let userId = null;
      if (username && password) {
        const userData = insertUserSchema.parse({ username, password });
        const user = await storage.createUser(userData);
        userId = user.id;
      }
      
      // Create staff with the user ID
      const validatedStaffData = insertStaffSchema.parse({
        ...staffData,
        user_id: userId
      });
      const staff = await storage.createStaff(validatedStaffData);
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

  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Barber Plans routes
  app.get("/api/barber-plans", async (req, res) => {
    try {
      const plans = await storage.getAllBarberPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch barber plans" });
    }
  });

  app.get("/api/barber-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getBarberPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Barber plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch barber plan" });
    }
  });

  app.post("/api/barber-plans", async (req, res) => {
    try {
      const validatedData = insertBarberPlanSchema.parse(req.body);
      const plan = await storage.createBarberPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create barber plan" });
    }
  });

  app.put("/api/barber-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBarberPlanSchema.partial().parse(req.body);
      const plan = await storage.updateBarberPlan(id, validatedData);
      if (!plan) {
        return res.status(404).json({ error: "Barber plan not found" });
      }
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update barber plan" });
    }
  });

  app.delete("/api/barber-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBarberPlan(id);
      if (!deleted) {
        return res.status(404).json({ error: "Barber plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete barber plan" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, validatedData);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAppointment(id);
      if (!deleted) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Payment Gateway routes
  app.get("/api/payment-gateways", async (req, res) => {
    try {
      const gateways = await storage.getAllPaymentGateways();
      res.json(gateways);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment gateways" });
    }
  });

  app.get("/api/payment-gateways/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gateway = await storage.getPaymentGateway(id);
      if (!gateway) {
        return res.status(404).json({ error: "Payment gateway not found" });
      }
      res.json(gateway);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment gateway" });
    }
  });

  app.post("/api/payment-gateways", async (req, res) => {
    try {
      const validatedData = insertPaymentGatewaySchema.parse(req.body);
      const gateway = await storage.createPaymentGateway(validatedData);
      res.status(201).json(gateway);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create payment gateway" });
    }
  });

  app.put("/api/payment-gateways/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPaymentGatewaySchema.partial().parse(req.body);
      const gateway = await storage.updatePaymentGateway(id, validatedData);
      if (!gateway) {
        return res.status(404).json({ error: "Payment gateway not found" });
      }
      res.json(gateway);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update payment gateway" });
    }
  });

  app.delete("/api/payment-gateways/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePaymentGateway(id);
      if (!deleted) {
        return res.status(404).json({ error: "Payment gateway not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment gateway" });
    }
  });

  // Accounting Transaction routes
  app.get("/api/accounting-transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllAccountingTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounting transactions" });
    }
  });

  app.get("/api/accounting-transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getAccountingTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Accounting transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounting transaction" });
    }
  });

  app.post("/api/accounting-transactions", async (req, res) => {
    try {
      const validatedData = insertAccountingTransactionSchema.parse(req.body);
      const transaction = await storage.createAccountingTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create accounting transaction" });
    }
  });

  app.put("/api/accounting-transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAccountingTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateAccountingTransaction(id, validatedData);
      if (!transaction) {
        return res.status(404).json({ error: "Accounting transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update accounting transaction" });
    }
  });

  app.delete("/api/accounting-transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAccountingTransaction(id);
      if (!deleted) {
        return res.status(404).json({ error: "Accounting transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete accounting transaction" });
    }
  });

  // Support Tickets routes
  app.get("/api/support-tickets", async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/support-tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ error: "Support ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support ticket" });
    }
  });

  app.post("/api/support-tickets", async (req, res) => {
    try {
      const validatedData = insertSupportTicketSchema.parse(req.body);
      const ticket = await storage.createSupportTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  app.put("/api/support-tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupportTicketSchema.partial().parse(req.body);
      const ticket = await storage.updateSupportTicket(id, validatedData);
      if (!ticket) {
        return res.status(404).json({ error: "Support ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update support ticket" });
    }
  });

  app.delete("/api/support-tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSupportTicket(id);
      if (!deleted) {
        return res.status(404).json({ error: "Support ticket not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete support ticket" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const faq = await storage.getFaq(id);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQ" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create FAQ" });
    }
  });

  app.put("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(id, validatedData);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFaq(id);
      if (!deleted) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });

  // WhatsApp Instance routes
  app.get("/api/whatsapp-instances", async (req, res) => {
    try {
      const instances = await storage.getAllWhatsappInstances();
      res.json(instances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch WhatsApp instances" });
    }
  });

  app.get("/api/whatsapp-instances/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const instance = await storage.getWhatsappInstance(id);
      if (!instance) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.json(instance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch WhatsApp instance" });
    }
  });

  app.post("/api/whatsapp-instances", async (req, res) => {
    try {
      const validatedData = insertWhatsappInstanceSchema.parse(req.body);
      const instance = await storage.createWhatsappInstance(validatedData);
      res.status(201).json(instance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create WhatsApp instance" });
    }
  });

  app.put("/api/whatsapp-instances/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWhatsappInstanceSchema.partial().parse(req.body);
      const instance = await storage.updateWhatsappInstance(id, validatedData);
      if (!instance) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.json(instance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update WhatsApp instance" });
    }
  });

  app.delete("/api/whatsapp-instances/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWhatsappInstance(id);
      if (!deleted) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete WhatsApp instance" });
    }
  });

  app.post("/api/whatsapp-instances/:id/generate-qr", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const qrCode = await storage.generateQrCode(id);
      if (!qrCode) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.json({ qr_code: qrCode });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  app.post("/api/whatsapp-instances/:id/connect", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { session_id } = req.body;
      if (!session_id) {
        return res.status(400).json({ error: "session_id is required" });
      }
      const success = await storage.connectInstance(id, session_id);
      if (!success) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect instance" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
