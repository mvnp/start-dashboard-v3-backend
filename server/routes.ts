import { Express, Request, Response } from "express";
import { z } from "zod";
import storage from "./storage";
import { requireAuth, getBusinessFilter } from "./middleware";

interface AuthenticatedRequest extends Request {
  session: any;
  user?: {
    id: number;
    email: string;
    roleId: number;
    businessIds: number[];
    isSuperAdmin: boolean;
  };
}
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
  
  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await storage.authenticateUser(email, password);
      
      if (!userData) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = userData.user.id;
      req.session.userEmail = userData.user.email;
      req.session.roleId = userData.roleId;
      req.session.businessIds = userData.businessIds;
      req.session.isAuthenticated = true;

      res.json({
        user: {
          id: userData.user.id,
          email: userData.user.email,
          roleId: userData.roleId,
          businessIds: userData.businessIds,
          isSuperAdmin: userData.roleId === 1
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", async (req, res) => {
    if (!req.session?.isAuthenticated || !req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const userData = await storage.getUserWithRoleAndBusiness(req.session.userId);
      if (!userData) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: userData.user.id,
          email: userData.user.email,
          roleId: userData.roleId,
          businessIds: userData.businessIds,
          isSuperAdmin: userData.roleId === 1
        }
      });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });

  app.get("/api/user", async (req, res) => {
    try {
      // Check if session exists and has user data
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const userData = await storage.getUserWithRoleAndBusiness(req.session.userId);
      if (!userData) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: userData.user.id,
          email: userData.user.email,
          roleId: userData.roleId,
          businessIds: userData.businessIds,
          isSuperAdmin: userData.roleId === 1
        }
      });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  });



  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get users by role for user switcher
  app.get("/api/users/by-role", async (req, res) => {
    try {
      // Get all roles first
      const roles = await storage.getAllRoles();
      const usersByRole = [];

      for (const role of roles) {
        // Only include super-admin (role ID 1) and merchant (role ID 2) users
        if (role.id === 1 || role.id === 2) {
          const users = await storage.getUsersByRole(role.type);
          // Add all users for this role, not just the first one
          for (const user of users) {
            usersByRole.push({
              id: user.id,
              email: user.email,
              roleId: role.id,
              roleType: role.type,
              roleName: role.description || role.type,
            });
          }
        }
      }

      res.json(usersByRole);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ error: "Failed to fetch users by role" });
    }
  });

  // User switching endpoint for testing different access levels
  app.post("/api/switch-user", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const userData = await storage.getUserWithRoleAndBusiness(parseInt(userId));
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Update session with new user data
      req.session.userId = userData.user.id;
      req.session.userEmail = userData.user.email;
      req.session.roleId = userData.roleId;
      req.session.businessIds = userData.businessIds;
      req.session.isAuthenticated = true;
      
      res.json({
        message: "User switched successfully",
        user: {
          id: userData.user.id,
          email: userData.user.email,
          roleId: userData.roleId,
          businessIds: userData.businessIds,
          isSuperAdmin: userData.roleId === 1
        }
      });
    } catch (error) {
      console.error("User switch error:", error);
      res.status(500).json({ error: "Failed to switch user" });
    }
  });
  
  // Business routes
  app.get("/api/businesses", async (req, res) => {
    try {
      // Allow testing with query parameter or use session
      const testUserId = req.query.user ? parseInt(req.query.user as string) : (req.session?.userId || 1);
      
      const userData = await storage.getUserWithRoleAndBusiness(testUserId);
      if (!userData) {
        return res.status(500).json({ error: "User not found" });
      }
      
      let businesses;
      // Super Admin (role ID: 1) can see all businesses
      if (userData.roleId === 1) {
        businesses = await storage.getAllBusinesses();
      } else {
        // Other users see only their associated businesses
        businesses = [];
        for (const businessId of userData.businessIds) {
          const business = await storage.getBusiness(businessId);
          if (business) businesses.push(business);
        }
      }
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

  // Staff routes (using persons table now) - roles 1,2,3 (super-admin, merchant, employee)
  app.get("/api/staff", async (req, res) => {
    try {
      // Allow testing with query parameter or use session
      const testUserId = req.query.user ? parseInt(req.query.user as string) : (req.session?.userId || 1);
      const userData = await storage.getUserWithRoleAndBusiness(testUserId);
      if (!userData) {
        return res.status(500).json({ error: "User not found" });
      }

      let persons;
      // Super Admin (role ID: 1) can see all staff across all businesses
      if (userData.roleId === 1) {
        persons = await storage.getPersonsByRoles([1, 2, 3]);
      } else {
        // Other users see only staff from their associated businesses
        persons = await storage.getPersonsByRolesAndBusiness([1, 2, 3], userData.businessIds);
      }
      
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

      // Get associated user email and business if exists
      let userEmail = null;
      let businessInfo = null;
      let roleId = null;
      let businessId = null;
      
      if (person.user_id) {
        const user = await storage.getUser(person.user_id);
        if (user) {
          userEmail = user.email;
        }

        // Get user's business and role information
        const userBusinessRole = await storage.getUserWithRoleAndBusiness(person.user_id);
        if (userBusinessRole) {
          roleId = userBusinessRole.roleId;
          if (userBusinessRole.businessIds && userBusinessRole.businessIds.length > 0) {
            businessId = userBusinessRole.businessIds[0];
            const business = await storage.getBusiness(businessId);
            if (business) {
              businessInfo = business;
            }
          }
        }
      }

      // Return person data with email, business info, and role
      res.json({
        ...person,
        email: userEmail,
        business: businessInfo,
        business_id: businessId,
        role_id: roleId
      });
    } catch (error) {
      console.error("Staff fetch error:", error);
      res.status(500).json({ error: "Failed to fetch staff member" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const { email, business_id, role_id, ...personData } = req.body;
      
      // Check for email uniqueness if email is provided
      if (email && email.trim()) {
        const existingUser = await storage.getUserByEmail(email.trim());
        if (existingUser) {
          return res.status(400).json({ error: "Email exists on database" });
        }
      }
      
      // Generate a random password if email is provided
      let userId = null;
      if (email && email.trim()) {
        try {
          const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
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
      
      if (userId && role_id) {
        try {
          const userRoleData = insertUserRoleSchema.parse({
            user_id: userId,
            role_id: typeof role_id === 'string' ? parseInt(role_id) : role_id
          });
          await storage.createUserRole(userRoleData);
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
      const { email, business_id, role_id, ...personData } = req.body;
      
      // Get current person data
      const currentPerson = await storage.getPerson(id);
      if (!currentPerson) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      // Check for email uniqueness if email is being updated
      if (email && email.trim()) {
        const existingUser = await storage.getUserByEmail(email.trim());
        
        // If email exists and it's not the current person's email, return error
        if (existingUser && existingUser.id !== currentPerson.user_id) {
          return res.status(400).json({ error: "Email exists on database" });
        }
        
        // Update user email if person has a user account
        if (currentPerson.user_id) {
          await storage.updateUser(currentPerson.user_id, { email: email.trim() });
        }
      }
      
      // Update business relationship if business_id is provided and person has user_id
      if (business_id && currentPerson.user_id) {
        const businessIdNumber = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        await storage.updateUserBusiness(currentPerson.user_id, businessIdNumber);
      }

      // Update role relationship if role_id is provided and person has user_id
      if (role_id && currentPerson.user_id) {
        const roleIdNumber = typeof role_id === 'string' ? parseInt(role_id) : role_id;
        await storage.updateUserRole(currentPerson.user_id, roleIdNumber);
      }

      const validatedData = insertPersonSchema.partial().parse(personData);
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

  // Client routes (also using persons table) - role 4 (client)
  app.get("/api/clients", async (req, res) => {
    try {
      // Allow testing with query parameter or use session
      const testUserId = req.query.user ? parseInt(req.query.user as string) : (req.session?.userId || 1);
      const userData = await storage.getUserWithRoleAndBusiness(testUserId);
      if (!userData) {
        return res.status(500).json({ error: "User not found" });
      }

      let persons;
      // Super Admin (role ID: 1) can see all clients across all businesses
      if (userData.roleId === 1) {
        persons = await storage.getPersonsByRoles([4]);
      } else {
        // Other users see only clients from their associated businesses
        persons = await storage.getPersonsByRolesAndBusiness([4], userData.businessIds);
      }
      
      // Enrich each person with their user email if they have a user_id
      const enrichedPersons = await Promise.all(
        persons.map(async (person) => {
          if (person.user_id) {
            const user = await storage.getUser(person.user_id);
            return {
              ...person,
              email: user?.email || null
            };
          }
          return {
            ...person,
            email: null
          };
        })
      );
      
      res.json(enrichedPersons);
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

      // Get associated user email if exists
      let userEmail = null;
      if (person.user_id) {
        const user = await storage.getUser(person.user_id);
        userEmail = user?.email || null;
      }

      res.json({
        ...person,
        user: userEmail ? { email: userEmail } : null
      });
    } catch (error) {
      console.error("Client fetch error:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, first_name, last_name, phone, tax_id, address } = req.body;
      
      // Validate required fields
      if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: [
            { path: ["first_name"], message: "First name is required" },
            { path: ["last_name"], message: "Last name is required" },
            { path: ["email"], message: "Email is required" },
            { path: ["phone"], message: "Phone is required" }
          ].filter(err => !req.body[err.path[0]])
        });
      }

      // Check email uniqueness
      const existingUser = await storage.getUserByEmail(email.trim());
      if (existingUser) {
        return res.status(400).json({
          error: "Email already exists",
          details: [{ path: ["email"], message: "This email address is already registered" }]
        });
      }

      // Get user's business context
      const businessId = req.user?.businessIds?.[0] || 1;
      
      // Create user account
      const generatedPassword = Math.random().toString(36).slice(-8);
      const userData = insertUserSchema.parse({ 
        email: email.trim(), 
        password: generatedPassword 
      });
      const user = await storage.createUser(userData);

      // Create person record with address
      const validatedPersonData = insertPersonSchema.parse({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone.trim(),
        tax_id: tax_id?.trim() || null,
        address: address?.trim() || null,
        user_id: user.id
      });
      const person = await storage.createPerson(validatedPersonData);

      // Create user-business relationship (assign to client role - role 4)
      await storage.createUserBusiness(insertUserBusinessSchema.parse({
        user_id: user.id,
        business_id: businessId
      }));

      await storage.createUserRole(insertUserRoleSchema.parse({
        user_id: user.id,
        role_id: 4 // Client role
      }));

      res.status(201).json({ ...person, user: { email: user.email } });
    } catch (error) {
      console.error("Client creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { email, first_name, last_name, phone, tax_id, address } = req.body;

      // Get existing client data
      const existingClient = await storage.getPerson(id);
      if (!existingClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Validate required fields
      if (!first_name || !last_name || !email || !phone) {
        return res.status(400).json({ 
          error: "Missing required fields",
          details: [
            { path: ["first_name"], message: "First name is required" },
            { path: ["last_name"], message: "Last name is required" },
            { path: ["email"], message: "Email is required" },
            { path: ["phone"], message: "Phone is required" }
          ].filter(err => !req.body[err.path[0]])
        });
      }

      // Check email uniqueness (exclude current user)
      const existingUserWithEmail = await storage.getUserByEmail(email.trim());
      if (existingUserWithEmail && existingUserWithEmail.id !== existingClient.user_id) {
        return res.status(400).json({
          error: "Email already exists",
          details: [{ path: ["email"], message: "This email address is already registered" }]
        });
      }

      // Update person record
      const validatedPersonData = insertPersonSchema.partial().parse({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone.trim(),
        tax_id: tax_id?.trim() || null,
        address: address?.trim() || null,
      });
      const updatedPerson = await storage.updatePerson(id, validatedPersonData);

      // Update user email if user exists and email changed
      if (existingClient.user_id && (!existingUserWithEmail || existingUserWithEmail.email !== email.trim())) {
        await storage.updateUser(existingClient.user_id, { email: email.trim() });
      }

      res.json({ 
        ...updatedPerson, 
        user: { email: email.trim() }
      });
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
      // Use session-based authentication with query parameter override for testing
      const testUserId = req.query.user ? parseInt(req.query.user as string) : (req.session?.userId || 1);
      const userData = await storage.getUserWithRoleAndBusiness(testUserId);
      if (!userData) {
        return res.status(500).json({ error: "User not found" });
      }

      let services;
      // Super Admin (role ID: 1) can see all services
      if (userData.roleId === 1 || userData.isSuperAdmin) {
        services = await storage.getAllServices();
      } else {
        // Other users see services from their associated businesses + global services
        services = await storage.getServicesByBusinessIds(userData.businessIds);
      }
      res.json(services);
    } catch (error) {
      console.error("Service fetch error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Service fetch error:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get user's business context
      const businessId = req.user?.businessIds?.[0] || 1;
      
      const serviceData = {
        ...req.body,
        business_id: businessId
      };
      
      // Validate required fields
      if (!serviceData.name || !serviceData.name.trim()) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["name"], message: "Service name is required" }]
        });
      }
      
      if (!serviceData.price || serviceData.price.trim() === "" || parseFloat(serviceData.price) <= 0) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["price"], message: "Price must be a valid number greater than 0" }]
        });
      }
      
      if (!serviceData.duration || serviceData.duration < 1) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["duration"], message: "Duration must be at least 1 minute" }]
        });
      }
      
      const validatedData = insertServiceSchema.parse(serviceData);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Service creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate required fields for updates
      if (req.body.name !== undefined && (!req.body.name || !req.body.name.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["name"], message: "Service name is required" }]
        });
      }
      
      if (req.body.price !== undefined && (!req.body.price || req.body.price.trim() === "" || parseFloat(req.body.price) <= 0)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["price"], message: "Price must be a valid number greater than 0" }]
        });
      }
      
      if (req.body.duration !== undefined && (!req.body.duration || req.body.duration < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["duration"], message: "Duration must be at least 1 minute" }]
        });
      }
      
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Service update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Service deletion error:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      // Allow testing with query parameter or use session
      const testUserId = req.query.user ? parseInt(req.query.user as string) : (req.session?.userId || 1);
      
      const userData = await storage.getUserWithRoleAndBusiness(testUserId);
      if (!userData) {
        return res.status(500).json({ error: "User not found" });
      }
      
      // Extract query parameters for filtering and pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const status = req.query.status as string;
      const today = req.query.today === 'true';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      let appointments;
      // Super Admin (role ID: 1) can see all appointments
      if (userData.roleId === 1) {
        appointments = await storage.getFilteredAppointments({
          page,
          limit,
          status,
          today,
          startDate,
          endDate,
          businessIds: null
        });
      } else {
        // Other users see only appointments from their associated businesses
        appointments = await storage.getFilteredAppointments({
          page,
          limit,
          status,
          today,
          startDate,
          endDate,
          businessIds: userData.businessIds
        });
      }
      res.json(appointments);
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get user's business context
      const businessId = req.user?.businessIds?.[0] || 1;
      
      const appointmentData = {
        ...req.body,
        business_id: businessId
      };
      
      // Validate required fields
      if (!appointmentData.appointment_date || !appointmentData.appointment_date.trim()) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_date"], message: "Appointment date is required" }]
        });
      }
      
      if (!appointmentData.appointment_time || !appointmentData.appointment_time.trim()) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_time"], message: "Appointment time is required" }]
        });
      }
      
      if (!appointmentData.status || !appointmentData.status.trim()) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["status"], message: "Status is required" }]
        });
      }
      
      if (!appointmentData.user_id || appointmentData.user_id < 1) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["user_id"], message: "Staff member is required" }]
        });
      }
      
      if (!appointmentData.client_id || appointmentData.client_id < 1) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["client_id"], message: "Client is required" }]
        });
      }
      
      if (!appointmentData.service_id || appointmentData.service_id < 1) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["service_id"], message: "Service is required" }]
        });
      }
      
      const validatedData = insertAppointmentSchema.parse(appointmentData);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Appointment creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate required fields for updates
      if (req.body.appointment_date !== undefined && (!req.body.appointment_date || !req.body.appointment_date.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_date"], message: "Appointment date is required" }]
        });
      }
      
      if (req.body.appointment_time !== undefined && (!req.body.appointment_time || !req.body.appointment_time.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_time"], message: "Appointment time is required" }]
        });
      }
      
      if (req.body.status !== undefined && (!req.body.status || !req.body.status.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["status"], message: "Status is required" }]
        });
      }
      
      if (req.body.user_id !== undefined && (!req.body.user_id || req.body.user_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["user_id"], message: "Staff member is required" }]
        });
      }
      
      if (req.body.client_id !== undefined && (!req.body.client_id || req.body.client_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["client_id"], message: "Client is required" }]
        });
      }
      
      if (req.body.service_id !== undefined && (!req.body.service_id || req.body.service_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["service_id"], message: "Service is required" }]
        });
      }
      
      const validatedData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, validatedData);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Appointment update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAppointment(id);
      res.status(204).send();
    } catch (error) {
      console.error("Appointment deletion error:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
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

  // Accounting Transaction Category routes
  app.get("/api/accounting-transaction-categories", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessIds = getBusinessFilter(req.user);
      const categories = await storage.getAccountingTransactionCategoriesByBusinessIds(businessIds);
      res.json(categories);
    } catch (error) {
      console.error("Accounting transaction categories fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounting transaction categories" });
    }
  });

  // Accounting Transaction routes
  app.get("/api/accounting-transactions", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessIds = getBusinessFilter(req.user);
      const transactions = await storage.getAccountingTransactionsByBusinessIds(businessIds);
      res.json(transactions);
    } catch (error) {
      console.error("Accounting transactions fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounting transactions" });
    }
  });

  app.get("/api/accounting-transactions/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getAccountingTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Accounting transaction fetch error:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/accounting-transactions", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessIds = getBusinessFilter(req.user);
      const businessId = businessIds?.[0] || req.body.business_id;
      
      const validatedData = insertAccountingTransactionSchema.parse({
        ...req.body,
        business_id: businessId
      });
      
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

  app.put("/api/accounting-transactions/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAccountingTransactionSchema.partial().parse(req.body);
      
      const transaction = await storage.updateAccountingTransaction(id, validatedData);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      console.error("Accounting transaction update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update accounting transaction" });
    }
  });

  app.delete("/api/accounting-transactions/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAccountingTransaction(id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Accounting transaction deletion error:", error);
      res.status(500).json({ error: "Failed to delete accounting transaction" });
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

  // Users with super-admin role
  app.get("/api/users/super-admins", async (req, res) => {
    try {
      const users = await storage.getUsersByRole("super-admin");
      res.json(users);
    } catch (error) {
      console.error("Super-admin users fetch error:", error);
      res.status(500).json({ error: "Failed to fetch super-admin users" });
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

  app.get("/api/whatsapp-instances", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get all instances first
      const allInstances = await storage.getAllWhatsappInstances();
      
      // Filter by business access unless super admin
      let instances = allInstances;
      if (!req.user?.isSuperAdmin) {
        instances = allInstances.filter(instance => 
          req.user?.businessIds?.includes(instance.business_id!)
        );
      }
      
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

  app.post("/api/whatsapp-instances", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertWhatsappInstanceSchema.parse(req.body);
      
      // Add business_id from user's first business (or default to business 1 for super admin)
      const businessId = req.user?.businessIds?.[0] || 1;
      const instanceData = {
        ...validatedData,
        business_id: businessId,
        status: 'Disconnected' as const
      };
      
      const instance = await storage.createWhatsappInstance(instanceData);
      res.status(201).json(instance);
    } catch (error) {
      console.error("WhatsApp instance creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create WhatsApp instance" });
    }
  });

  app.put("/api/whatsapp-instances/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWhatsappInstanceSchema.partial().parse(req.body);
      
      // Verify the instance exists and user has access
      const existingInstance = await storage.getWhatsappInstance(id);
      if (!existingInstance) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      
      // Check business access unless super admin
      if (!req.user?.isSuperAdmin && !req.user?.businessIds?.includes(existingInstance.business_id!)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const instance = await storage.updateWhatsappInstance(id, validatedData);
      res.json(instance);
    } catch (error) {
      console.error("WhatsApp instance update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update WhatsApp instance" });
    }
  });

  app.delete("/api/whatsapp-instances/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verify the instance exists and user has access
      const existingInstance = await storage.getWhatsappInstance(id);
      if (!existingInstance) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      
      // Check business access unless super admin
      if (!req.user?.isSuperAdmin && !req.user?.businessIds?.includes(existingInstance.business_id!)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const success = await storage.deleteWhatsappInstance(id);
      if (!success) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("WhatsApp instance deletion error:", error);
      res.status(500).json({ error: "Failed to delete WhatsApp instance" });
    }
  });

  // Routes are now registered, no need to return anything
}