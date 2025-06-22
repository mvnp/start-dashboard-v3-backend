import { Express, Request, Response } from "express";
import { z } from "zod";
import storage from "./storage";

import { 
  authenticateJWT, 
  authenticateUser as jwtAuthenticateUser, 
  refreshAccessToken,
  AuthenticatedRequest
} from "./auth";
import { getBusinessFilter } from "./middleware";


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
  insertSettingsSchema,
  insertTraductionSchema,
} from "@shared/schema";

export function registerRoutes(app: Express): void {
  
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: JWT User authentication
   *     description: Authenticate user with email and password, returns JWT access token and refresh token with 24-hour lifetime.
   *     tags: [JWT Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "mvnpereira@gmail.com"
   *               password:
   *                 type: string
   *                 example: "Marcos$1986"
   *     responses:
   *       200:
   *         description: Login successful with JWT tokens
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message: { type: string, example: "Login successful" }
   *                 user:
   *                   type: object
   *                   properties:
   *                     userId: { type: integer, example: 1 }
   *                     email: { type: string, example: "mvnpereira@gmail.com" }
   *                     roleId: { type: integer, example: 1 }
   *                     businessIds: { type: array, items: { type: integer }, example: [1] }
   *                     isSuperAdmin: { type: boolean, example: true }
   *                 accessToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   *                 refreshToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   *                 tokenType: { type: string, example: "Bearer" }
   *                 expiresIn: { type: string, example: "24h" }
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Server error
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: "Missing credentials",
          message: "Email and password are required"
        });
      }

      const authResult = await jwtAuthenticateUser(email, password);
      
      if (!authResult) {
        return res.status(401).json({ 
          error: "Invalid credentials",
          message: "Email or password is incorrect"
        });
      }

      res.json({
        message: "Login successful",
        user: authResult.user,
        accessToken: authResult.accessToken,
        refreshToken: authResult.refreshToken,
        tokenType: "Bearer",
        expiresIn: "24h"
      });
    } catch (error) {
      console.error("JWT Login error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Unable to process login request"
      });
    }
  });

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh JWT access token
   *     description: Use refresh token to get a new access token before the current one expires
   *     tags: [JWT Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message: { type: string, example: "Token refreshed successfully" }
   *                 accessToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   *                 refreshToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
   *                 tokenType: { type: string, example: "Bearer" }
   *                 expiresIn: { type: string, example: "24h" }
   *       401:
   *         description: Invalid or expired refresh token
   *       500:
   *         description: Server error
   */
  app.post("/api/auth/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ 
          error: "Missing refresh token",
          message: "Refresh token is required"
        });
      }

      const refreshResult = await refreshAccessToken(refreshToken);
      
      if (!refreshResult) {
        return res.status(401).json({ 
          error: "Invalid refresh token",
          message: "Refresh token is invalid or expired"
        });
      }

      res.json({
        message: "Token refreshed successfully",
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
        tokenType: "Bearer",
        expiresIn: "24h"
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Unable to refresh token"
      });
    }
  });

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Get current user profile (JWT)
   *     description: Get current authenticated user information using JWT Bearer token
   *     tags: [JWT Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     userId: { type: integer, example: 1 }
   *                     email: { type: string, example: "mvnpereira@gmail.com" }
   *                     roleId: { type: integer, example: 1 }
   *                     businessIds: { type: array, items: { type: integer }, example: [1] }
   *                     isSuperAdmin: { type: boolean, example: true }
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   */
  app.get("/api/auth/me", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error("Get user profile error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        message: "Unable to fetch user profile"
      });
    }
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
      
      // JWT-only authentication - no session updates needed
      
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
  app.get("/api/businesses", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      
      let businesses;
      // Super Admin (role ID: 1) can see all businesses
      if (user.isSuperAdmin) {
        businesses = await storage.getAllBusinesses();
      } else {
        // For non-Super Admin users, fetch fresh business associations from database
        // This ensures we get current business access even if JWT token is outdated
        const userData = await storage.getUserWithRoleAndBusiness(user.userId);
        if (!userData) {
          return res.status(401).json({ error: "User not found" });
        }
        
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

  app.get("/api/businesses/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid business ID" });
      }
      
      const business = await storage.getBusiness(id);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      // Super Admin can access any business
      if (user.isSuperAdmin) {
        return res.json(business);
      }

      // For merchants (Role ID 2), fetch fresh business associations from database
      let userBusinessIds = user.businessIds;
      if (user.roleId === 2) {
        const userData = await storage.getUserWithRoleAndBusiness(user.userId);
        userBusinessIds = userData?.businessIds || [];
      }

      // For merchants and other users, check if they have access to this business
      if (!userBusinessIds.includes(id)) {
        return res.status(403).json({ 
          error: "Access denied. You can only view businesses you have access to." 
        });
      }

      res.json(business);
    } catch (error) {
      console.error("Business fetch error:", error);
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  app.post("/api/businesses", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      
      // Only Super Admin (role ID: 1) can create businesses
      if (!user.isSuperAdmin) {
        return res.status(403).json({ 
          error: "Access denied. Only Super Admin can create businesses." 
        });
      }
      
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

  app.put("/api/businesses/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Super Admin can edit any business
      if (user.isSuperAdmin) {
        const validatedData = insertBusinessSchema.partial().parse(req.body);
        const business = await storage.updateBusiness(id, validatedData);
        if (!business) {
          return res.status(404).json({ error: "Business not found" });
        }
        return res.json(business);
      }
      
      // Merchant can only edit their own businesses
      if (user.roleId === 2) {
        if (!user.businessIds.includes(id)) {
          return res.status(403).json({ 
            error: "Access denied. You can only edit your own businesses." 
          });
        }
        
        const validatedData = insertBusinessSchema.partial().parse(req.body);
        const business = await storage.updateBusiness(id, validatedData);
        if (!business) {
          return res.status(404).json({ error: "Business not found" });
        }
        return res.json(business);
      }
      
      // Other roles (employee, client, financials) cannot manage businesses
      return res.status(403).json({ 
        error: "Access denied. You don't have permission to manage businesses." 
      });
      
    } catch (error) {
      console.error("Business update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update business" });
    }
  });

  app.delete("/api/businesses/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Only Super Admin can delete businesses
      if (!user.isSuperAdmin) {
        return res.status(403).json({ 
          error: "Access denied. Only Super Admin can delete businesses." 
        });
      }
      
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
  app.get("/api/staff", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);

      let persons;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        persons = await storage.getPersonsByRoles([1, 2, 3]);
      } 
      // For selected business or non-Super Admin users (including merchants)
      else if (businessIds && businessIds.length > 0) {
        persons = await storage.getPersonsByRolesAndBusiness([1, 2, 3], businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        persons = [];
      }
      
      res.json(persons);
    } catch (error) {
      console.error("Staff fetch error:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.get("/api/staff/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid staff ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Get staff member's business associations
          let staffBusinessIds: number[] = [];
          if (person.user_id) {
            const userBusinessRole = await storage.getUserWithRoleAndBusiness(person.user_id);
            if (userBusinessRole) {
              staffBusinessIds = userBusinessRole.businessIds || [];
            }
          }
          
          // Check if staff member belongs to the selected business context
          if (!selectedBusinessIdNum || !staffBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view staff members from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let staffBusinessIds: number[] = [];
          if (person.user_id) {
            const userBusinessRole = await storage.getUserWithRoleAndBusiness(person.user_id);
            if (userBusinessRole) {
              staffBusinessIds = userBusinessRole.businessIds || [];
            }
          }

          let userBusinessIds = currentUser.businessIds;
          const hasCommonBusiness = staffBusinessIds.some(businessId => 
            userBusinessIds.includes(businessId)
          );

          if (!hasCommonBusiness) {
            return res.status(403).json({ 
              error: "Access denied. You can only view staff members from businesses you have access to." 
            });
          }
        }
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

  app.post("/api/staff", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const { email, role_id, ...personData } = req.body;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create staff in businesses you have access to." 
          });
        }
      }
      
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

  app.put("/api/staff/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      const { email, business_id, role_id, ...personData } = req.body;
      
      // Get current person data
      const currentPerson = await storage.getPerson(id);
      if (!currentPerson) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        if (business_id) {
          // For merchants (Role ID 2), fetch fresh business associations from database
          let userBusinessIds = user.businessIds;
          if (user.roleId === 2) {
            const userData = await storage.getUserWithRoleAndBusiness(user.userId);
            userBusinessIds = userData?.businessIds || [];
          }

          const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
          if (!userBusinessIds.includes(businessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You can only edit staff in businesses you have access to." 
            });
          }
        }

        // Also check if the staff member being edited belongs to user's businesses
        if (currentPerson.user_id) {
          const staffUserData = await storage.getUserWithRoleAndBusiness(currentPerson.user_id);
          if (staffUserData) {
            // For merchants, ensure staff belongs to their businesses
            if (user.roleId === 2) {
              const userData = await storage.getUserWithRoleAndBusiness(user.userId);
              const userBusinessIds = userData?.businessIds || [];
              const hasCommonBusiness = staffUserData.businessIds.some(bid => userBusinessIds.includes(bid));
              
              if (!hasCommonBusiness) {
                return res.status(403).json({ 
                  error: "Access denied. You can only edit staff from businesses you have access to." 
                });
              }
            }
          }
        }
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

  app.delete("/api/staff/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
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

  /**
   * @swagger
   * /api/clients:
   *   get:
   *     summary: Get all clients
   *     description: Retrieve all clients with business-based filtering. Super Admin sees all clients, others see only clients from their businesses.
   *     tags: [Client Management]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of clients
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Person'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   */
  app.get("/api/clients", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);

      let persons;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        persons = await storage.getPersonsByRoles([4]);
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        persons = await storage.getPersonsByRolesAndBusiness([4], businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        persons = [];
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

  app.get("/api/clients/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid client ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (user.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      // Get business context from selected business
      const businessIds = getBusinessFilter(user, req);
      // Super Admin has unrestricted access (businessIds === null)
      if (!user.isSuperAdmin && (!businessIds || businessIds.length === 0)) {
        return res.status(403).json({ error: "No business access" });
      }

      const person = await storage.getPerson(id);
      if (!person) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (user.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Get client's business associations
          let clientBusinessIds: number[] = [];
          if (person.user_id) {
            const userBusinessRole = await storage.getUserWithRoleAndBusiness(person.user_id);
            if (userBusinessRole) {
              clientBusinessIds = userBusinessRole.businessIds || [];
            }
          }
          
          // Check if client belongs to the selected business context
          if (!selectedBusinessIdNum || !clientBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view clients from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let clientBusinessIds: number[] = [];
          if (person.user_id) {
            const userBusinessRole = await storage.getUserWithRoleAndBusiness(person.user_id);
            if (userBusinessRole) {
              clientBusinessIds = userBusinessRole.businessIds || [];
            }
          }

          let userBusinessIds = user.businessIds;
          const hasCommonBusiness = clientBusinessIds.some(businessId => 
            userBusinessIds.includes(businessId)
          );

          if (!hasCommonBusiness) {
            return res.status(403).json({ 
              error: "Access denied. You can only view clients from businesses you have access to." 
            });
          }
        }
      }

      // Get associated user email if exists
      let userEmail = null;
      if (person.user_id) {
        const clientUser = await storage.getUser(person.user_id);
        userEmail = clientUser?.email || null;
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

  app.post("/api/clients", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const { email, first_name, last_name, phone, tax_id, address } = req.body;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = currentUser.businessIds;
        if (currentUser.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create clients in businesses you have access to." 
          });
        }
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

      // Validate that the business exists
      const businessExists = await storage.getBusiness(business_id);
      if (!businessExists) {
        return res.status(400).json({
          error: "Invalid business ID",
          details: [{ path: ["business_id"], message: "Business does not exist" }]
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
      
      // Create user account
      const generatedPassword = Math.random().toString(36).slice(-8);
      const userData = insertUserSchema.parse({ 
        email: email.trim(), 
        password: generatedPassword 
      });
      const newUser = await storage.createUser(userData);

      // Create person record with address
      const validatedPersonData = insertPersonSchema.parse({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        phone: phone.trim(),
        tax_id: tax_id?.trim() || null,
        address: address?.trim() || null,
        user_id: newUser.id
      });
      const person = await storage.createPerson(validatedPersonData);

      // Create user-business relationship (assign to client role - role 4)
      await storage.createUserBusiness(insertUserBusinessSchema.parse({
        user_id: newUser.id,
        business_id: business_id
      }));

      await storage.createUserRole(insertUserRoleSchema.parse({
        user_id: newUser.id,
        role_id: 4 // Client role
      }));

      res.status(201).json({ ...person, user: { email: newUser.email } });
    } catch (error) {
      console.error("Client creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { email, first_name, last_name, phone, tax_id, address } = req.body;

      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!req.user!.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = req.user!.businessIds;
        if (req.user!.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(req.user!.userId);
          userBusinessIds = userData?.businessIds || [];
        }
        
        if (!userBusinessIds.includes(business_id)) {
          return res.status(403).json({ error: "No access to this business" });
        }
      }

      // Validate that the business exists
      const businessExists = await storage.getBusiness(business_id);
      if (!businessExists) {
        return res.status(400).json({
          error: "Invalid business ID",
          details: [{ path: ["business_id"], message: "Business does not exist" }]
        });
      }

      // Get existing client data
      const existingClient = await storage.getPerson(id);
      if (!existingClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Validate that the client belongs to the specified business
      if (existingClient.user_id) {
        const userWithBusiness = await storage.getUserWithRoleAndBusiness(existingClient.user_id);
        if (!userWithBusiness || !userWithBusiness.businessIds.includes(business_id)) {
          return res.status(404).json({ error: "Client not found in this business" });
        }
      } else {
        return res.status(404).json({ error: "Client has no business association" });
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

  app.delete("/api/clients/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get business context from selected business
      const businessIds = getBusinessFilter(req.user!, req);
      // Super Admin has unrestricted access (businessIds === null)
      if (!req.user!.isSuperAdmin && (!businessIds || businessIds.length === 0)) {
        return res.status(403).json({ error: "No business access" });
      }

      // Get existing client data with business filtering
      const existingClient = await storage.getPerson(id);
      if (!existingClient) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Check if the client's user has access to the selected business
      if (existingClient.user_id) {
        const userWithBusiness = await storage.getUserWithRoleAndBusiness(existingClient.user_id);
        if (!userWithBusiness || !userWithBusiness.businessIds.some(bid => businessIds.includes(bid))) {
          return res.status(404).json({ error: "Client not found" });
        }
      } else {
        return res.status(404).json({ error: "Client not found" });
      }

      const deleted = await storage.deletePerson(id);
      if (!deleted) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Client deletion error:", error);
      
      // Handle specific dependency constraint errors
      if (error instanceof Error && error.message.includes("existing appointments")) {
        return res.status(400).json({ 
          error: "Cannot delete client with existing appointments",
          message: "Please cancel or reassign all appointments for this client before deletion."
        });
      }
      
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  /**
   * @swagger
   * /api/services:
   *   get:
   *     summary: Get all services
   *     description: Retrieve all services with business-based filtering. Super Admin sees all services, others see only services from their businesses.
   *     tags: [Service Management]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of services
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Service'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   *   post:
   *     summary: Create a new service
   *     description: Create a new service for the business
   *     tags: [Service Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - duration
   *               - price
   *               - business_id
   *             properties:
   *               name: { type: string, example: "Premium Haircut" }
   *               description: { type: string, example: "Professional haircut with styling" }
   *               duration: { type: integer, example: 60 }
   *               price: { type: number, format: decimal, example: 35.00 }
   *               business_id: { type: integer, example: 1 }
   *     responses:
   *       201:
   *         description: Service created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Service'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  app.get("/api/services", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);

      console.log(businessIds);

      let services;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        services = await storage.getAllServices();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        services = await storage.getServicesByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        services = [];
      }
      res.json(services);
    } catch (error) {
      console.error("Service fetch error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid service ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (user.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (user.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if service belongs to the selected business context
          if (!selectedBusinessIdNum || service.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view services from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = user.businessIds;
          if (!userBusinessIds.includes(service.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view services from businesses you have access to." 
            });
          }
        }
      }

      res.json(service);
    } catch (error) {
      console.error("Service fetch error:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/services", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create services in businesses you have access to." 
          });
        }
      }
      
      const serviceData = {
        ...req.body,
        business_id: business_id
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

  app.put("/api/services/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Get business_id from request body or header
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }

      // Get existing service to verify it exists
      const existingService = await storage.getService(id);
      if (!existingService) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Prevent moving services between businesses - applies to all users including Super Admin
      if (business_id && business_id !== existingService.business_id) {
        return res.status(400).json({ 
          error: "Cannot change business_id of existing service. Services must remain in their original business." 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        // Verify the existing service belongs to user's accessible businesses
        if (existingService.business_id && !userBusinessIds.includes(existingService.business_id)) {
          return res.status(403).json({ error: "Access denied to this service" });
        }

        // If business_id is provided, validate user has access to it
        if (business_id) {
          const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
          if (!userBusinessIds.includes(businessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You can only update services in businesses you have access to." 
            });
          }
        }
      }
      
      // Always use existing service's business_id to prevent business transfer
      const updateData = {
        ...req.body,
        business_id: existingService.business_id
      };
      
      // Validate required fields for updates
      if (updateData.name !== undefined && (!updateData.name || !updateData.name.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["name"], message: "Service name is required" }]
        });
      }
      
      if (updateData.price !== undefined && (!updateData.price || updateData.price.trim() === "" || parseFloat(updateData.price) <= 0)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["price"], message: "Price must be a valid number greater than 0" }]
        });
      }
      
      if (updateData.duration !== undefined && (!updateData.duration || updateData.duration < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["duration"], message: "Duration must be at least 1 minute" }]
        });
      }
      
      const validatedData = insertServiceSchema.partial().parse(updateData);
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

  app.delete("/api/services/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user!;
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid service ID" });
      }
      
      // Get business context from selected business
      const businessIds = getBusinessFilter(user, req);
      // Super Admin has unrestricted access (businessIds === null)
      if (!user.isSuperAdmin && (!businessIds || businessIds.length === 0)) {
        return res.status(403).json({ error: "No business access" });
      }

      // Get existing service to verify business access
      const existingService = await storage.getService(id);
      if (!existingService) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Verify service belongs to user's accessible businesses
      if (!user.isSuperAdmin && existingService.business_id && !businessIds.includes(existingService.business_id)) {
        return res.status(403).json({ error: "Access denied to this service" });
      }

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

  /**
   * @swagger
   * /api/appointments:
   *   get:
   *     summary: Get appointments with filtering and pagination
   *     description: Retrieve appointments with business-based filtering, pagination, and various filters like status, date range, etc.
   *     tags: [Appointment Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 25
   *         description: Number of appointments per page
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [Scheduled, Confirmed, Completed, Cancelled]
   *         description: Filter by appointment status
   *       - in: query
   *         name: today
   *         schema:
   *           type: boolean
   *         description: Filter for today's appointments only
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for date range filter
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for date range filter
   *     responses:
   *       200:
   *         description: Paginated list of appointments
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 appointments:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Appointment'
   *                 total: { type: integer, example: 150 }
   *                 totalPages: { type: integer, example: 6 }
   *                 currentPage: { type: integer, example: 1 }
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   *   post:
   *     summary: Create a new appointment
   *     description: Create a new appointment for a client with a staff member
   *     tags: [Appointment Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - appointment_date
   *               - appointment_time
   *               - status
   *               - user_id
   *               - client_id
   *               - service_id
   *             properties:
   *               appointment_date: { type: string, format: date, example: "2025-06-17" }
   *               appointment_time: { type: string, format: time, example: "14:30" }
   *               status: { type: string, enum: [Scheduled, Confirmed, Completed, Cancelled], example: "Scheduled" }
   *               notes: { type: string, example: "Client prefers shorter sides" }
   *               user_id: { type: integer, example: 1 }
   *               client_id: { type: integer, example: 2 }
   *               service_id: { type: integer, example: 1 }
   *     responses:
   *       201:
   *         description: Appointment created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Appointment'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  app.get("/api/appointments", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      
      // Extract query parameters for filtering and pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
      const status = req.query.status as string;
      const today = req.query.today === 'true';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      let appointments;
      const selectedBusinessId = req.headers['x-selected-business-id'] as string;
      
      // For merchants (Role ID 2), require explicit business selection
      if (user.roleId === 2 && !selectedBusinessId) {
        return res.status(400).json({ 
          error: "Business ID is required in x-selected-business-id header for merchant operations" 
        });
      }
      
      // If merchant provided business context, validate access
      if (user.roleId === 2 && selectedBusinessId) {
        const businessId = parseInt(selectedBusinessId);
        if (!user.businessIds.includes(businessId)) {
          return res.status(403).json({ 
            error: "Access denied to selected business" 
          });
        }
        // Use explicit merchant business selection
        appointments = await storage.getFilteredAppointments({
          page,
          limit,
          status,
          today,
          startDate,
          endDate,
          businessIds: [businessId]
        });
      }
      // Super Admin without business selection sees all data
      else if (user.isSuperAdmin && !selectedBusinessId) {
        appointments = await storage.getFilteredAppointments({
          page,
          limit,
          status,
          today,
          startDate,
          endDate,
          businessIds: null
        });
      } 
      // Super Admin with business selection sees filtered data
      else if (user.isSuperAdmin && selectedBusinessId) {
        const businessId = parseInt(selectedBusinessId);
        appointments = await storage.getFilteredAppointments({
          page,
          limit,
          status,
          today,
          startDate,
          endDate,
          businessIds: [businessId]
        });
      } 
      // Other users without business context get empty results
      else {
        appointments = { appointments: [], total: 0, totalPages: 0, currentPage: page };
      }

      // Map person IDs back to user IDs for staff members in all appointments
      if (appointments.appointments && appointments.appointments.length > 0) {
        const appointmentsWithUserIds = await Promise.all(
          appointments.appointments.map(async (appointment) => {
            let staffUserId = appointment.user_id;
            if (appointment.user_id) {
              const staffPerson = await storage.getPerson(appointment.user_id);
              if (staffPerson && staffPerson.user_id) {
                staffUserId = staffPerson.user_id;
              }
            }
            return {
              ...appointment,
              user_id: staffUserId
            };
          })
        );
        
        appointments.appointments = appointmentsWithUserIds;
      }

      res.json(appointments);
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid appointment ID" });
      }

      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Enhanced business context validation - appointment must belong to selected business
      const selectedBusinessId = req.headers['x-selected-business-id'] as string;
      
      if (selectedBusinessId) {
        const selectedBusinessIdNum = parseInt(selectedBusinessId);
        
        // When business context is provided, appointment MUST belong to that business
        if (isNaN(selectedBusinessIdNum) || appointment.business_id !== selectedBusinessIdNum) {
          return res.status(403).json({ 
            error: "Access denied. You can only view appointments from the selected business context." 
          });
        }
        
        // For merchants, also verify they have access to the selected business
        if (currentUser.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        }
      }
      // If no business context provided, use general business access validation for non-Super Admin
      else if (!currentUser.isSuperAdmin) {
        let userBusinessIds = currentUser.businessIds;
        if (!userBusinessIds.includes(appointment.business_id)) {
          return res.status(403).json({ 
            error: "Access denied. You can only view appointments from businesses you have access to." 
          });
        }
      }

      // Map person ID back to user ID for staff member dropdown
      let staffUserId = appointment.user_id;
      if (appointment.user_id) {
        const staffPerson = await storage.getPerson(appointment.user_id);
        if (staffPerson && staffPerson.user_id) {
          staffUserId = staffPerson.user_id;
        }
      }

      // Return appointment with corrected user_id for frontend display
      const appointmentResponse = {
        ...appointment,
        user_id: staffUserId
      };

      res.json(appointmentResponse);
    } catch (error) {
      console.error("Appointment fetch error:", error);
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create appointments in businesses you have access to." 
          });
        }
      }
      
      const appointmentData = {
        ...req.body,
        business_id: business_id
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
      
      // Validate service_id belongs to the selected business
      const service = await storage.getService(appointmentData.service_id);
      if (!service) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["service_id"], message: "Invalid service selected" }]
        });
      }
      
      const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
      if (service.business_id !== businessIdNum) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["service_id"], message: "Service must belong to the selected business context" }]
        });
      }
      
      // The frontend sends user_id but it's actually a person ID
      // Find the person record to get the actual user_id
      const staffPerson = await storage.getPerson(appointmentData.user_id);
      if (!staffPerson || !staffPerson.user_id) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["user_id"], message: "Invalid staff member selected" }]
        });
      }

      // Validate staff member belongs to the selected business through user-business relationship
      const staffUserData = await storage.getUserWithRoleAndBusiness(staffPerson.user_id);
      const staffBusinessIds = staffUserData?.businessIds || [];
      if (!staffBusinessIds.includes(businessIdNum)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["user_id"], message: "Staff member must belong to the selected business context" }]
        });
      }

      // Verify client_id exists in persons table - client_id should already be a person ID
      const clientPerson = await storage.getPerson(appointmentData.client_id);
      if (!clientPerson) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["client_id"], message: "Invalid client selected" }]
        });
      }
      
      // Validate client belongs to the selected business through user-business relationship
      if (clientPerson.user_id) {
        const clientUserData = await storage.getUserWithRoleAndBusiness(clientPerson.user_id);
        const clientBusinessIds = clientUserData?.businessIds || [];
        if (!clientBusinessIds.includes(businessIdNum)) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["client_id"], message: "Client must belong to the selected business context" }]
          });
        }
      }
      
      // Create appointment data with correct person ID for staff
      const appointmentDataWithPersonId = {
        ...appointmentData,
        user_id: appointmentData.user_id // Keep the person ID as sent from frontend
      };
      
      const validatedData = insertAppointmentSchema.parse(appointmentDataWithPersonId);
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

  app.put("/api/appointments/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get business context from selected business or request body
      const businessIds = getBusinessFilter(req.user, req);
      const businessId = businessIds?.[0] || req.body.business_id;
      
      if (!businessId) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["business_id"], message: "Business context is required" }]
        });
      }
      
      // Include business_id in update data
      const updateData = {
        ...req.body,
        business_id: businessId
      };
      
      // Validate required fields for updates
      if (updateData.appointment_date !== undefined && (!updateData.appointment_date || !updateData.appointment_date.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_date"], message: "Appointment date is required" }]
        });
      }
      
      if (updateData.appointment_time !== undefined && (!updateData.appointment_time || !updateData.appointment_time.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["appointment_time"], message: "Appointment time is required" }]
        });
      }
      
      if (updateData.status !== undefined && (!updateData.status || !updateData.status.trim())) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["status"], message: "Status is required" }]
        });
      }
      
      if (updateData.user_id !== undefined && (!updateData.user_id || updateData.user_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["user_id"], message: "Staff member is required" }]
        });
      }
      
      if (updateData.client_id !== undefined && (!updateData.client_id || updateData.client_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["client_id"], message: "Client is required" }]
        });
      }
      
      if (updateData.service_id !== undefined && (!updateData.service_id || updateData.service_id < 1)) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: [{ path: ["service_id"], message: "Service is required" }]
        });
      }
      
      // Validate service_id belongs to the business context if being updated
      if (updateData.service_id !== undefined) {
        const service = await storage.getService(updateData.service_id);
        if (!service) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["service_id"], message: "Invalid service selected" }]
          });
        }
        
        if (service.business_id !== businessId) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["service_id"], message: "Service must belong to the selected business context" }]
          });
        }
      }
      
      // The frontend sends user_id but it's actually a person ID if user_id is being updated
      if (updateData.user_id !== undefined) {
        const staffPerson = await storage.getPerson(updateData.user_id);
        if (!staffPerson || !staffPerson.user_id) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["user_id"], message: "Invalid staff member selected" }]
          });
        }
        
        // Validate staff member belongs to the business context through user-business relationship
        const staffUserData = await storage.getUserWithRoleAndBusiness(staffPerson.user_id);
        const staffBusinessIds = staffUserData?.businessIds || [];
        if (!staffBusinessIds.includes(businessId)) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["user_id"], message: "Staff member must belong to the selected business context" }]
          });
        }
        
        // Keep the person ID as sent from frontend
        updateData.user_id = updateData.user_id;
      }
      
      // Validate client belongs to the business context if being updated
      if (updateData.client_id !== undefined) {
        const clientPerson = await storage.getPerson(updateData.client_id);
        if (!clientPerson) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["client_id"], message: "Invalid client selected" }]
          });
        }
        
        // Validate client belongs to the selected business through user-business relationship
        if (clientPerson.user_id) {
          const clientUserData = await storage.getUserWithRoleAndBusiness(clientPerson.user_id);
          const clientBusinessIds = clientUserData?.businessIds || [];
          if (!clientBusinessIds.includes(businessId)) {
            return res.status(400).json({ 
              error: "Validation failed", 
              details: [{ path: ["client_id"], message: "Client must belong to the selected business context" }]
            });
          }
        }
      }

      // Verify client_id exists in persons table if client_id is being updated
      if (updateData.client_id !== undefined) {
        const clientPerson = await storage.getPerson(updateData.client_id);
        if (!clientPerson) {
          return res.status(400).json({ 
            error: "Validation failed", 
            details: [{ path: ["client_id"], message: "Invalid client selected" }]
          });
        }
      }
      
      const validatedData = insertAppointmentSchema.partial().parse(updateData);
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

  app.delete("/api/appointments/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
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
  app.get("/api/barber-plans", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let plans;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        plans = await storage.getAllBarberPlans(null);
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        plans = await storage.getAllBarberPlans(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        plans = [];
      }
      
      res.json(plans);
    } catch (error) {
      console.error("Barber plan fetch error:", error);
      res.status(500).json({ error: "Failed to fetch barber plans" });
    }
  });

  app.get("/api/barber-plans/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid barber plan ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const plan = await storage.getBarberPlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Barber plan not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if barber plan belongs to the selected business context
          if (!selectedBusinessIdNum || plan.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view barber plans from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = currentUser.businessIds;
          if (!userBusinessIds.includes(plan.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view barber plans from businesses you have access to." 
            });
          }
        }
      }

      res.json(plan);
    } catch (error) {
      console.error("Barber plan fetch error:", error);
      res.status(500).json({ error: "Failed to fetch barber plan" });
    }
  });

  app.post("/api/barber-plans", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create barber plans in businesses you have access to." 
          });
        }
      }

      const validatedData = insertBarberPlanSchema.parse({
        ...req.body,
        business_id: business_id
      });
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

  app.put("/api/barber-plans/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get business ID from header (frontend) or request body (API tools)
      const headerBusinessId = req.headers['x-selected-business-id'] ? parseInt(req.headers['x-selected-business-id'] as string) : null;
      const bodyBusinessId = req.body.business_id ? (typeof req.body.business_id === 'number' ? req.body.business_id : parseInt(req.body.business_id)) : null;
      const selectedBusinessId = headerBusinessId || bodyBusinessId;



      if (!selectedBusinessId || isNaN(selectedBusinessId)) {
        return res.status(400).json({ error: "Business ID is required and must be a valid number" });
      }
      
      // Validate business access
      const businessIds = getBusinessFilter(req.user, req);
      if (businessIds && !businessIds.includes(selectedBusinessId)) {
        return res.status(403).json({ error: "Access denied to this business" });
      }

      // Remove business_id from request body to avoid validation conflicts
      const { business_id, ...requestBodyWithoutBusinessId } = req.body;
      const validatedData = insertBarberPlanSchema.parse({
        ...requestBodyWithoutBusinessId,
        business_id: selectedBusinessId
      });
      const plan = await storage.updateBarberPlan(id, validatedData, businessIds);
      if (!plan) {
        return res.status(404).json({ error: "Barber plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Barber plan update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update barber plan" });
    }
  });

  app.delete("/api/barber-plans/:id", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const businessIds = getBusinessFilter(req.user, req);
      const success = await storage.deleteBarberPlan(id, businessIds);
      if (!success) {
        return res.status(404).json({ error: "Barber plan not found" });
      }
      res.json({ message: "Barber plan deleted successfully" });
    } catch (error) {
      console.error("Barber plan deletion error:", error);
      res.status(500).json({ error: "Failed to delete barber plan" });
    }
  });

  // Payment Gateway routes
  app.get("/api/payment-gateways", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let gateways;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        gateways = await storage.getAllPaymentGateways();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        gateways = await storage.getPaymentGatewaysByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        gateways = [];
      }
      
      res.json(gateways);
    } catch (error) {
      console.error("Payment gateway fetch error:", error);
      res.status(500).json({ error: "Failed to fetch payment gateways" });
    }
  });

  app.get("/api/payment-gateways/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid payment gateway ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const gateway = await storage.getPaymentGateway(id);
      if (!gateway) {
        return res.status(404).json({ error: "Payment gateway not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if gateway belongs to the selected business context
          if (!selectedBusinessIdNum || gateway.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view payment gateways from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = currentUser.businessIds;
          if (!userBusinessIds.includes(gateway.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view payment gateways from businesses you have access to." 
            });
          }
        }
      }

      res.json(gateway);
    } catch (error) {
      console.error("Payment gateway fetch error:", error);
      res.status(500).json({ error: "Failed to fetch payment gateway" });
    }
  });

  app.post("/api/payment-gateways", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create payment gateways in businesses you have access to." 
          });
        }
      }
      
      const validatedData = insertPaymentGatewaySchema.parse({
        ...req.body,
        business_id: business_id
      });
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

  // Dashboard Statistics routes
  app.get("/api/dashboard/stats", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessIds = getBusinessFilter(req.user, req);
      const stats = await storage.getDashboardStats(businessIds);
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  // Accounting Transaction Category routes
  app.get("/api/accounting-transaction-categories", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let categories;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        categories = await storage.getAllAccountingTransactionCategories();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        categories = await storage.getAccountingTransactionCategoriesByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        categories = [];
      }
      
      res.json(categories);
    } catch (error) {
      console.error("Accounting transaction categories fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounting transaction categories" });
    }
  });

  // User Businesses route
  /**
   * @swagger
   * /api/user-businesses:
   *   get:
   *     summary: Get businesses accessible to the current user
   *     tags: [User]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of businesses user has access to
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   address:
   *                     type: string
   *       401:
   *         description: Unauthorized
   */
  app.get("/api/user-businesses", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      console.log('User businesses request for:', user.email, 'Role ID:', user.roleId, 'Business IDs:', user.businessIds);
      
      if (user.isSuperAdmin) {
        // Super admin gets all businesses
        const businesses = await storage.getAllBusinesses();
        console.log('Super admin fetching all businesses:', businesses.length);
        res.json(businesses);
      } else {
        // Regular users get only their businesses
        const businesses = await storage.getBusinessesByIds(user.businessIds);
        console.log('Regular user fetching businesses:', businesses.length, 'for IDs:', user.businessIds);
        res.json(businesses);
      }
    } catch (error) {
      console.error("User businesses fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user businesses" });
    }
  });

  /**
   * @swagger
   * /api/accounting-transactions:
   *   get:
   *     summary: Get all accounting transactions
   *     description: Retrieve all accounting transactions with business-based filtering. Super Admin sees all transactions, others see only transactions from their businesses.
   *     tags: [Accounting Management]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of accounting transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/AccountingTransaction'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   *   post:
   *     summary: Create a new accounting transaction
   *     description: Create a new accounting transaction for the user's business
   *     tags: [Accounting Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - category_id
   *               - amount
   *               - description
   *               - transaction_date
   *             properties:
   *               type: 
   *                 type: string
   *                 enum: [revenue, expense]
   *                 example: "revenue"
   *               category_id: 
   *                 type: integer
   *                 example: 1
   *               amount: 
   *                 type: number
   *                 format: decimal
   *                 example: 150.00
   *               description: 
   *                 type: string
   *                 example: "Haircut service payment"
   *               transaction_date: 
   *                 type: string
   *                 format: date
   *                 example: "2025-06-17"
   *               notes: 
   *                 type: string
   *                 example: "Cash payment from client"
   *     responses:
   *       201:
   *         description: Transaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AccountingTransaction'
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   */
  app.get("/api/accounting-transactions", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let transactions;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        transactions = await storage.getAllAccountingTransactions();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        transactions = await storage.getAccountingTransactionsByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        transactions = [];
      }
      
      res.json(transactions);
    } catch (error) {
      console.error("Accounting transactions fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounting transactions" });
    }
  });

  /**
   * @swagger
   * /api/accounting-transactions/{id}:
   *   get:
   *     summary: Get a specific accounting transaction
   *     description: Retrieve a specific accounting transaction by ID with business access validation
   *     tags: [Accounting Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Transaction ID
   *     responses:
   *       200:
   *         description: Transaction details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AccountingTransaction'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Server error
   */
  app.get("/api/accounting-transactions/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const transaction = await storage.getAccountingTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if transaction belongs to the selected business context
          if (!selectedBusinessIdNum || transaction.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view transactions from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = currentUser.businessIds;
          if (!userBusinessIds.includes(transaction.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view transactions from businesses you have access to." 
            });
          }
        }
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Accounting transaction fetch error:", error);
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/accounting-transactions", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get business ID from header (frontend) or request body (API tools)
      const headerBusinessId = req.headers['x-selected-business-id'] ? parseInt(req.headers['x-selected-business-id'] as string) : null;
      const bodyBusinessId = req.body.business_id ? (typeof req.body.business_id === 'number' ? req.body.business_id : parseInt(req.body.business_id)) : null;
      const selectedBusinessId = headerBusinessId || bodyBusinessId;

      if (!selectedBusinessId || isNaN(selectedBusinessId)) {
        return res.status(400).json({ error: "Business ID is required and must be a valid number" });
      }

      // Validate business access
      const businessIds = getBusinessFilter(req.user, req);
      if (businessIds && !businessIds.includes(selectedBusinessId)) {
        return res.status(403).json({ error: "Access denied to this business" });
      }
      
      const validatedData = insertAccountingTransactionSchema.parse({
        ...req.body,
        business_id: selectedBusinessId
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

  /**
   * @swagger
   * /api/accounting-transactions/{id}:
   *   put:
   *     summary: Update an accounting transaction
   *     description: Update an existing accounting transaction with business access validation
   *     tags: [Accounting Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Transaction ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               type: 
   *                 type: string
   *                 enum: [revenue, expense]
   *                 example: "expense"
   *               category_id: 
   *                 type: integer
   *                 example: 2
   *               amount: 
   *                 type: number
   *                 format: decimal
   *                 example: 75.50
   *               description: 
   *                 type: string
   *                 example: "Office supplies purchase"
   *               transaction_date: 
   *                 type: string
   *                 format: date
   *                 example: "2025-06-17"
   *               notes: 
   *                 type: string
   *                 example: "Monthly office supply order"
   *     responses:
   *       200:
   *         description: Transaction updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AccountingTransaction'
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       403:
   *         description: Access denied to this transaction
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Server error
   */
  app.put("/api/accounting-transactions/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get business ID from header (frontend) or request body (API tools)
      const headerBusinessId = req.headers['x-selected-business-id'] ? parseInt(req.headers['x-selected-business-id'] as string) : null;
      const bodyBusinessId = req.body.business_id ? (typeof req.body.business_id === 'number' ? req.body.business_id : parseInt(req.body.business_id)) : null;
      const selectedBusinessId = headerBusinessId || bodyBusinessId;

      if (!selectedBusinessId || isNaN(selectedBusinessId)) {
        return res.status(400).json({ error: "Business ID is required and must be a valid number" });
      }

      // Validate business access
      const businessIds = getBusinessFilter(req.user, req);
      if (businessIds && !businessIds.includes(selectedBusinessId)) {
        return res.status(403).json({ error: "Access denied to this business" });
      }
      
      // First check if transaction exists and user has access
      const existingTransaction = await storage.getAccountingTransaction(id);
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Verify user has access to this transaction's business
      if (businessIds && existingTransaction.business_id && !businessIds.includes(existingTransaction.business_id)) {
        return res.status(403).json({ error: "Access denied to this transaction" });
      }
      
      // Remove business_id from request body to avoid validation conflicts
      const { business_id, ...requestBodyWithoutBusinessId } = req.body;
      const validatedData = insertAccountingTransactionSchema.partial().parse({
        ...requestBodyWithoutBusinessId,
        business_id: selectedBusinessId
      });
      const transaction = await storage.updateAccountingTransaction(id, validatedData, businessIds);
      
      res.json(transaction);
    } catch (error) {
      console.error("Accounting transaction update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update accounting transaction" });
    }
  });

  /**
   * @swagger
   * /api/accounting-transactions/{id}:
   *   delete:
   *     summary: Delete an accounting transaction
   *     description: Delete an existing accounting transaction with business access validation
   *     tags: [Accounting Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Transaction ID
   *     responses:
   *       204:
   *         description: Transaction deleted successfully
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       403:
   *         description: Access denied to this transaction
   *       404:
   *         description: Transaction not found
   *       500:
   *         description: Server error
   */
  app.delete("/api/accounting-transactions/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const businessIds = getBusinessFilter(req.user, req);
      
      // First check if transaction exists and user has access
      const existingTransaction = await storage.getAccountingTransaction(id);
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Verify user has access to this transaction's business
      if (businessIds && existingTransaction.business_id && !businessIds.includes(existingTransaction.business_id)) {
        return res.status(403).json({ error: "Access denied to this transaction" });
      }
      
      const deleted = await storage.deleteAccountingTransaction(id, businessIds);
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
  app.get("/api/support-tickets", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let tickets;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        tickets = await storage.getAllSupportTickets();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        tickets = await storage.getSupportTicketsByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        tickets = [];
      }
      
      res.json(tickets);
    } catch (error) {
      console.error("Support ticket fetch error:", error);
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/support-tickets/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid support ticket ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const ticket = await storage.getSupportTicket(id);
      if (!ticket) {
        return res.status(404).json({ error: "Support ticket not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if ticket belongs to the selected business context
          if (!selectedBusinessIdNum || ticket.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view support tickets from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = currentUser.businessIds;
          if (!userBusinessIds.includes(ticket.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view support tickets from businesses you have access to." 
            });
          }
        }
      }

      res.json(ticket);
    } catch (error) {
      console.error("Support ticket fetch error:", error);
      res.status(500).json({ error: "Failed to fetch support ticket" });
    }
  });

  app.post("/api/support-tickets", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create support tickets in businesses you have access to." 
          });
        }
      }
      
      const validatedData = insertSupportTicketSchema.parse({
        ...req.body,
        business_id: business_id
      });
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

  app.get("/api/whatsapp-instances", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      const businessIds = getBusinessFilter(user, req);
      
      let instances;
      // Super Admin can see all data when no business is selected
      if (user.isSuperAdmin && businessIds === null) {
        instances = await storage.getAllWhatsappInstances();
      } 
      // For selected business or non-Super Admin users
      else if (businessIds && businessIds.length > 0) {
        instances = await storage.getWhatsappInstancesByBusinessIds(businessIds);
      } 
      // Non-Super Admin without selected business gets empty array
      else {
        instances = [];
      }
      
      res.json(instances);
    } catch (error) {
      console.error("WhatsApp instance fetch error:", error);
      res.status(500).json({ error: "Failed to fetch WhatsApp instances" });
    }
  });

  app.get("/api/whatsapp-instances/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const currentUser = req.user!;
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid WhatsApp instance ID" });
      }
      
      // For merchants (Role ID: 2), business context is MANDATORY
      if (currentUser.roleId === 2) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (!selectedBusinessId) {
          return res.status(400).json({ 
            error: "Business ID is required in x-selected-business-id header for merchant operations" 
          });
        }
      }
      
      const instance = await storage.getWhatsappInstance(id);
      if (!instance) {
        return res.status(404).json({ error: "WhatsApp instance not found" });
      }

      // Validate business access for non-Super Admin users
      if (!currentUser.isSuperAdmin) {
        // For merchants (Role ID: 2), enforce strict business context validation
        if (currentUser.roleId === 2) {
          const selectedBusinessId = req.headers['x-selected-business-id'] as string;
          const selectedBusinessIdNum = selectedBusinessId ? parseInt(selectedBusinessId) : null;
          
          // Check if instance belongs to the selected business context
          if (!selectedBusinessIdNum || instance.business_id !== selectedBusinessIdNum) {
            return res.status(403).json({ 
              error: "Access denied. You can only view WhatsApp instances from the selected business context." 
            });
          }
          
          // Verify user has access to the selected business
          const userData = await storage.getUserWithRoleAndBusiness(currentUser.userId);
          const userBusinessIds = userData?.businessIds || [];
          if (!userBusinessIds.includes(selectedBusinessIdNum)) {
            return res.status(403).json({ 
              error: "Access denied. You don't have access to this business." 
            });
          }
        } else {
          // For other non-Super Admin users, use general business access validation
          let userBusinessIds = currentUser.businessIds;
          if (!userBusinessIds.includes(instance.business_id)) {
            return res.status(403).json({ 
              error: "Access denied. You can only view WhatsApp instances from businesses you have access to." 
            });
          }
        }
      }

      res.json(instance);
    } catch (error) {
      console.error("WhatsApp instance fetch error:", error);
      res.status(500).json({ error: "Failed to fetch WhatsApp instance" });
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

  app.post("/api/whatsapp-instances", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user!;
      
      // Get business_id from request body or header - MANDATORY for all users including Super Admin
      let business_id = req.body.business_id;
      if (!business_id) {
        const selectedBusinessId = req.headers['x-selected-business-id'] as string;
        if (selectedBusinessId) {
          business_id = parseInt(selectedBusinessId);
        }
      }
      
      if (!business_id) {
        return res.status(400).json({ 
          error: "Business ID is required in request body or x-selected-business-id header" 
        });
      }

      // Validate business access for non-Super Admin users
      if (!user.isSuperAdmin) {
        // For merchants (Role ID 2), fetch fresh business associations from database
        let userBusinessIds = user.businessIds;
        if (user.roleId === 2) {
          const userData = await storage.getUserWithRoleAndBusiness(user.userId);
          userBusinessIds = userData?.businessIds || [];
        }

        const businessIdNum = typeof business_id === 'string' ? parseInt(business_id) : business_id;
        if (!userBusinessIds.includes(businessIdNum)) {
          return res.status(403).json({ 
            error: "Access denied. You can only create WhatsApp instances in businesses you have access to." 
          });
        }
      }
      
      const validatedData = insertWhatsappInstanceSchema.parse({
        ...req.body,
        business_id: business_id,
        status: 'Disconnected' as const
      });
      
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

  app.put("/api/whatsapp-instances/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
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

  app.delete("/api/whatsapp-instances/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
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

  /**
   * @swagger
   * /api/faqs:
   *   get:
   *     summary: Get all FAQs
   *     description: Retrieve all FAQs. All authenticated users can view FAQs. No business context filtering.
   *     tags: [FAQ Management]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of FAQs
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   question:
   *                     type: string
   *                     example: "What is SaaS?"
   *                   answer:
   *                     type: string
   *                     example: "SaaS stands for Software as a Service..."
   *                   category:
   *                     type: string
   *                     example: "General"
   *                   is_published:
   *                     type: boolean
   *                     example: true
   *                   order_index:
   *                     type: integer
   *                     example: 1
   *                   created_at:
   *                     type: string
   *                     format: date-time
   *                   updated_at:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       500:
   *         description: Server error
   *   post:
   *     summary: Create a new FAQ
   *     description: Create a new FAQ. Only Super Admin (Role ID 1) can create FAQs.
   *     tags: [FAQ Management]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - question
   *               - answer
   *             properties:
   *               question:
   *                 type: string
   *                 example: "What is SaaS?"
   *               answer:
   *                 type: string
   *                 example: "SaaS stands for Software as a Service..."
   *               category:
   *                 type: string
   *                 example: "General"
   *               is_published:
   *                 type: boolean
   *                 example: true
   *               order_index:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       201:
   *         description: FAQ created successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       403:
   *         description: Forbidden - only Super Admin can create FAQs
   *       500:
   *         description: Server error
   */
  app.get("/api/faqs", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const faqs = await storage.getAllFaqs();
      res.json(faqs);
    } catch (error) {
      console.error("FAQs fetch error:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/faqs", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Only Super Admin (Role ID: 1) can create FAQs
      if (!req.user?.isSuperAdmin) {
        return res.status(403).json({ error: "Access denied", message: "Only Super Admin can create FAQs" });
      }

      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      console.error("FAQ creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create FAQ" });
    }
  });

  /**
   * @swagger
   * /api/faqs/{id}:
   *   get:
   *     summary: Get a specific FAQ
   *     description: Retrieve a specific FAQ by ID. All authenticated users can view FAQs.
   *     tags: [FAQ Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: FAQ ID
   *     responses:
   *       200:
   *         description: FAQ details
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   *   put:
   *     summary: Update a FAQ
   *     description: Update a FAQ. Only Super Admin (Role ID 1) can update FAQs.
   *     tags: [FAQ Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: FAQ ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               question:
   *                 type: string
   *               answer:
   *                 type: string
   *               category:
   *                 type: string
   *               is_published:
   *                 type: boolean
   *               order_index:
   *                 type: integer
   *     responses:
   *       200:
   *         description: FAQ updated successfully
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       403:
   *         description: Forbidden - only Super Admin can update FAQs
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   *   delete:
   *     summary: Delete a FAQ
   *     description: Delete a FAQ. Only Super Admin (Role ID 1) can delete FAQs.
   *     tags: [FAQ Management]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: FAQ ID
   *     responses:
   *       204:
   *         description: FAQ deleted successfully
   *       401:
   *         description: Unauthorized - invalid or missing token
   *       403:
   *         description: Forbidden - only Super Admin can delete FAQs
   *       404:
   *         description: FAQ not found
   *       500:
   *         description: Server error
   */
  app.get("/api/faqs/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate ID parameter
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid FAQ ID" });
      }
      
      const faq = await storage.getFaq(id);
      
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      
      res.json(faq);
    } catch (error) {
      console.error("FAQ fetch error:", error);
      res.status(500).json({ error: "Failed to fetch FAQ" });
    }
  });

  app.put("/api/faqs/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Only Super Admin (Role ID: 1) can update FAQs
      if (!req.user?.isSuperAdmin) {
        return res.status(403).json({ error: "Access denied", message: "Only Super Admin can update FAQs" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertFaqSchema.partial().parse(req.body);
      
      const faq = await storage.updateFaq(id, validatedData);
      if (!faq) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      
      res.json(faq);
    } catch (error) {
      console.error("FAQ update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  });

  app.delete("/api/faqs/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Only Super Admin (Role ID: 1) can delete FAQs
      if (!req.user?.isSuperAdmin) {
        return res.status(403).json({ error: "Access denied", message: "Only Super Admin can delete FAQs" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deleteFaq(id);
      
      if (!success) {
        return res.status(404).json({ error: "FAQ not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("FAQ deletion error:", error);
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });

  // Settings routes
  app.get("/api/settings", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessId = parseInt(req.headers['x-selected-business-id'] as string);
      
      if (!businessId || isNaN(businessId)) {
        return res.status(400).json({ error: "Business ID is required" });
      }

      // Verify user has access to this business
      if (!req.user?.isSuperAdmin && !req.user?.businessIds?.includes(businessId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      let settings = await storage.getSettings(businessId);
      
      // If no settings exist, create default ones
      if (!settings) {
        const defaultSettings = {
          language: 'en',
          timezone: 'UTC',
          currency: 'USD',
          business_id: businessId
        };
        settings = await storage.createSettings(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Settings fetch error:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get business ID from header or body
      const businessIdFromHeader = parseInt(req.headers['x-selected-business-id'] as string);
      const businessIdFromBody = req.body.business_id;
      const businessId = businessIdFromHeader || businessIdFromBody;
      
      if (!businessId || isNaN(businessId)) {
        return res.status(400).json({ error: "Business ID is required" });
      }

      // Verify user has access to this business
      if (!req.user?.isSuperAdmin && !req.user?.businessIds?.includes(businessId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const validatedData = insertSettingsSchema.parse({
        ...req.body,
        business_id: businessId
      });

      // Check if settings exist
      let settings = await storage.getSettings(businessId);
      
      if (!settings) {
        // Create new settings
        settings = await storage.createSettings(validatedData);
      } else {
        // Update existing settings
        settings = await storage.updateSettings(businessId, validatedData);
      }
      
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Settings update error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.delete("/api/settings", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const businessId = parseInt(req.headers['x-selected-business-id'] as string);
      
      if (!businessId || isNaN(businessId)) {
        return res.status(400).json({ error: "Business ID is required" });
      }

      // Verify user has access to this business
      if (!req.user?.isSuperAdmin && !req.user?.businessIds?.includes(businessId)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const success = await storage.deleteSettings(businessId);
      if (!success) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Settings deletion error:", error);
      res.status(500).json({ error: "Failed to delete settings" });
    }
  });

  // Translation API routes for edition mode
  app.get("/api/traductions/:language", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { language } = req.params;
      
      if (language === 'en') {
        // Return English source strings
        const englishStrings = await storage.getAllTraductions();
        res.json(englishStrings);
      } else {
        // Return translations for the specified language
        const translations = await storage.getTranslationsByLanguage(language);
        res.json(translations);
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.get("/api/traductions/:string/:language", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { string, language } = req.params;
      const decodedString = decodeURIComponent(string);
      
      if (language === 'en') {
        const englishString = await storage.getTraductionByString(decodedString);
        res.json(englishString);
      } else {
        // Find the English source string first
        const sourceString = await storage.getTraductionByString(decodedString);
        if (!sourceString) {
          return res.status(404).json({ error: "Source string not found" });
        }
        
        const translation = await storage.getTranslation(sourceString.id, language);
        res.json(translation);
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  app.post("/api/traductions", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { string, traduction, language, traduction_id } = req.body;
      
      if (language === 'en') {
        // Creating/updating English source string
        const validatedData = insertTraductionSchema.parse({ string });
        const result = await storage.createTraduction(validatedData);
        return res.status(201).json(result);
      }
      
      // If traduction_id is provided (from TranslatableText component), use it directly
      let sourceStringId = traduction_id;
      
      if (!sourceStringId) {
        // Fallback: Find or create the English source string
        let sourceString = await storage.getTraductionByString(string);
        if (!sourceString) {
          sourceString = await storage.createTraduction({ string });
        }
        sourceStringId = sourceString.id;
      }
      
      // Create or update the translation
      const translation = await storage.createOrUpdateTranslation(sourceStringId, language, traduction);
      res.json(translation);
    } catch (error) {
      console.error("Error creating/updating translation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create/update translation" });
    }
  });

  app.put("/api/traductions/:string/:language", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { string, language } = req.params;
      const { traduction } = req.body;
      const decodedString = decodeURIComponent(string);
      
      if (!traduction || typeof traduction !== 'string') {
        return res.status(400).json({ error: "Translation text is required" });
      }
      
      if (language === 'en') {
        return res.status(400).json({ error: "Cannot update English source strings via this endpoint" });
      }
      
      // Find the English source string
      const sourceString = await storage.getTraductionByString(decodedString);
      if (!sourceString) {
        return res.status(404).json({ error: "Source string not found" });
      }
      
      const updated = await storage.createOrUpdateTranslation(sourceString.id, language, traduction);
      res.json(updated);
    } catch (error) {
      console.error("Error updating translation:", error);
      res.status(500).json({ error: "Failed to update translation" });
    }
  });

  // Bulk endpoint to get all translations for a language
  app.get("/api/translations/bulk/:language", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { language } = req.params;
      
      if (!language || language.length !== 2) {
        return res.status(400).json({ error: "Valid 2-letter language code is required" });
      }
      
      const translations = await storage.getBulkTranslations(language);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching bulk translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.delete("/api/translations/:id", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid translation ID" });
      }
      
      const success = await storage.deleteTranslation(id);
      if (!success) {
        return res.status(404).json({ error: "Translation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting translation:", error);
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  // Routes are now registered, no need to return anything
}