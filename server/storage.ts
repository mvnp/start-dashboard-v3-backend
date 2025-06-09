import { users, type User, type InsertUser, type Staff, type InsertStaff } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staff: Map<number, Staff>;
  private currentUserId: number;
  private currentStaffId: number;

  constructor() {
    this.users = new Map();
    this.staff = new Map();
    this.currentUserId = 1;
    this.currentStaffId = 1;
    
    // Add sample staff data
    this.seedStaffData();
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
}

export const storage = new MemStorage();
