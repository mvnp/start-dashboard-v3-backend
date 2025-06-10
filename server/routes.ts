import { Express } from "express";
import { z } from "zod";
import storage from "./storage";
import {
  insertUserSchema,
  insertBusinessSchema,
  insertPersonSchema,
  insertServiceSchema,
  insertAppointmentSchema,
  insertBarberPlanSchema,
  insertPaymentGatewaySchema,
  insertAccountingTransactionSchema,
  insertSupportTicketSchema,
  insertFaqSchema,
  insertWhatsappInstanceSchema,
  insertUserBusinessSchema,
  insertUserRoleSchema,
} from "@shared/schema";

export function registerRoutes(app: Express): void {
  
  // Business routes
  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Business fetch error:", error);
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
      console.error("Business fetch error:", error);
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  app.post("/api/businesses", async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      console.error("Business creation error:", error);
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
      console.error("Business update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update business" });
    }
  });

  app.delete("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBusiness(id);
      if (!deleted) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Business deletion error:", error);
      res.status(500).json({ error: "Failed to delete business" });
    }
  });

  // Staff routes (using persons table now)
  app.get("/api/staff", async (req, res) => {
    try {
      const persons = await storage.getAllPersons();
      res.json(persons);
    } catch (error) {
      console.error("Staff fetch error:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.get("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json(person);
    } catch (error) {
      console.error("Staff fetch error:", error);
      res.status(500).json({ error: "Failed to fetch staff member" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const { email, password, business_id, role, ...personData } = req.body;
      
      // Only create user if both email and password are provided and not empty
      let userId = null;
      if (email && email.trim() && password && password.trim()) {
        try {
          const userData = insertUserSchema.parse({ email: email.trim(), password });
          const user = await storage.createUser(userData);
          userId = user.id;
        } catch (userError) {
          console.error("User creation error:", userError);
          return res.status(400).json({ error: "Failed to create user account", details: userError });
        }
      }
      
      // Create person record with or without user_id
      const validatedPersonData = insertPersonSchema.parse({
        ...personData,
        user_id: userId
      });
      const person = await storage.createPerson(validatedPersonData);
      
      // Create junction table relationships if user was created
      if (userId && business_id) {
        try {
          const userBusinessData = insertUserBusinessSchema.parse({
            user_id: userId,
            business_id: typeof business_id === 'string' ? parseInt(business_id) : business_id
          });
          await storage.createUserBusiness(userBusinessData);
        } catch (businessError) {
          console.error("User-business relationship creation error:", businessError);
        }
      }
      
      if (userId && role) {
        try {
          // Find role by type to get role_id
          const roles = await storage.getAllRoles();
          const selectedRole = roles.find(r => r.type === role);
          if (selectedRole) {
            const userRoleData = insertUserRoleSchema.parse({
              user_id: userId,
              role_id: selectedRole.id
            });
            await storage.createUserRole(userRoleData);
          }
        } catch (roleError) {
          console.error("User-role relationship creation error:", roleError);
        }
      }
      
      res.status(201).json(person);
    } catch (error) {
      console.error("Staff creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPersonSchema.partial().parse(req.body);
      const person = await storage.updatePerson(id, validatedData);
      if (!person) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.json(person);
    } catch (error) {
      console.error("Staff update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update staff member" });
    }
  });

  app.delete("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePerson(id);
      if (!deleted) {
        return res.status(404).json({ error: "Staff member not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Staff deletion error:", error);
      res.status(500).json({ error: "Failed to delete staff member" });
    }
  });

  // Client routes (also using persons table)
  app.get("/api/clients", async (req, res) => {
    try {
      const persons = await storage.getAllPersons();
      res.json(persons);
    } catch (error) {
      console.error("Client fetch error:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(person);
    } catch (error) {
      console.error("Client fetch error:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const { email, type, address, business_id, role_id, ...personData } = req.body;
      
      let userId = null;
      
      // If email is provided, create user account with generated password
      if (email && email.trim()) {
        try {
          // Generate a random password (8 characters)
          const generatedPassword = Math.random().toString(36).slice(-8);
          
          const userData = insertUserSchema.parse({ 
            email: email.trim(), 
            password: generatedPassword 
          });
          const user = await storage.createUser(userData);
          userId = user.id;
        } catch (userError) {
          console.error("User creation error:", userError);
          return res.status(400).json({ error: "Failed to create user account", details: userError });
        }
      }
      
      // Filter out fields that don't exist in the new schema and create person record
      const validatedPersonData = insertPersonSchema.parse({
        first_name: personData.first_name,
        last_name: personData.last_name,
        phone: personData.phone,
        tax_id: personData.tax_id,
        user_id: userId
      });
      const person = await storage.createPerson(validatedPersonData);
      
      // Create junction table relationships if user was created and business/role selected
      if (userId && business_id) {
        try {
          const userBusinessData = insertUserBusinessSchema.parse({
            user_id: userId,
            business_id: parseInt(business_id)
          });
          await storage.createUserBusiness(userBusinessData);
        } catch (businessError) {
          console.error("User-business relationship creation error:", businessError);
        }
      }
      
      if (userId && role_id) {
        try {
          const userRoleData = insertUserRoleSchema.parse({
            user_id: userId,
            role_id: parseInt(role_id)
          });
          await storage.createUserRole(userRoleData);
        } catch (roleError) {
          console.error("User-role relationship creation error:", roleError);
        }
      }
      
      res.status(201).json(person);
    } catch (error) {
      console.error("Client creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPersonSchema.partial().parse(req.body);
      const person = await storage.updatePerson(id, validatedData);
      if (!person) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(person);
    } catch (error) {
      console.error("Client update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePerson(id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Client deletion error:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Service fetch error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Service creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Appointment creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  // Barber Plan routes
  app.get("/api/barber-plans", async (req, res) => {
    try {
      const plans = await storage.getAllBarberPlans();
      res.json(plans);
    } catch (error) {
      console.error("Barber plan fetch error:", error);
      res.status(500).json({ error: "Failed to fetch barber plans" });
    }
  });

  app.post("/api/barber-plans", async (req, res) => {
    try {
      const validatedData = insertBarberPlanSchema.parse(req.body);
      const plan = await storage.createBarberPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Barber plan creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create barber plan" });
    }
  });

  // Payment Gateway routes
  app.get("/api/payment-gateways", async (req, res) => {
    try {
      const gateways = await storage.getAllPaymentGateways();
      res.json(gateways);
    } catch (error) {
      console.error("Payment gateway fetch error:", error);
      res.status(500).json({ error: "Failed to fetch payment gateways" });
    }
  });

  app.post("/api/payment-gateways", async (req, res) => {
    try {
      const validatedData = insertPaymentGatewaySchema.parse(req.body);
      const gateway = await storage.createPaymentGateway(validatedData);
      res.status(201).json(gateway);
    } catch (error) {
      console.error("Payment gateway creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create payment gateway" });
    }
  });

  // Accounting Transaction routes
  app.get("/api/accounting", async (req, res) => {
    try {
      const transactions = await storage.getAllAccountingTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Accounting transaction fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounting transactions" });
    }
  });

  app.post("/api/accounting", async (req, res) => {
    try {
      const validatedData = insertAccountingTransactionSchema.parse(req.body);
      const transaction = await storage.createAccountingTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Accounting transaction creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create accounting transaction" });
    }
  });

  // Support Ticket routes
  app.get("/api/support-tickets", async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Support ticket fetch error:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.post("/api/support-tickets", async (req, res) => {
    try {
      const validatedData = insertSupportTicketSchema.parse(req.body);
      const ticket = await storage.createSupportTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Support ticket creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
    } catch (error) {
      console.error("FAQ fetch error:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      console.error("FAQ creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create FAQ" });
    }
  });

  // Role routes
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json(roles);
    } catch (error) {
      console.error("Role fetch error:", error);
      res.status(500).json({ error: "Failed to fetch roles" });
    }
  });

  // WhatsApp Instance routes
  app.get("/api/whatsapp", async (req, res) => {
    try {
      const instances = await storage.getAllWhatsappInstances();
      res.json(instances);
    } catch (error) {
      console.error("WhatsApp instance fetch error:", error);
      res.status(500).json({ error: "Failed to fetch WhatsApp instances" });
    }
  });

  app.post("/api/whatsapp", async (req, res) => {
    try {
      const validatedData = insertWhatsappInstanceSchema.parse(req.body);
      const instance = await storage.createWhatsappInstance(validatedData);
      res.status(201).json(instance);
    } catch (error) {
      console.error("WhatsApp instance creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create WhatsApp instance" });
    }
  });

  // Routes are now registered, no need to return anything
}