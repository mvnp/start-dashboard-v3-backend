import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, or, isNull, inArray, gte, lte, desc, asc, sql, count as countFn } from "drizzle-orm";
import { 
  users, businesses, persons, roles, users_business, users_roles,
  services, appointments, barber_plans, payment_gateways, payment_gateway_types,
  accounting_transactions, accounting_transaction_categories,
  support_tickets, support_ticket_categories, whatsapp_instances, faqs,
  type User, type InsertUser, 
  type Business, type InsertBusiness,
  type Person, type InsertPerson,
  type Role, type InsertRole,
  type UserBusiness, type InsertUserBusiness,
  type UserRole, type InsertUserRole,
  type Service, type InsertService,
  type Appointment, type InsertAppointment,
  type BarberPlan, type InsertBarberPlan,
  type PaymentGateway, type InsertPaymentGateway,
  type PaymentGatewayType, type InsertPaymentGatewayType,
  type AccountingTransaction, type InsertAccountingTransaction,
  type AccountingTransactionCategory, type InsertAccountingTransactionCategory,
  type SupportTicket, type InsertSupportTicket,
  type SupportTicketCategory, type InsertSupportTicketCategory,
  type WhatsappInstance, type InsertWhatsappInstance,
  type Faq, type InsertFaq
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByRole(roleType: string): Promise<User[]>;
  getUserWithRoleAndBusiness(userId: number): Promise<{user: User, roleId: number, businessIds: number[], isSuperAdmin: boolean} | undefined>;
  authenticateUser(email: string, password: string): Promise<{user: User, roleId: number, businessIds: number[]} | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Business methods
  getAllBusinesses(): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;
  
  // Person methods (replaces staff/client)
  getAllPersons(): Promise<Person[]>;
  getPersonsByRoles(roleIds: number[]): Promise<Person[]>;
  getPersonsByRolesAndBusiness(roleIds: number[], businessIds: number[]): Promise<Person[]>;
  getPerson(id: number): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: number, person: Partial<InsertPerson>): Promise<Person | undefined>;
  deletePerson(id: number): Promise<boolean>;
  
  // Role methods
  getAllRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  
  // Junction table methods
  createUserBusiness(insertUserBusiness: InsertUserBusiness): Promise<UserBusiness>;
  createUserRole(insertUserRole: InsertUserRole): Promise<UserRole>;
  updateUserBusiness(userId: number, businessId: number): Promise<void>;
  updateUserRole(userId: number, roleId: number): Promise<void>;
  
  // Service methods
  getAllServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServicesByBusinessIds(businessIds: number[]): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Appointment methods
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByBusinessIds(businessIds: number[]): Promise<Appointment[]>;
  getFilteredAppointments(filters: {
    page: number;
    limit: number;
    status?: string;
    today?: boolean;
    startDate?: string;
    endDate?: string;
    businessIds?: number[] | null;
  }): Promise<{ appointments: Appointment[]; total: number; totalPages: number; currentPage: number }>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Barber Plan methods
  getAllBarberPlans(): Promise<BarberPlan[]>;
  getBarberPlan(id: number): Promise<BarberPlan | undefined>;
  createBarberPlan(plan: InsertBarberPlan): Promise<BarberPlan>;
  updateBarberPlan(id: number, plan: Partial<InsertBarberPlan>): Promise<BarberPlan | undefined>;
  deleteBarberPlan(id: number): Promise<boolean>;
  
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
}

