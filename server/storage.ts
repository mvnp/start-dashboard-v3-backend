import { users, type User, type InsertUser, type Staff, type InsertStaff, type Client, type InsertClient, type BarberPlan, type InsertBarberPlan } from "@shared/schema";

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
  
  // Barber Plan methods
  getAllBarberPlans(): Promise<BarberPlan[]>;
  getBarberPlan(id: number): Promise<BarberPlan | undefined>;
  createBarberPlan(plan: InsertBarberPlan): Promise<BarberPlan>;
  updateBarberPlan(id: number, plan: Partial<InsertBarberPlan>): Promise<BarberPlan | undefined>;
  deleteBarberPlan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staff: Map<number, Staff>;
  private clients: Map<number, Client>;
  private barberPlans: Map<number, BarberPlan>;
  private currentUserId: number;
  private currentStaffId: number;
  private currentClientId: number;
  private currentBarberPlanId: number;

  constructor() {
    this.users = new Map();
    this.staff = new Map();
    this.clients = new Map();
    this.barberPlans = new Map();
    this.currentUserId = 1;
    this.currentStaffId = 1;
    this.currentClientId = 1;
    this.currentBarberPlanId = 1;
    
    // Add sample data
    this.seedStaffData();
    this.seedClientData();
    this.seedBarberPlanData();
  }

  private seedStaffData() {
    const sampleStaff = [
      {
        first_name: "John",
        last_name: "Martinez",
        email: "john@barberpro.com",
        phone: "+1 (555) 123-4567",
        tax_id: "123-45-6789",
        role: "super-admin",
        hire_date: "2023-01-15",
        salary: 75000
      },
      {
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah@barberpro.com", 
        phone: "+1 (555) 234-5678",
        tax_id: "234-56-7890",
        role: "merchant",
        hire_date: "2023-03-20",
        salary: 55000
      },
      {
        first_name: "Mike",
        last_name: "Rodriguez",
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
        first_name: "David",
        last_name: "Wilson",
        email: "david.wilson@email.com",
        phone: "+1 (555) 456-7890",
        tax_id: "456-78-9012",
        type: "customer",
        address: "123 Main St, City, State 12345"
      },
      {
        first_name: "Emma",
        last_name: "Thompson",
        email: "emma.thompson@email.com",
        phone: "+1 (555) 567-8901",
        tax_id: "567-89-0123",
        type: "customer",
        address: "456 Oak Ave, City, State 12345"
      },
      {
        first_name: "James",
        last_name: "Brown",
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

  private seedBarberPlanData() {
    const samplePlans = [
      {
        title: "Basic Plan",
        subtitle: "Perfect for starting barbers",
        benefits: ["Online booking system", "Customer management", "Basic reporting"],
        image1: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400",
        image2: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400",
        price1m: 2999,
        price3m: 7999,
        price12m: 29999,
        payment_link: "https://payment.example.com/basic"
      },
      {
        title: "Professional Plan",
        subtitle: "For established barbershops",
        benefits: ["Everything in Basic", "Advanced analytics", "Staff management", "Inventory tracking"],
        image1: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
        image2: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
        price1m: 4999,
        price3m: 13999,
        price12m: 49999,
        payment_link: "https://payment.example.com/professional"
      }
    ];

    samplePlans.forEach((planData) => {
      const id = this.currentBarberPlanId++;
      const now = new Date();
      const plan: BarberPlan = {
        ...planData,
        id,
        created_at: now,
        updated_at: now
      };
      this.barberPlans.set(id, plan);
    });
  }

  async getAllBarberPlans(): Promise<BarberPlan[]> {
    return Array.from(this.barberPlans.values());
  }

  async getBarberPlan(id: number): Promise<BarberPlan | undefined> {
    return this.barberPlans.get(id);
  }

  async createBarberPlan(insertPlan: InsertBarberPlan): Promise<BarberPlan> {
    const id = this.currentBarberPlanId++;
    const now = new Date();
    const plan: BarberPlan = { 
      ...insertPlan, 
      id,
      created_at: now,
      updated_at: now
    };
    this.barberPlans.set(id, plan);
    return plan;
  }

  async updateBarberPlan(id: number, updateData: Partial<InsertBarberPlan>): Promise<BarberPlan | undefined> {
    const existingPlan = this.barberPlans.get(id);
    if (!existingPlan) return undefined;
    
    const updatedPlan: BarberPlan = {
      ...existingPlan,
      ...updateData,
      updated_at: new Date()
    };
    this.barberPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteBarberPlan(id: number): Promise<boolean> {
    return this.barberPlans.delete(id);
  }
}

export const storage = new MemStorage();
