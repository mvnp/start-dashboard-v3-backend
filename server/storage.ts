import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { users, business, staff, clients, barberPlans, services, appointments, paymentGateways, accountingTransactions, supportTickets, faqs, whatsappInstances, type User, type InsertUser, type Business, type InsertBusiness, type Staff, type InsertStaff, type Client, type InsertClient, type BarberPlan, type InsertBarberPlan, type Service, type InsertService, type Appointment, type InsertAppointment, type PaymentGateway, type InsertPaymentGateway, type AccountingTransaction, type InsertAccountingTransaction, type SupportTicket, type InsertSupportTicket, type Faq, type InsertFaq, type WhatsappInstance, type InsertWhatsappInstance } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Business methods
  getAllBusinesses(): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;
  
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
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Appointment methods
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Payment Gateway methods
  getAllPaymentGateways(): Promise<PaymentGateway[]>;
  getPaymentGateway(id: number): Promise<PaymentGateway | undefined>;
  createPaymentGateway(gateway: InsertPaymentGateway): Promise<PaymentGateway>;
  updatePaymentGateway(id: number, gateway: Partial<InsertPaymentGateway>): Promise<PaymentGateway | undefined>;
  deletePaymentGateway(id: number): Promise<boolean>;
  
  // Accounting Transaction methods
  getAllAccountingTransactions(): Promise<AccountingTransaction[]>;
  getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined>;
  createAccountingTransaction(transaction: InsertAccountingTransaction): Promise<AccountingTransaction>;
  updateAccountingTransaction(id: number, transaction: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined>;
  deleteAccountingTransaction(id: number): Promise<boolean>;
  
  // Support Ticket methods
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, ticket: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: number): Promise<boolean>;
  
  // FAQ methods
  getAllFaqs(): Promise<Faq[]>;
  getFaq(id: number): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: number, faq: Partial<InsertFaq>): Promise<Faq | undefined>;
  deleteFaq(id: number): Promise<boolean>;
  
  // WhatsApp Instance methods
  getAllWhatsappInstances(): Promise<WhatsappInstance[]>;
  getWhatsappInstance(id: number): Promise<WhatsappInstance | undefined>;
  createWhatsappInstance(instance: InsertWhatsappInstance): Promise<WhatsappInstance>;
  updateWhatsappInstance(id: number, instance: Partial<InsertWhatsappInstance>): Promise<WhatsappInstance | undefined>;
  deleteWhatsappInstance(id: number): Promise<boolean>;
  generateQrCode(id: number): Promise<string | null>;
  connectInstance(id: number, sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private staff: Map<number, Staff>;
  private clients: Map<number, Client>;
  private barberPlans: Map<number, BarberPlan>;
  private services: Map<number, Service>;
  private appointments: Map<number, Appointment>;
  private paymentGateways: Map<number, PaymentGateway>;
  private accountingTransactions: Map<number, AccountingTransaction>;
  private supportTickets: Map<number, SupportTicket>;
  private faqs: Map<number, Faq>;
  private whatsappInstances: Map<number, WhatsappInstance>;
  private currentUserId: number;
  private currentStaffId: number;
  private currentClientId: number;
  private currentBarberPlanId: number;
  private currentServiceId: number;
  private currentAppointmentId: number;
  private currentPaymentGatewayId: number;
  private currentAccountingTransactionId: number;
  private currentSupportTicketId: number;
  private currentFaqId: number;
  private currentWhatsappInstanceId: number;

  constructor() {
    this.users = new Map();
    this.staff = new Map();
    this.clients = new Map();
    this.barberPlans = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.paymentGateways = new Map();
    this.accountingTransactions = new Map();
    this.supportTickets = new Map();
    this.faqs = new Map();
    this.whatsappInstances = new Map();
    this.currentUserId = 1;
    this.currentStaffId = 1;
    this.currentClientId = 1;
    this.currentBarberPlanId = 1;
    this.currentServiceId = 1;
    this.currentAppointmentId = 1;
    this.currentPaymentGatewayId = 1;
    this.currentAccountingTransactionId = 1;
    this.currentSupportTicketId = 1;
    this.currentFaqId = 1;
    this.currentWhatsappInstanceId = 1;
    
    // Add sample data
    this.seedStaffData();
    this.seedClientData();
    this.seedBarberPlanData();
    this.seedServiceData();
    this.seedAppointmentData();
    this.seedPaymentGatewayData();
    this.seedAccountingTransactionData();
    this.seedSupportTicketData();
    this.seedFaqData();
    this.seedWhatsappInstanceData();
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

  private seedServiceData() {
    const sampleServices = [
      {
        name: "Classic Haircut",
        description: "Traditional men's haircut with scissor and clipper styling",
        duration: 30,
        price: 2500, // $25.00
        staff_id: 1,
        is_active: true
      },
      {
        name: "Beard Trim",
        description: "Professional beard trimming and shaping",
        duration: 20,
        price: 1500, // $15.00
        staff_id: 1,
        is_active: true
      },
      {
        name: "Deluxe Cut & Style",
        description: "Premium haircut with wash, cut, and styling",
        duration: 45,
        price: 4000, // $40.00
        staff_id: 2,
        is_active: true
      },
      {
        name: "Hot Towel Shave",
        description: "Traditional straight razor shave with hot towel treatment",
        duration: 40,
        price: 3500, // $35.00
        staff_id: 2,
        is_active: true
      }
    ];

    sampleServices.forEach((serviceData) => {
      const id = this.currentServiceId++;
      const now = new Date();
      const service: Service = {
        ...serviceData,
        id,
        created_at: now,
        updated_at: now
      };
      this.services.set(id, service);
    });
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const service: Service = { 
      ...insertService, 
      id,
      created_at: now,
      updated_at: now
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.services.get(id);
    if (!existingService) return undefined;
    
    const updatedService: Service = {
      ...existingService,
      ...updateData,
      updated_at: new Date()
    };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  private seedAppointmentData() {
    const sampleAppointments = [
      {
        client_id: 1,
        staff_id: 1,
        service_id: 1,
        appointment_date: "2024-12-15",
        appointment_time: "10:00",
        status: "scheduled",
        notes: "First time client, prefers shorter length"
      },
      {
        client_id: 2,
        staff_id: 1,
        service_id: 2,
        appointment_date: "2024-12-15",
        appointment_time: "11:00",
        status: "confirmed",
        notes: "Regular client, usual beard trim"
      },
      {
        client_id: 1,
        staff_id: 2,
        service_id: 3,
        appointment_date: "2024-12-16",
        appointment_time: "14:30",
        status: "scheduled",
        notes: "Deluxe package for special event"
      },
      {
        client_id: 2,
        staff_id: 2,
        service_id: 4,
        appointment_date: "2024-12-16",
        appointment_time: "16:00",
        status: "completed",
        notes: "Excellent traditional shave experience"
      }
    ];

    sampleAppointments.forEach((appointmentData) => {
      const id = this.currentAppointmentId++;
      const now = new Date();
      const appointment: Appointment = {
        ...appointmentData,
        id,
        created_at: now,
        updated_at: now
      };
      this.appointments.set(id, appointment);
    });
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const now = new Date();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      created_at: now,
      updated_at: now
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existingAppointment = this.appointments.get(id);
    if (!existingAppointment) return undefined;
    
    const updatedAppointment: Appointment = {
      ...existingAppointment,
      ...updateData,
      updated_at: new Date()
    };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  private seedPaymentGatewayData() {
    const sampleGateways = [
      {
        name: "Main Mercado Pago",
        type: "Mercado Pago",
        api_url: "https://api.mercadopago.com",
        api_key: "APP_USR_123456789",
        token: "access_token_123",
        email: "admin@barbershop.com",
        staff_id: 1,
        is_active: true
      },
      {
        name: "Asaas Payment",
        type: "Asaas",
        api_url: "https://www.asaas.com/api/v3",
        api_key: "asaas_api_key_456",
        token: "asaas_token_456",
        email: "payments@barbershop.com",
        staff_id: 1,
        is_active: true
      },
      {
        name: "PagBank Gateway",
        type: "Pagbank",
        api_url: "https://ws.pagseguro.uol.com.br",
        api_key: "pagbank_key_789",
        token: "pagbank_token_789",
        email: "finance@barbershop.com",
        staff_id: 2,
        is_active: false
      }
    ];

    sampleGateways.forEach((gatewayData) => {
      const id = this.currentPaymentGatewayId++;
      const now = new Date();
      const gateway: PaymentGateway = {
        ...gatewayData,
        id,
        created_at: now,
        updated_at: now
      };
      this.paymentGateways.set(id, gateway);
    });
  }

  async getAllPaymentGateways(): Promise<PaymentGateway[]> {
    return Array.from(this.paymentGateways.values());
  }

  async getPaymentGateway(id: number): Promise<PaymentGateway | undefined> {
    return this.paymentGateways.get(id);
  }

  async createPaymentGateway(insertGateway: InsertPaymentGateway): Promise<PaymentGateway> {
    const id = this.currentPaymentGatewayId++;
    const now = new Date();
    const gateway: PaymentGateway = { 
      ...insertGateway, 
      id,
      created_at: now,
      updated_at: now
    };
    this.paymentGateways.set(id, gateway);
    return gateway;
  }

  async updatePaymentGateway(id: number, updateData: Partial<InsertPaymentGateway>): Promise<PaymentGateway | undefined> {
    const existingGateway = this.paymentGateways.get(id);
    if (!existingGateway) return undefined;
    
    const updatedGateway: PaymentGateway = {
      ...existingGateway,
      ...updateData,
      updated_at: new Date()
    };
    this.paymentGateways.set(id, updatedGateway);
    return updatedGateway;
  }

  async deletePaymentGateway(id: number): Promise<boolean> {
    return this.paymentGateways.delete(id);
  }

  private seedAccountingTransactionData() {
    const sampleTransactions = [
      {
        type: "revenue",
        category: "Haircut Services",
        description: "Classic Haircut - John Martinez",
        amount: 3500, // $35.00
        payment_method: "Cash",
        reference_number: "REV-001",
        client_id: 1,
        staff_id: 1,
        transaction_date: "2024-01-15",
        notes: "Regular customer",
        is_recurring: false
      },
      {
        type: "revenue",
        category: "Beard Services",
        description: "Beard Trim - Premium Service",
        amount: 2500, // $25.00
        payment_method: "Credit Card",
        reference_number: "REV-002",
        client_id: 2,
        staff_id: 2,
        transaction_date: "2024-01-15",
        notes: "Premium service package",
        is_recurring: false
      },
      {
        type: "expense",
        category: "Supplies",
        description: "Hair Products - Monthly Supply",
        amount: 15000, // $150.00
        payment_method: "Bank Transfer",
        reference_number: "EXP-001",
        client_id: null,
        staff_id: null,
        transaction_date: "2024-01-10",
        notes: "Shampoo, conditioner, styling products",
        is_recurring: true
      },
      {
        type: "expense",
        category: "Rent",
        description: "Shop Rent - January 2024",
        amount: 120000, // $1200.00
        payment_method: "Bank Transfer",
        reference_number: "EXP-002",
        client_id: null,
        staff_id: null,
        transaction_date: "2024-01-01",
        notes: "Monthly rent payment",
        is_recurring: true
      },
      {
        type: "revenue",
        category: "Special Services",
        description: "Wedding Package - Complete Grooming",
        amount: 8500, // $85.00
        payment_method: "Credit Card",
        reference_number: "REV-003",
        client_id: 3,
        staff_id: 1,
        transaction_date: "2024-01-20",
        notes: "Special event package",
        is_recurring: false
      }
    ];

    sampleTransactions.forEach((transactionData) => {
      const id = this.currentAccountingTransactionId++;
      const now = new Date();
      const transaction: AccountingTransaction = {
        ...transactionData,
        id,
        created_at: now,
        updated_at: now
      };
      this.accountingTransactions.set(id, transaction);
    });
  }

  async getAllAccountingTransactions(): Promise<AccountingTransaction[]> {
    return Array.from(this.accountingTransactions.values());
  }

  async getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined> {
    return this.accountingTransactions.get(id);
  }

  async createAccountingTransaction(insertTransaction: InsertAccountingTransaction): Promise<AccountingTransaction> {
    const id = this.currentAccountingTransactionId++;
    const now = new Date();
    const transaction: AccountingTransaction = { 
      ...insertTransaction, 
      id,
      created_at: now,
      updated_at: now
    };
    this.accountingTransactions.set(id, transaction);
    return transaction;
  }

  async updateAccountingTransaction(id: number, updateData: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined> {
    const existingTransaction = this.accountingTransactions.get(id);
    if (!existingTransaction) return undefined;
    
    const updatedTransaction: AccountingTransaction = {
      ...existingTransaction,
      ...updateData,
      updated_at: new Date()
    };
    this.accountingTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteAccountingTransaction(id: number): Promise<boolean> {
    return this.accountingTransactions.delete(id);
  }

  private seedSupportTicketData() {
    const sampleTickets = [
      {
        title: "Unable to book appointment online",
        description: "The booking system shows an error when I try to select a time slot for next week.",
        priority: "high",
        status: "open",
        category: "Technical Issue",
        client_email: "customer@example.com",
        client_name: "John Customer",
        assigned_staff_id: 1,
        resolution_notes: null,
        attachments: []
      },
      {
        title: "Request for cancellation policy",
        description: "I need to understand the cancellation policy for appointments. Can someone clarify?",
        priority: "medium",
        status: "in_progress",
        category: "General Inquiry",
        client_email: "mary.client@email.com",
        client_name: "Mary Client",
        assigned_staff_id: 2,
        resolution_notes: null,
        attachments: []
      },
      {
        title: "Service pricing question",
        description: "What are the current prices for beard trimming services?",
        priority: "low",
        status: "resolved",
        category: "Pricing",
        client_email: "info.seeker@domain.com",
        client_name: "Alex Seeker",
        assigned_staff_id: 1,
        resolution_notes: "Provided updated pricing list via email.",
        attachments: []
      }
    ];

    sampleTickets.forEach((ticketData) => {
      const id = this.currentSupportTicketId++;
      const ticket: SupportTicket = {
        id,
        ...ticketData,
        created_at: new Date(),
        updated_at: new Date(),
        resolved_at: ticketData.status === "resolved" ? new Date() : null
      };
      this.supportTickets.set(id, ticket);
    });
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values());
  }

  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTickets.get(id);
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const id = this.currentSupportTicketId++;
    const ticket: SupportTicket = { 
      ...insertTicket, 
      id,
      created_at: new Date(),
      updated_at: new Date(),
      resolved_at: null
    };
    this.supportTickets.set(id, ticket);
    return ticket;
  }

  async updateSupportTicket(id: number, updateData: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const existingTicket = this.supportTickets.get(id);
    if (!existingTicket) return undefined;
    
    const updatedTicket: SupportTicket = {
      ...existingTicket,
      ...updateData,
      updated_at: new Date(),
      resolved_at: updateData.status === "resolved" ? new Date() : existingTicket.resolved_at
    };
    this.supportTickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async deleteSupportTicket(id: number): Promise<boolean> {
    return this.supportTickets.delete(id);
  }

  private seedFaqData() {
    const sampleFaqs = [
      {
        question: "What are your operating hours?",
        answer: "We are open Monday through Saturday from 9:00 AM to 7:00 PM, and Sunday from 10:00 AM to 5:00 PM. We are closed on major holidays.",
        category: "General",
        is_published: true,
        order_index: 1
      },
      {
        question: "How do I book an appointment?",
        answer: "You can book an appointment through our online booking system, by calling us directly, or by visiting our shop. We recommend booking in advance to secure your preferred time slot.",
        category: "Appointments",
        is_published: true,
        order_index: 2
      },
      {
        question: "What services do you offer?",
        answer: "We offer a full range of barbering services including haircuts, beard trims, hot towel shaves, styling, and grooming packages. Check our services page for detailed descriptions and pricing.",
        category: "Services",
        is_published: true,
        order_index: 3
      },
      {
        question: "What is your cancellation policy?",
        answer: "We require at least 24 hours notice for cancellations. Same-day cancellations or no-shows may be subject to a cancellation fee.",
        category: "Policies",
        is_published: true,
        order_index: 4
      },
      {
        question: "Do you accept walk-ins?",
        answer: "Yes, we accept walk-ins based on availability. However, we recommend booking an appointment to guarantee your preferred time and avoid waiting.",
        category: "Appointments",
        is_published: true,
        order_index: 5
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept cash, credit cards (Visa, MasterCard, American Express), debit cards, and digital payments including Apple Pay and Google Pay.",
        category: "Payment",
        is_published: true,
        order_index: 6
      }
    ];

    sampleFaqs.forEach((faqData) => {
      const id = this.currentFaqId++;
      const faq: Faq = {
        id,
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        is_published: faqData.is_published,
        order_index: faqData.order_index,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.faqs.set(id, faq);
    });
  }

  async getAllFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values()).sort((a, b) => a.order_index - b.order_index);
  }

  async getFaq(id: number): Promise<Faq | undefined> {
    return this.faqs.get(id);
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = this.currentFaqId++;
    const faq: Faq = { 
      ...insertFaq, 
      id,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.faqs.set(id, faq);
    return faq;
  }

  async updateFaq(id: number, updateData: Partial<InsertFaq>): Promise<Faq | undefined> {
    const existingFaq = this.faqs.get(id);
    if (!existingFaq) return undefined;
    
    const updatedFaq: Faq = {
      ...existingFaq,
      ...updateData,
      updated_at: new Date()
    };
    this.faqs.set(id, updatedFaq);
    return updatedFaq;
  }

  async deleteFaq(id: number): Promise<boolean> {
    return this.faqs.delete(id);
  }

  private seedWhatsappInstanceData() {
    const sampleInstances = [
      {
        name: "Main Business WhatsApp",
        phone_number: "+1234567890",
        status: "connected",
        webhook_url: "https://example.com/webhook",
        session_id: "main_session_123",
        last_seen: new Date()
      },
      {
        name: "Customer Support",
        phone_number: "+1234567891",
        status: "disconnected",
        webhook_url: "https://example.com/webhook2"
      }
    ];

    sampleInstances.forEach((instanceData) => {
      const id = this.currentWhatsappInstanceId++;
      const instance: WhatsappInstance = {
        id,
        name: instanceData.name,
        phone_number: instanceData.phone_number,
        status: instanceData.status,
        webhook_url: instanceData.webhook_url,
        session_id: instanceData.session_id || null,
        last_seen: instanceData.last_seen || null,
        qr_code: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      this.whatsappInstances.set(id, instance);
    });
  }

  async getAllWhatsappInstances(): Promise<WhatsappInstance[]> {
    return Array.from(this.whatsappInstances.values()).sort((a, b) => b.id - a.id);
  }

  async getWhatsappInstance(id: number): Promise<WhatsappInstance | undefined> {
    return this.whatsappInstances.get(id);
  }

  async createWhatsappInstance(insertInstance: InsertWhatsappInstance): Promise<WhatsappInstance> {
    const id = this.currentWhatsappInstanceId++;
    const instance: WhatsappInstance = {
      ...insertInstance,
      id,
      status: "disconnected",
      qr_code: null,
      session_id: null,
      last_seen: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.whatsappInstances.set(id, instance);
    return instance;
  }

  async updateWhatsappInstance(id: number, updateData: Partial<InsertWhatsappInstance>): Promise<WhatsappInstance | undefined> {
    const existingInstance = this.whatsappInstances.get(id);
    if (!existingInstance) return undefined;

    const updatedInstance: WhatsappInstance = {
      ...existingInstance,
      ...updateData,
      updated_at: new Date()
    };
    this.whatsappInstances.set(id, updatedInstance);
    return updatedInstance;
  }

  async deleteWhatsappInstance(id: number): Promise<boolean> {
    return this.whatsappInstances.delete(id);
  }

  async generateQrCode(id: number): Promise<string | null> {
    const instance = this.whatsappInstances.get(id);
    if (!instance) return null;

    // Generate a mock QR code data (in real implementation, this would integrate with WhatsApp Business API)
    const qrCodeData = `whatsapp://qr/${instance.phone_number}_${Date.now()}`;
    
    const updatedInstance: WhatsappInstance = {
      ...instance,
      status: "connecting",
      qr_code: qrCodeData,
      updated_at: new Date()
    };
    
    this.whatsappInstances.set(id, updatedInstance);
    return qrCodeData;
  }

  async connectInstance(id: number, sessionId: string): Promise<boolean> {
    const instance = this.whatsappInstances.get(id);
    if (!instance) return false;

    const updatedInstance: WhatsappInstance = {
      ...instance,
      status: "connected",
      session_id: sessionId,
      qr_code: null,
      last_seen: new Date(),
      updated_at: new Date()
    };

    this.whatsappInstances.set(id, updatedInstance);
    return true;
  }
}

// Database connection setup
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Staff methods
  async getAllStaff(): Promise<Staff[]> {
    return await db.select().from(staff);
  }

  async getStaff(id: number): Promise<Staff | undefined> {
    const result = await db.select().from(staff).where(eq(staff.id, id));
    return result[0];
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const result = await db.insert(staff).values(insertStaff).returning();
    return result[0];
  }

  async updateStaff(id: number, updateData: Partial<InsertStaff>): Promise<Staff | undefined> {
    const result = await db.update(staff).set(updateData).where(eq(staff.id, id)).returning();
    return result[0];
  }

  async deleteStaff(id: number): Promise<boolean> {
    const result = await db.delete(staff).where(eq(staff.id, id));
    return result.rowCount > 0;
  }

  // Client methods
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0];
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(insertClient).returning();
    return result[0];
  }

  async updateClient(id: number, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients).set(updateData).where(eq(clients.id, id)).returning();
    return result[0];
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  // Barber Plan methods
  async getAllBarberPlans(): Promise<BarberPlan[]> {
    return await db.select().from(barberPlans);
  }

  async getBarberPlan(id: number): Promise<BarberPlan | undefined> {
    const result = await db.select().from(barberPlans).where(eq(barberPlans.id, id));
    return result[0];
  }

  async createBarberPlan(insertPlan: InsertBarberPlan): Promise<BarberPlan> {
    const result = await db.insert(barberPlans).values(insertPlan).returning();
    return result[0];
  }

  async updateBarberPlan(id: number, updateData: Partial<InsertBarberPlan>): Promise<BarberPlan | undefined> {
    const result = await db.update(barberPlans).set(updateData).where(eq(barberPlans.id, id)).returning();
    return result[0];
  }

  async deleteBarberPlan(id: number): Promise<boolean> {
    const result = await db.delete(barberPlans).where(eq(barberPlans.id, id));
    return result.rowCount > 0;
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async createService(insertService: InsertService): Promise<Service> {
    const result = await db.insert(services).values(insertService).returning();
    return result[0];
  }

  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const result = await db.update(services).set(updateData).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowCount > 0;
  }

  // Appointment methods
  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id));
    return result[0];
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(insertAppointment).returning();
    return result[0];
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const result = await db.update(appointments).set(updateData).where(eq(appointments.id, id)).returning();
    return result[0];
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount > 0;
  }

  // Payment Gateway methods
  async getAllPaymentGateways(): Promise<PaymentGateway[]> {
    return await db.select().from(paymentGateways);
  }

  async getPaymentGateway(id: number): Promise<PaymentGateway | undefined> {
    const result = await db.select().from(paymentGateways).where(eq(paymentGateways.id, id));
    return result[0];
  }

  async createPaymentGateway(insertGateway: InsertPaymentGateway): Promise<PaymentGateway> {
    const result = await db.insert(paymentGateways).values(insertGateway).returning();
    return result[0];
  }

  async updatePaymentGateway(id: number, updateData: Partial<InsertPaymentGateway>): Promise<PaymentGateway | undefined> {
    const result = await db.update(paymentGateways).set(updateData).where(eq(paymentGateways.id, id)).returning();
    return result[0];
  }

  async deletePaymentGateway(id: number): Promise<boolean> {
    const result = await db.delete(paymentGateways).where(eq(paymentGateways.id, id));
    return result.rowCount > 0;
  }

  // Accounting Transaction methods
  async getAllAccountingTransactions(): Promise<AccountingTransaction[]> {
    return await db.select().from(accountingTransactions);
  }

  async getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined> {
    const result = await db.select().from(accountingTransactions).where(eq(accountingTransactions.id, id));
    return result[0];
  }

  async createAccountingTransaction(insertTransaction: InsertAccountingTransaction): Promise<AccountingTransaction> {
    const result = await db.insert(accountingTransactions).values(insertTransaction).returning();
    return result[0];
  }

  async updateAccountingTransaction(id: number, updateData: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined> {
    const result = await db.update(accountingTransactions).set(updateData).where(eq(accountingTransactions.id, id)).returning();
    return result[0];
  }

  async deleteAccountingTransaction(id: number): Promise<boolean> {
    const result = await db.delete(accountingTransactions).where(eq(accountingTransactions.id, id));
    return result.rowCount > 0;
  }

  // Support Ticket methods
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets);
  }

  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    const result = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    return result[0];
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const result = await db.insert(supportTickets).values(insertTicket).returning();
    return result[0];
  }

  async updateSupportTicket(id: number, updateData: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const result = await db.update(supportTickets).set(updateData).where(eq(supportTickets.id, id)).returning();
    return result[0];
  }

  async deleteSupportTicket(id: number): Promise<boolean> {
    const result = await db.delete(supportTickets).where(eq(supportTickets.id, id));
    return result.rowCount > 0;
  }

  // FAQ methods
  async getAllFaqs(): Promise<Faq[]> {
    return await db.select().from(faqs);
  }

  async getFaq(id: number): Promise<Faq | undefined> {
    const result = await db.select().from(faqs).where(eq(faqs.id, id));
    return result[0];
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const result = await db.insert(faqs).values(insertFaq).returning();
    return result[0];
  }

  async updateFaq(id: number, updateData: Partial<InsertFaq>): Promise<Faq | undefined> {
    const result = await db.update(faqs).set(updateData).where(eq(faqs.id, id)).returning();
    return result[0];
  }

  async deleteFaq(id: number): Promise<boolean> {
    const result = await db.delete(faqs).where(eq(faqs.id, id));
    return result.rowCount > 0;
  }

  // WhatsApp Instance methods
  async getAllWhatsappInstances(): Promise<WhatsappInstance[]> {
    return await db.select().from(whatsappInstances);
  }

  async getWhatsappInstance(id: number): Promise<WhatsappInstance | undefined> {
    const result = await db.select().from(whatsappInstances).where(eq(whatsappInstances.id, id));
    return result[0];
  }

  async createWhatsappInstance(insertInstance: InsertWhatsappInstance): Promise<WhatsappInstance> {
    const result = await db.insert(whatsappInstances).values(insertInstance).returning();
    return result[0];
  }

  async updateWhatsappInstance(id: number, updateData: Partial<InsertWhatsappInstance>): Promise<WhatsappInstance | undefined> {
    const result = await db.update(whatsappInstances).set(updateData).where(eq(whatsappInstances.id, id)).returning();
    return result[0];
  }

  async deleteWhatsappInstance(id: number): Promise<boolean> {
    const result = await db.delete(whatsappInstances).where(eq(whatsappInstances.id, id));
    return result.rowCount > 0;
  }

  async generateQrCode(id: number): Promise<string | null> {
    const instance = await this.getWhatsappInstance(id);
    if (!instance) return null;

    const qrCodeData = `whatsapp://qr/${instance.phone_number}_${Date.now()}`;
    
    await db.update(whatsappInstances).set({
      status: "connecting",
      qr_code: qrCodeData,
      updated_at: new Date()
    }).where(eq(whatsappInstances.id, id));
    
    return qrCodeData;
  }

  async connectInstance(id: number, sessionId: string): Promise<boolean> {
    const instance = await this.getWhatsappInstance(id);
    if (!instance) return false;

    await db.update(whatsappInstances).set({
      status: "connected",
      session_id: sessionId,
      qr_code: null,
      last_seen: new Date(),
      updated_at: new Date()
    }).where(eq(whatsappInstances.id, id));

    return true;
  }
}

// Use PostgreSQL storage instead of memory storage
export const storage = new PostgresStorage();
