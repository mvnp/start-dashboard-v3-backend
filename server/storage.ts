import { users, type User, type InsertUser, type Staff, type InsertStaff, type Client, type InsertClient } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Staff methods
  getAllStaff(): Promise<Staff[]>;
  getStaff(id: number): Promise<Staff | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<InsertStaff>): Promise<Staff | undefined>;
  deleteStaff(id: number): Promise<boolean>;
  
  // Client methods
  getAllClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staff: Map<number, Staff>;
  private clients: Map<number, Client>;
  private currentUserId: number;
  private currentStaffId: number;
  private currentClientId: number;

  constructor() {
    this.users = new Map();
    this.staff = new Map();
    this.clients = new Map();
    this.currentUserId = 1;
    this.currentStaffId = 1;
    this.currentClientId = 1;
    
    // Add sample data
    this.seedStaffData();
    this.seedClientData();
  }

  private seedStaffData() {
    const sampleStaff = [
      {
        name: "John Martinez",
        email: "john@barberpro.com",
        phone: "+1 (555) 123-4567",
        tax_id: "123-45-6789",
        role: "super-admin",
        hire_date: "2023-01-15",
        salary: 75000
      },
      {
        name: "Sarah Johnson",
        email: "sarah@barberpro.com", 
        phone: "+1 (555) 234-5678",
        tax_id: "234-56-7890",
        role: "merchant",
        hire_date: "2023-03-20",
        salary: 55000
      },
      {
        name: "Mike Rodriguez",
        email: "mike@barberpro.com",
        phone: "+1 (555) 345-6789", 
        tax_id: "345-67-8901",
        role: "collaborator",
        hire_date: "2023-06-10",
        salary: 45000
      }
    ];

    sampleStaff.forEach(staffData => {
      const id = this.currentStaffId++;
      const now = new Date();
      const staff: Staff = {
        ...staffData,
        id,
        created_at: now,
        updated_at: now
      };
      this.staff.set(id, staff);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async getStaff(id: number): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = this.currentStaffId++;
    const now = new Date();
    const staff: Staff = { 
      ...insertStaff, 
      id,
      created_at: now,
      updated_at: now
    };
    this.staff.set(id, staff);
    return staff;
  }

  async updateStaff(id: number, updateData: Partial<InsertStaff>): Promise<Staff | undefined> {
    const existingStaff = this.staff.get(id);
    if (!existingStaff) return undefined;
    
    const updatedStaff: Staff = {
      ...existingStaff,
      ...updateData,
      updated_at: new Date()
    };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }

  async deleteStaff(id: number): Promise<boolean> {
    return this.staff.delete(id);
  }

  private seedClientData() {
    const sampleClients = [
      {
        name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "+1 (555) 456-7890",
        tax_id: "456-78-9012",
        type: "customer",
        address: "123 Main St, City, State 12345"
      },
      {
        name: "Emma Thompson",
        email: "emma.thompson@email.com",
        phone: "+1 (555) 567-8901",
        tax_id: "567-89-0123",
        type: "customer",
        address: "456 Oak Ave, City, State 12345"
      },
      {
        name: "James Brown",
        email: "james.brown@email.com",
        phone: "+1 (555) 678-9012",
        tax_id: "678-90-1234",
        type: "customer",
        address: "789 Pine Rd, City, State 12345"
      }
    ];

    sampleClients.forEach(clientData => {
      const id = this.currentClientId++;
      const now = new Date();
      const client: Client = {
        ...clientData,
        id,
        created_at: now,
        updated_at: now
      };
      this.clients.set(id, client);
    });
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const now = new Date();
    const client: Client = { 
      ...insertClient, 
      id,
      created_at: now,
      updated_at: now
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const existingClient = this.clients.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient: Client = {
      ...existingClient,
      ...updateData,
      updated_at: new Date()
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
}

export const storage = new MemStorage();