class PostgresStorage implements IStorage {
  private db = drizzle(neon(process.env.DATABASE_URL!));

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUsersByRole(roleType: string): Promise<any[]> {
    const result = await this.db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
        first_name: persons.first_name,
        last_name: persons.last_name,
      })
      .from(users)
      .innerJoin(users_roles, eq(users.id, users_roles.user_id))
      .innerJoin(roles, eq(users_roles.role_id, roles.id))
      .leftJoin(persons, eq(users.id, persons.user_id))
      .where(eq(roles.type, roleType));
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await this.db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getUserWithRoleAndBusiness(userId: number): Promise<{user: User, roleId: number, businessIds: number[], isSuperAdmin: boolean} | undefined> {
    const userResult = await this.db.select().from(users).where(eq(users.id, userId));
    if (!userResult[0]) return undefined;

    const roleResult = await this.db
      .select({ roleId: users_roles.role_id })
      .from(users_roles)
      .where(eq(users_roles.user_id, userId));

    const businessResult = await this.db
      .select({ businessId: users_business.business_id })
      .from(users_business)
      .where(eq(users_business.user_id, userId));

    const roleId = roleResult[0]?.roleId || 0;
    
    return {
      user: userResult[0],
      roleId,
      businessIds: businessResult.map(b => b.businessId).filter((id): id is number => id !== null),
      isSuperAdmin: roleId === 1
    };
  }

  async authenticateUser(email: string, password: string): Promise<{user: User, roleId: number, businessIds: number[]} | undefined> {
    const userResult = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)));

    if (!userResult[0]) return undefined;

    const userData = await this.getUserWithRoleAndBusiness(userResult[0].id);
    return userData;
  }

  // Business methods
  async getAllBusinesses(): Promise<Business[]> {
    return await this.db.select().from(businesses);
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    const result = await this.db.select().from(businesses).where(eq(businesses.id, id));
    return result[0];
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const result = await this.db.insert(businesses).values(insertBusiness).returning();
    const business = result[0];
    
    // Create users_business relationship if user_id is provided
    if (business.user_id) {
      await this.db.insert(users_business).values({
        user_id: business.user_id,
        business_id: business.id
      });
    }
    
    return business;
  }

  async updateBusiness(id: number, updateData: Partial<InsertBusiness>): Promise<Business | undefined> {
    const result = await this.db.update(businesses).set(updateData).where(eq(businesses.id, id)).returning();
    const business = result[0];
    
    // Update users_business relationship if user_id is being changed
    if (business && updateData.user_id !== undefined) {
      // First, remove existing users_business relationship for this business
      await this.db.delete(users_business).where(eq(users_business.business_id, id));
      
      // Then create new relationship if user_id is provided
      if (updateData.user_id) {
        await this.db.insert(users_business).values({
          user_id: updateData.user_id,
          business_id: id
        });
      }
    }
    
    return business;
  }

  async deleteBusiness(id: number): Promise<boolean> {
    const result = await this.db.delete(businesses).where(eq(businesses.id, id));
    return result.rowCount > 0;
  }

  // Person methods (replaces staff/client)
  async getAllPersons(): Promise<Person[]> {
    return await this.db.select().from(persons);
  }

  async getPersonsByRoles(roleIds: number[]): Promise<Person[]> {
    // Build OR condition for multiple roles
    const roleConditions = roleIds.map(roleId => eq(users_roles.role_id, roleId));
    const whereCondition = roleConditions.length === 1 
      ? roleConditions[0] 
      : or(...roleConditions);

    const result = await this.db
      .select({
        id: persons.id,
        first_name: persons.first_name,
        last_name: persons.last_name,
        phone: persons.phone,
        tax_id: persons.tax_id,
        hire_date: persons.hire_date,
        salary: persons.salary,
        created_at: persons.created_at,
        updated_at: persons.updated_at,
        deleted_at: persons.deleted_at,
        user_id: persons.user_id,
      })
      .from(persons)
      .innerJoin(users, eq(persons.user_id, users.id))
      .innerJoin(users_roles, eq(users.id, users_roles.user_id))
      .where(whereCondition);
    
    return result;
  }

  async getPersonsByRolesAndBusiness(roleIds: number[], businessIds: number[]): Promise<Person[]> {
    // Build OR condition for multiple roles
    const roleConditions = roleIds.map(roleId => eq(users_roles.role_id, roleId));
    const roleWhereCondition = roleConditions.length === 1 
      ? roleConditions[0] 
      : or(...roleConditions);

    // Build OR condition for multiple businesses
    const businessConditions = businessIds.map(businessId => eq(users_business.business_id, businessId));
    const businessWhereCondition = businessConditions.length === 1 
      ? businessConditions[0] 
      : or(...businessConditions);

    const result = await this.db
      .select({
        id: persons.id,
        first_name: persons.first_name,
        last_name: persons.last_name,
        phone: persons.phone,
        tax_id: persons.tax_id,
        hire_date: persons.hire_date,
        salary: persons.salary,
        created_at: persons.created_at,
        updated_at: persons.updated_at,
        deleted_at: persons.deleted_at,
        user_id: persons.user_id,
      })
      .from(persons)
      .innerJoin(users, eq(persons.user_id, users.id))
      .innerJoin(users_roles, eq(users.id, users_roles.user_id))
      .innerJoin(users_business, eq(users.id, users_business.user_id))
      .where(and(roleWhereCondition, businessWhereCondition));
    
    return result;
  }

  async getPerson(id: number): Promise<Person | undefined> {
    const result = await this.db.select().from(persons).where(eq(persons.id, id));
    return result[0];
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const result = await this.db.insert(persons).values(insertPerson).returning();
    return result[0];
  }

  async updatePerson(id: number, updateData: Partial<InsertPerson>): Promise<Person | undefined> {
    const result = await this.db.update(persons).set(updateData).where(eq(persons.id, id)).returning();
    return result[0];
  }

  async deletePerson(id: number): Promise<boolean> {
    const result = await this.db.delete(persons).where(eq(persons.id, id));
    return result.rowCount > 0;
  }

  // Role methods
  async getAllRoles(): Promise<Role[]> {
    return await this.db.select().from(roles);
  }

  async getRole(id: number): Promise<Role | undefined> {
    const result = await this.db.select().from(roles).where(eq(roles.id, id));
    return result[0];
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await this.db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await this.db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async getServicesByBusinessIds(businessIds: number[]): Promise<Service[]> {
    // Use SQL to efficiently filter services by business IDs or null business_id (global services)
    return await this.db
      .select()
      .from(services)
      .where(
        or(
          isNull(services.business_id),
          inArray(services.business_id, businessIds)
        )
      );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const result = await this.db.insert(services).values(insertService).returning();
    return result[0];
  }

  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const result = await this.db.update(services).set(updateData).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await this.db.delete(services).where(eq(services.id, id));
    return result.rowCount > 0;
  }

  // Appointment methods
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const result = await this.db.select().from(appointments).where(eq(appointments.id, id));
    return result[0];
  }

  async getAppointmentsByBusinessIds(businessIds: number[]): Promise<Appointment[]> {
    if (businessIds.length === 0) return [];
    return await this.db.select().from(appointments).where(inArray(appointments.business_id, businessIds));
  }

  async getFilteredAppointments(filters: {
    page: number;
    limit: number;
    status?: string;
    today?: boolean;
    startDate?: string;
    endDate?: string;
    businessIds?: number[] | null;
  }): Promise<{ appointments: Appointment[]; total: number; totalPages: number; currentPage: number }> {
    const { page, limit, status, today, startDate, endDate, businessIds } = filters;
    
    // Build where conditions
    const conditions = [];
    
    // Business filtering for non-super admin users
    if (businessIds && businessIds.length > 0) {
      conditions.push(inArray(appointments.business_id, businessIds));
    }
    
    // Status filtering
    if (status) {
      conditions.push(eq(appointments.status, status));
    }
    
    // Date filtering
    if (today) {
      const todayDate = new Date().toISOString().split('T')[0];
      conditions.push(eq(appointments.appointment_date, todayDate));
    } else if (startDate && endDate) {
      // Ensure dates are in YYYY-MM-DD format for proper comparison
      const formattedStartDate = new Date(startDate + 'T00:00:00').toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate + 'T23:59:59').toISOString().split('T')[0];
      conditions.push(
        and(
          gte(appointments.appointment_date, formattedStartDate),
          lte(appointments.appointment_date, formattedEndDate)
        )
      );
    } else if (startDate) {
      const formattedStartDate = new Date(startDate + 'T00:00:00').toISOString().split('T')[0];
      conditions.push(gte(appointments.appointment_date, formattedStartDate));
    } else if (endDate) {
      const formattedEndDate = new Date(endDate + 'T23:59:59').toISOString().split('T')[0];
      conditions.push(lte(appointments.appointment_date, formattedEndDate));
    }
    
    // Combine all conditions
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Get total count using raw SQL
    const totalQuery = this.db
      .select()
      .from(appointments)
      .where(whereCondition);
    
    const allResults = await totalQuery;
    const total = allResults.length;
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
    
    // Determine order by clause
    let orderBy;
    if (today) {
      orderBy = [asc(appointments.appointment_time)];
    } else {
      orderBy = [desc(appointments.appointment_date), desc(appointments.appointment_time)];
    }
    
    // Get filtered and paginated appointments
    const appointmentsList = await this.db
      .select()
      .from(appointments)
      .where(whereCondition)
      .orderBy(...orderBy)
      .limit(limit)
      .offset(offset);
    
    return {
      appointments: appointmentsList,
      total,
      totalPages,
      currentPage: page
    };
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const result = await this.db.insert(appointments).values(insertAppointment).returning();
    return result[0];
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const result = await this.db.update(appointments).set(updateData).where(eq(appointments.id, id)).returning();
    return result[0];
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await this.db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount > 0;
  }

  // Barber Plan methods
  async getAllBarberPlans(): Promise<BarberPlan[]> {
    return await this.db.select().from(barber_plans);
  }

  async getBarberPlan(id: number): Promise<BarberPlan | undefined> {
    const result = await this.db.select().from(barber_plans).where(eq(barber_plans.id, id));
    return result[0];
  }

  async createBarberPlan(insertBarberPlan: InsertBarberPlan): Promise<BarberPlan> {
    const result = await this.db.insert(barber_plans).values(insertBarberPlan).returning();
    return result[0];
  }

  async updateBarberPlan(id: number, updateData: Partial<InsertBarberPlan>): Promise<BarberPlan | undefined> {
    const result = await this.db.update(barber_plans).set(updateData).where(eq(barber_plans.id, id)).returning();
    return result[0];
  }

  async deleteBarberPlan(id: number): Promise<boolean> {
    const result = await this.db.delete(barber_plans).where(eq(barber_plans.id, id));
    return result.rowCount > 0;
  }

  // Payment Gateway methods
  async getAllPaymentGateways(): Promise<PaymentGateway[]> {
    return await this.db.select().from(payment_gateways);
  }

  async getPaymentGateway(id: number): Promise<PaymentGateway | undefined> {
    const result = await this.db.select().from(payment_gateways).where(eq(payment_gateways.id, id));
    return result[0];
  }

  async createPaymentGateway(insertPaymentGateway: InsertPaymentGateway): Promise<PaymentGateway> {
    const result = await this.db.insert(payment_gateways).values(insertPaymentGateway).returning();
    return result[0];
  }

  async updatePaymentGateway(id: number, updateData: Partial<InsertPaymentGateway>): Promise<PaymentGateway | undefined> {
    const result = await this.db.update(payment_gateways).set(updateData).where(eq(payment_gateways.id, id)).returning();
    return result[0];
  }

  async deletePaymentGateway(id: number): Promise<boolean> {
    const result = await this.db.delete(payment_gateways).where(eq(payment_gateways.id, id));
    return result.rowCount > 0;
  }

  // Accounting Transaction methods
  async getAllAccountingTransactions(): Promise<AccountingTransaction[]> {
    return await this.db.select().from(accounting_transactions);
  }

  async getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined> {
    const result = await this.db.select().from(accounting_transactions).where(eq(accounting_transactions.id, id));
    return result[0];
  }

  async createAccountingTransaction(insertAccountingTransaction: InsertAccountingTransaction): Promise<AccountingTransaction> {
    const result = await this.db.insert(accounting_transactions).values(insertAccountingTransaction).returning();
    return result[0];
  }

  async updateAccountingTransaction(id: number, updateData: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined> {
    const result = await this.db.update(accounting_transactions).set(updateData).where(eq(accounting_transactions.id, id)).returning();
    return result[0];
  }

  async deleteAccountingTransaction(id: number): Promise<boolean> {
    const result = await this.db.delete(accounting_transactions).where(eq(accounting_transactions.id, id));
    return result.rowCount > 0;
  }

  // Support Ticket methods
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await this.db.select().from(support_tickets);
  }

  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    const result = await this.db.select().from(support_tickets).where(eq(support_tickets.id, id));
    return result[0];
  }

  async createSupportTicket(insertSupportTicket: InsertSupportTicket): Promise<SupportTicket> {
    const result = await this.db.insert(support_tickets).values(insertSupportTicket).returning();
    return result[0];
  }

  async updateSupportTicket(id: number, updateData: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const result = await this.db.update(support_tickets).set(updateData).where(eq(support_tickets.id, id)).returning();
    return result[0];
  }

  async deleteSupportTicket(id: number): Promise<boolean> {
    const result = await this.db.delete(support_tickets).where(eq(support_tickets.id, id));
    return result.rowCount > 0;
  }

  // FAQ methods
  async getAllFaqs(): Promise<Faq[]> {
    return await this.db.select().from(faqs);
  }

  async getFaq(id: number): Promise<Faq | undefined> {
    const result = await this.db.select().from(faqs).where(eq(faqs.id, id));
    return result[0];
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const result = await this.db.insert(faqs).values(insertFaq).returning();
    return result[0];
  }

  async updateFaq(id: number, updateData: Partial<InsertFaq>): Promise<Faq | undefined> {
    const result = await this.db.update(faqs).set(updateData).where(eq(faqs.id, id)).returning();
    return result[0];
  }

  async deleteFaq(id: number): Promise<boolean> {
    const result = await this.db.delete(faqs).where(eq(faqs.id, id));
    return result.rowCount > 0;
  }

  // WhatsApp Instance methods
  async getAllWhatsappInstances(): Promise<WhatsappInstance[]> {
    return await this.db.select().from(whatsapp_instances);
  }

  async getWhatsappInstance(id: number): Promise<WhatsappInstance | undefined> {
    const result = await this.db.select().from(whatsapp_instances).where(eq(whatsapp_instances.id, id));
    return result[0];
  }

  async createWhatsappInstance(insertWhatsappInstance: InsertWhatsappInstance): Promise<WhatsappInstance> {
    const result = await this.db.insert(whatsapp_instances).values(insertWhatsappInstance).returning();
    return result[0];
  }

  async updateWhatsappInstance(id: number, updateData: Partial<InsertWhatsappInstance>): Promise<WhatsappInstance | undefined> {
    const result = await this.db.update(whatsapp_instances).set(updateData).where(eq(whatsapp_instances.id, id)).returning();
    return result[0];
  }

  async deleteWhatsappInstance(id: number): Promise<boolean> {
    const result = await this.db.delete(whatsapp_instances).where(eq(whatsapp_instances.id, id));
    return result.rowCount > 0;
  }

  // Junction table methods
  async createUserBusiness(insertUserBusiness: InsertUserBusiness): Promise<UserBusiness> {
    const result = await this.db.insert(users_business).values(insertUserBusiness).returning();
    return result[0];
  }

  async createUserRole(insertUserRole: InsertUserRole): Promise<UserRole> {
    const result = await this.db.insert(users_roles).values(insertUserRole).returning();
    return result[0];
  }

  async updateUserBusiness(userId: number, businessId: number): Promise<void> {
    // Delete existing business relationship
    await this.db.delete(users_business).where(eq(users_business.user_id, userId));
    
    // Create new business relationship
    await this.db.insert(users_business).values({
      user_id: userId,
      business_id: businessId
    });
  }

  async updateUserRole(userId: number, roleId: number): Promise<void> {
    // Delete existing role relationship
    await this.db.delete(users_roles).where(eq(users_roles.user_id, userId));
    
    // Create new role relationship
    await this.db.insert(users_roles).values({
      user_id: userId,
      role_id: roleId
    });
  }
}

const storage = new PostgresStorage();
export default storage;