import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, or, isNull, inArray, gte, lte, desc, asc, sql, count as countFn } from "drizzle-orm";
import { 
  users, businesses, persons, roles, users_business, users_roles,
  services, appointments, barber_plans, payment_gateways, payment_gateway_types,
  accounting_transactions, accounting_transaction_categories,
  support_tickets, support_ticket_categories, whatsapp_instances, faqs, settings, traductions, translations,
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
  type Faq, type InsertFaq,
  type Settings, type InsertSettings,
  type Traduction, type InsertTraduction,
  type Translation, type InsertTranslation
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
  getBusinessesByIds(businessIds: number[]): Promise<Business[]>;
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
  getPaymentGatewaysByBusinessIds(businessIds: number[] | null): Promise<PaymentGateway[]>;
  createPaymentGateway(gateway: InsertPaymentGateway): Promise<PaymentGateway>;
  updatePaymentGateway(id: number, gateway: Partial<InsertPaymentGateway>): Promise<PaymentGateway | undefined>;
  deletePaymentGateway(id: number): Promise<boolean>;
  
  // Accounting Transaction Category methods
  getAllAccountingTransactionCategories(): Promise<AccountingTransactionCategory[]>;
  getAccountingTransactionCategoriesByBusinessIds(businessIds: number[] | null): Promise<AccountingTransactionCategory[]>;
  
  // Accounting Transaction methods
  getAllAccountingTransactions(): Promise<AccountingTransaction[]>;
  getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined>;
  getAccountingTransactionsByBusinessIds(businessIds: number[] | null): Promise<AccountingTransaction[]>;
  createAccountingTransaction(transaction: InsertAccountingTransaction): Promise<AccountingTransaction>;
  updateAccountingTransaction(id: number, transaction: Partial<InsertAccountingTransaction>): Promise<AccountingTransaction | undefined>;
  deleteAccountingTransaction(id: number): Promise<boolean>;
  
  // Support Ticket methods
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketsByBusinessIds(businessIds: number[] | null): Promise<SupportTicket[]>;
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
  getWhatsappInstancesByBusinessIds(businessIds: number[] | null): Promise<WhatsappInstance[]>;
  createWhatsappInstance(instance: InsertWhatsappInstance): Promise<WhatsappInstance>;
  updateWhatsappInstance(id: number, instance: Partial<InsertWhatsappInstance>): Promise<WhatsappInstance | undefined>;
  deleteWhatsappInstance(id: number): Promise<boolean>;

  // Dashboard Statistics methods
  getDashboardStats(businessIds: number[] | null): Promise<{
    todayAppointments: number;
    yesterdayAppointments: number;
    appointmentChange: string;
    todayRevenue: number;
    yesterdayRevenue: number;
    revenueChange: string;
    revenueChangeType: 'positive' | 'negative' | 'neutral';
    todayClients: number;
    yesterdayClients: number;
    totalClients: number;
    clientChange: string;
    clientChangeType: 'positive' | 'negative' | 'neutral';
    todayCompleted: number;
    yesterdayCompleted: number;
    completedServices: number;
    completedChange: string;
    completedChangeType: 'positive' | 'negative' | 'neutral';
  }>;

  // Settings methods
  getSettings(businessId: number): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(businessId: number, settings: Partial<InsertSettings>): Promise<Settings | undefined>;
  deleteSettings(businessId: number): Promise<boolean>;

  // Translation methods
  getTraduction(string: string, language: string): Promise<Traduction | undefined>;
  getAllTraductions(language: string): Promise<Traduction[]>;
  getBulkTranslations(language: string): Promise<{traduction_id: number, traduction_string: string, traduction: string, language: string}[]>;
  createTraduction(traduction: InsertTraduction): Promise<Traduction>;
  updateTraduction(string: string, language: string, traduction: string): Promise<Traduction | undefined>;
  deleteTraduction(id: number): Promise<boolean>;
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

  async getBusinessesByIds(businessIds: number[]): Promise<Business[]> {
    return await this.db.select().from(businesses).where(inArray(businesses.id, businessIds));
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
        address: persons.address,
        hire_date: persons.hire_date,
        salary: persons.salary,
        created_at: persons.created_at,
        updated_at: persons.updated_at,
        deleted_at: persons.deleted_at,
        user_id: persons.user_id,
        role_id: users_roles.role_id,
        role_type: roles.type,
      })
      .from(persons)
      .innerJoin(users, eq(persons.user_id, users.id))
      .innerJoin(users_roles, eq(users.id, users_roles.user_id))
      .innerJoin(roles, eq(users_roles.role_id, roles.id))
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
        address: persons.address,
        hire_date: persons.hire_date,
        salary: persons.salary,
        created_at: persons.created_at,
        updated_at: persons.updated_at,
        deleted_at: persons.deleted_at,
        user_id: persons.user_id,
        role_id: users_roles.role_id,
        role_type: roles.type,
      })
      .from(persons)
      .innerJoin(users, eq(persons.user_id, users.id))
      .innerJoin(users_roles, eq(users.id, users_roles.user_id))
      .innerJoin(roles, eq(users_roles.role_id, roles.id))
      .innerJoin(users_business, eq(users.id, users_business.user_id))
      .where(and(roleWhereCondition, businessWhereCondition));
    
    // Remove duplicates by person ID at application level
    const uniquePersons = result.filter((person, index, arr) => 
      arr.findIndex(p => p.id === person.id) === index
    );
    
    return uniquePersons;
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
    // First, check if this person has any appointments
    const relatedAppointments = await this.db
      .select({ id: appointments.id })
      .from(appointments)
      .where(or(eq(appointments.client_id, id), eq(appointments.user_id, id)))
      .limit(1);

    if (relatedAppointments.length > 0) {
      throw new Error("Cannot delete person with existing appointments. Please cancel or reassign appointments first.");
    }

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
    // Strict business filtering - only return services belonging to specified business IDs
    if (!businessIds || businessIds.length === 0) {
      return [];
    }
    return await this.db
      .select()
      .from(services)
      .where(inArray(services.business_id, businessIds));
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
      // Get today's date in local timezone as YYYY-MM-DD string
      const todayDate = new Date();
      const year = todayDate.getFullYear();
      const month = String(todayDate.getMonth() + 1).padStart(2, '0');
      const day = String(todayDate.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;
      conditions.push(eq(appointments.appointment_date, todayString));
    } else if (startDate && endDate) {
      // Use dates directly as strings without timezone conversion
      conditions.push(
        and(
          gte(appointments.appointment_date, startDate),
          lte(appointments.appointment_date, endDate)
        )
      );
    } else if (startDate) {
      conditions.push(gte(appointments.appointment_date, startDate));
    } else if (endDate) {
      conditions.push(lte(appointments.appointment_date, endDate));
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
  async getAllBarberPlans(businessIds?: number[] | null): Promise<BarberPlan[]> {
    if (businessIds === null) {
      // No filtering for super admin
      return await this.db.select().from(barber_plans);
    }
    
    if (businessIds && businessIds.length > 0) {
      return await this.db.select().from(barber_plans).where(inArray(barber_plans.business_id, businessIds));
    }
    
    return [];
  }

  async getBarberPlan(id: number, businessIds?: number[] | null): Promise<BarberPlan | undefined> {
    if (businessIds === null) {
      // No filtering for super admin
      const result = await this.db.select().from(barber_plans).where(eq(barber_plans.id, id));
      return result[0];
    }
    
    if (businessIds && businessIds.length > 0) {
      const result = await this.db.select().from(barber_plans).where(
        and(eq(barber_plans.id, id), inArray(barber_plans.business_id, businessIds))
      );
      return result[0];
    }
    
    return undefined;
  }

  async createBarberPlan(insertBarberPlan: InsertBarberPlan): Promise<BarberPlan> {
    const result = await this.db.insert(barber_plans).values(insertBarberPlan).returning();
    return result[0];
  }

  async updateBarberPlan(id: number, updateData: Partial<InsertBarberPlan>, businessIds?: number[] | null): Promise<BarberPlan | undefined> {
    if (businessIds === null) {
      // No filtering for super admin
      const result = await this.db.update(barber_plans)
        .set(updateData)
        .where(eq(barber_plans.id, id))
        .returning();
      return result[0];
    }
    
    if (businessIds && businessIds.length > 0) {
      const result = await this.db.update(barber_plans)
        .set(updateData)
        .where(and(eq(barber_plans.id, id), inArray(barber_plans.business_id, businessIds)))
        .returning();
      return result[0];
    }
    
    return undefined;
  }

  async deleteBarberPlan(id: number, businessIds?: number[] | null): Promise<boolean> {
    if (businessIds === null) {
      // No filtering for super admin
      const result = await this.db.delete(barber_plans)
        .where(eq(barber_plans.id, id));
      return result.rowCount > 0;
    }
    
    if (businessIds && businessIds.length > 0) {
      const result = await this.db.delete(barber_plans)
        .where(and(eq(barber_plans.id, id), inArray(barber_plans.business_id, businessIds)));
      return result.rowCount > 0;
    }
    
    return false;
  }

  // Payment Gateway methods
  async getAllPaymentGateways(): Promise<PaymentGateway[]> {
    return await this.db.select().from(payment_gateways);
  }

  async getPaymentGatewaysByBusinessIds(businessIds: number[] | null): Promise<PaymentGateway[]> {
    if (!businessIds || businessIds.length === 0) {
      return [];
    }
    return await this.db.select()
      .from(payment_gateways)
      .where(inArray(payment_gateways.business_id, businessIds));
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

  // Accounting Transaction Category methods
  async getAllAccountingTransactionCategories(): Promise<AccountingTransactionCategory[]> {
    return await this.db.select().from(accounting_transaction_categories);
  }

  async getAccountingTransactionCategoriesByBusinessIds(businessIds: number[] | null): Promise<AccountingTransactionCategory[]> {
    if (businessIds === null) {
      return await this.db.select().from(accounting_transaction_categories);
    }
    return await this.db.select().from(accounting_transaction_categories).where(inArray(accounting_transaction_categories.business_id, businessIds));
  }

  // Accounting Transaction methods
  async getAllAccountingTransactions(): Promise<AccountingTransaction[]> {
    return await this.db.select().from(accounting_transactions);
  }

  async getAccountingTransaction(id: number): Promise<AccountingTransaction | undefined> {
    const result = await this.db.select().from(accounting_transactions).where(eq(accounting_transactions.id, id));
    return result[0];
  }

  async getAccountingTransactionsByBusinessIds(businessIds: number[] | null): Promise<AccountingTransaction[]> {
    if (businessIds === null) {
      return await this.db.select().from(accounting_transactions);
    }
    return await this.db.select().from(accounting_transactions).where(inArray(accounting_transactions.business_id, businessIds));
  }

  async createAccountingTransaction(insertAccountingTransaction: InsertAccountingTransaction): Promise<AccountingTransaction> {
    const result = await this.db.insert(accounting_transactions).values(insertAccountingTransaction).returning();
    return result[0];
  }

  async updateAccountingTransaction(id: number, updateData: Partial<InsertAccountingTransaction>, businessIds?: number[] | null): Promise<AccountingTransaction | undefined> {
    if (businessIds === null) {
      // No filtering for super admin
      const result = await this.db.update(accounting_transactions).set(updateData).where(eq(accounting_transactions.id, id)).returning();
      return result[0];
    }
    
    if (businessIds && businessIds.length > 0) {
      const result = await this.db.update(accounting_transactions)
        .set(updateData)
        .where(and(eq(accounting_transactions.id, id), inArray(accounting_transactions.business_id, businessIds)))
        .returning();
      return result[0];
    }
    
    return undefined;
  }

  async deleteAccountingTransaction(id: number, businessIds?: number[] | null): Promise<boolean> {
    if (businessIds === null) {
      // No filtering for super admin
      const result = await this.db.delete(accounting_transactions).where(eq(accounting_transactions.id, id));
      return result.rowCount > 0;
    }
    
    if (businessIds && businessIds.length > 0) {
      const result = await this.db.delete(accounting_transactions)
        .where(and(eq(accounting_transactions.id, id), inArray(accounting_transactions.business_id, businessIds)));
      return result.rowCount > 0;
    }
    
    return false;
  }

  // Dashboard Statistics methods
  async getDashboardStats(businessIds?: number[] | null): Promise<{
    todayAppointments: number;
    yesterdayAppointments: number;
    appointmentChange: string;
    todayRevenue: number;
    yesterdayRevenue: number;
    revenueChange: string;
    totalClients: number;
    completedServices: number;
  }> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    try {
      // Use raw SQL queries for better control and compatibility
      let businessFilter = '';
      const businessParams: string[] = [];
      
      if (businessIds !== null && businessIds && businessIds.length > 0) {
        businessFilter = ` AND business_id = ANY($${businessParams.length + 1})`;
        businessParams.push(`{${businessIds.join(',')}}`);
      }

      // Get today's appointments count
      const todayAppointmentsQuery = businessIds && businessIds.length > 0 
        ? `SELECT COUNT(*) as count FROM appointments WHERE appointment_date = '${todayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM appointments WHERE appointment_date = '${todayStr}'`;
      const todayAppointmentsResult = await this.db.execute(sql.raw(todayAppointmentsQuery));

      // Get yesterday's appointments count
      const yesterdayAppointmentsQuery = businessIds && businessIds.length > 0 
        ? `SELECT COUNT(*) as count FROM appointments WHERE appointment_date = '${yesterdayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM appointments WHERE appointment_date = '${yesterdayStr}'`;
      const yesterdayAppointmentsResult = await this.db.execute(sql.raw(yesterdayAppointmentsQuery));

      // Get today's revenue
      const todayRevenueQuery = businessIds && businessIds.length > 0
        ? `SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total FROM accounting_transactions WHERE type = 'revenue' AND transaction_date = '${todayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total FROM accounting_transactions WHERE type = 'revenue' AND transaction_date = '${todayStr}'`;
      const todayRevenueResult = await this.db.execute(sql.raw(todayRevenueQuery));

      // Get yesterday's revenue
      const yesterdayRevenueQuery = businessIds && businessIds.length > 0
        ? `SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total FROM accounting_transactions WHERE type = 'revenue' AND transaction_date = '${yesterdayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total FROM accounting_transactions WHERE type = 'revenue' AND transaction_date = '${yesterdayStr}'`;
      const yesterdayRevenueResult = await this.db.execute(sql.raw(yesterdayRevenueQuery));

      // Get today's new clients (registered today)
      const todayClientsQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(DISTINCT p.id) as count FROM persons p 
           JOIN users u ON p.user_id = u.id 
           JOIN users_business ub ON u.id = ub.user_id 
           WHERE ub.business_id = ANY(ARRAY[${businessIds.join(',')}]) AND DATE(p.created_at) = '${todayStr}'`
        : `SELECT COUNT(*) as count FROM persons WHERE DATE(created_at) = '${todayStr}'`;
      const todayClientsResult = await this.db.execute(sql.raw(todayClientsQuery));

      // Get yesterday's new clients (registered yesterday)
      const yesterdayClientsQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(DISTINCT p.id) as count FROM persons p 
           JOIN users u ON p.user_id = u.id 
           JOIN users_business ub ON u.id = ub.user_id 
           WHERE ub.business_id = ANY(ARRAY[${businessIds.join(',')}]) AND DATE(p.created_at) = '${yesterdayStr}'`
        : `SELECT COUNT(*) as count FROM persons WHERE DATE(created_at) = '${yesterdayStr}'`;
      const yesterdayClientsResult = await this.db.execute(sql.raw(yesterdayClientsQuery));

      // Get total clients (all registered clients)
      const totalClientsQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(DISTINCT p.id) as count FROM persons p 
           JOIN users u ON p.user_id = u.id 
           JOIN users_business ub ON u.id = ub.user_id 
           WHERE ub.business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM persons`;
      const totalClientsResult = await this.db.execute(sql.raw(totalClientsQuery));

      // Get today's completed appointments
      const todayCompletedQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed') AND appointment_date = '${todayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed') AND appointment_date = '${todayStr}'`;
      const todayCompletedResult = await this.db.execute(sql.raw(todayCompletedQuery));

      // Get yesterday's completed appointments
      const yesterdayCompletedQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed') AND appointment_date = '${yesterdayStr}' AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed') AND appointment_date = '${yesterdayStr}'`;
      const yesterdayCompletedResult = await this.db.execute(sql.raw(yesterdayCompletedQuery));

      // Get total completed services count
      const totalCompletedQuery = businessIds && businessIds.length > 0
        ? `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed') AND business_id = ANY(ARRAY[${businessIds.join(',')}])`
        : `SELECT COUNT(*) as count FROM appointments WHERE (status = 'completed' OR status = 'Completed')`;
      const totalCompletedResult = await this.db.execute(sql.raw(totalCompletedQuery));

      const todayAppointments = Number(todayAppointmentsResult.rows[0]?.count || 0);
      const yesterdayAppointments = Number(yesterdayAppointmentsResult.rows[0]?.count || 0);
      const todayRevenue = Number(todayRevenueResult.rows[0]?.total || 0);
      const yesterdayRevenue = Number(yesterdayRevenueResult.rows[0]?.total || 0);
      const todayClients = Number(todayClientsResult.rows[0]?.count || 0);
      const yesterdayClients = Number(yesterdayClientsResult.rows[0]?.count || 0);
      const totalClients = Number(totalClientsResult.rows[0]?.count || 0);
      const todayCompleted = parseInt(todayCompletedResult.rows[0]?.count || '0', 10);
      const yesterdayCompleted = parseInt(yesterdayCompletedResult.rows[0]?.count || '0', 10);
      const completedServices = parseInt(totalCompletedResult.rows[0]?.count || '0', 10);
      


      // Calculate appointment change
      const appointmentDiff = todayAppointments - yesterdayAppointments;
      const appointmentChange = appointmentDiff > 0 
        ? `+${appointmentDiff} from yesterday`
        : appointmentDiff < 0 
          ? `${appointmentDiff} from yesterday`
          : 'Same as yesterday';

      // Calculate revenue change with dollar amounts
      const revenueDiff = todayRevenue - yesterdayRevenue;
      let revenueChange = 'Same as yesterday';
      let revenueChangeType = 'neutral';
      
      if (revenueDiff > 0) {
        revenueChange = `$${revenueDiff.toFixed(2)} more than yesterday`;
        revenueChangeType = 'positive';
      } else if (revenueDiff < 0) {
        revenueChange = `$${Math.abs(revenueDiff).toFixed(2)} less than yesterday`;
        revenueChangeType = 'negative';
      } else if (todayRevenue === 0 && yesterdayRevenue === 0) {
        revenueChange = 'No revenue data';
        revenueChangeType = 'neutral';
      }

      // Calculate client registration change with percentage
      const clientDiff = todayClients - yesterdayClients;
      let clientChange = 'Same as yesterday';
      let clientChangeType = 'neutral';
      
      if (clientDiff > 0 && yesterdayClients > 0) {
        const clientPercent = Math.round((clientDiff / yesterdayClients) * 100);
        clientChange = `${clientPercent}% more than yesterday`;
        clientChangeType = 'positive';
      } else if (clientDiff < 0 && yesterdayClients > 0) {
        const clientPercent = Math.round((Math.abs(clientDiff) / yesterdayClients) * 100);
        clientChange = `${clientPercent}% less than yesterday`;
        clientChangeType = 'negative';
      } else if (yesterdayClients === 0 && todayClients > 0) {
        clientChange = `${todayClients} new clients today`;
        clientChangeType = 'positive';
      } else if (todayClients === 0 && yesterdayClients === 0) {
        clientChange = 'No new clients';
        clientChangeType = 'neutral';
      }

      // Calculate completed appointments change 
      const completedDiff = todayCompleted - yesterdayCompleted;
      let completedChange = 'Same as yesterday';
      let completedChangeType = 'neutral';
      
      if (completedDiff > 0) {
        completedChange = `${completedDiff} more than yesterday`;
        completedChangeType = 'positive';
      } else if (completedDiff < 0) {
        completedChange = `${Math.abs(completedDiff)} less than yesterday`;
        completedChangeType = 'negative';
      } else if (todayCompleted === 0 && yesterdayCompleted === 0) {
        completedChange = 'No completed appointments';
        completedChangeType = 'neutral';
      }

      return {
        todayAppointments,
        yesterdayAppointments,
        appointmentChange,
        todayRevenue,
        yesterdayRevenue,
        revenueChange,
        revenueChangeType,
        todayClients,
        yesterdayClients,
        totalClients,
        clientChange,
        clientChangeType,
        todayCompleted,
        yesterdayCompleted,
        completedServices,
        completedChange,
        completedChangeType,
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return zero values if queries fail
      return {
        todayAppointments: 0,
        yesterdayAppointments: 0,
        appointmentChange: 'No data',
        todayRevenue: 0,
        yesterdayRevenue: 0,
        revenueChange: 'No data',
        revenueChangeType: 'neutral' as const,
        todayClients: 0,
        yesterdayClients: 0,
        totalClients: 0,
        clientChange: 'No data',
        clientChangeType: 'neutral' as const,
        todayCompleted: 0,
        yesterdayCompleted: 0,
        completedServices: 0,
        completedChange: 'No data',
        completedChangeType: 'neutral' as const,
      };
    }
  }

  // Support Ticket methods
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return await this.db.select().from(support_tickets);
  }

  async getSupportTicketsByBusinessIds(businessIds: number[] | null): Promise<SupportTicket[]> {
    if (!businessIds || businessIds.length === 0) {
      return [];
    }
    return await this.db.select()
      .from(support_tickets)
      .where(inArray(support_tickets.business_id, businessIds));
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

  async getWhatsappInstancesByBusinessIds(businessIds: number[] | null): Promise<WhatsappInstance[]> {
    if (!businessIds || businessIds.length === 0) {
      return [];
    }
    return await this.db.select()
      .from(whatsapp_instances)
      .where(inArray(whatsapp_instances.business_id, businessIds));
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

  // Settings methods
  async getSettings(businessId: number): Promise<Settings | undefined> {
    const result = await this.db.select().from(settings).where(eq(settings.business_id, businessId));
    return result[0];
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const result = await this.db.insert(settings).values(insertSettings).returning();
    return result[0];
  }

  async updateSettings(businessId: number, updateData: Partial<InsertSettings>): Promise<Settings | undefined> {
    const result = await this.db.update(settings).set({
      ...updateData,
      updated_at: new Date()
    }).where(eq(settings.business_id, businessId)).returning();
    return result[0];
  }

  async deleteSettings(businessId: number): Promise<boolean> {
    const result = await this.db.delete(settings).where(eq(settings.business_id, businessId));
    return result.rowCount > 0;
  }

  // Translation methods
  // Get English source strings (traductions table)
  async getAllTraductions(): Promise<Traduction[]> {
    return await this.db.select().from(traductions);
  }

  async getTraductionByString(string: string): Promise<Traduction | undefined> {
    const result = await this.db.select().from(traductions).where(eq(traductions.string, string));
    return result[0];
  }

  async createTraduction(insertTraduction: InsertTraduction): Promise<Traduction> {
    const result = await this.db.insert(traductions).values(insertTraduction).returning();
    return result[0];
  }

  // Get translations for a specific language (translations table)
  async getTranslationsByLanguage(language: string): Promise<Translation[]> {
    return await this.db.select({
      id: translations.id,
      traduction_id: translations.traduction_id,
      traduction: translations.traduction,
      language: translations.language,
      created_at: translations.created_at,
      updated_at: translations.updated_at,
      string: traductions.string
    }).from(translations)
    .innerJoin(traductions, eq(translations.traduction_id, traductions.id))
    .where(eq(translations.language, language));
  }

  async getTranslation(traductionId: number, language: string): Promise<Translation | undefined> {
    const result = await this.db.select().from(translations).where(
      and(eq(translations.traduction_id, traductionId), eq(translations.language, language))
    );
    return result[0];
  }

  async createOrUpdateTranslation(traductionId: number, language: string, traduction: string): Promise<Translation> {
    // Try to update existing translation
    const existing = await this.getTranslation(traductionId, language);
    
    if (existing) {
      const result = await this.db.update(translations).set({
        traduction,
        updated_at: new Date()
      }).where(
        and(eq(translations.traduction_id, traductionId), eq(translations.language, language))
      ).returning();
      return result[0];
    } else {
      // Create new translation
      const result = await this.db.insert(translations).values({
        traduction_id: traductionId,
        traduction,
        language
      }).returning();
      return result[0];
    }
  }

  async deleteTranslation(id: number): Promise<boolean> {
    const result = await this.db.delete(translations).where(eq(translations.id, id));
    return result.rowCount > 0;
  }

  async getBulkTranslations(language: string): Promise<{traduction_id: number, traduction_string: string, traduction: string, language: string}[]> {
    if (language === 'en') {
      // For English, get all source strings from traductions table
      const result = await this.db.select({
        traduction_id: traductions.id,
        traduction_string: traductions.string,
        traduction: traductions.string, // English source = translation
        language: sql<string>`'en'`
      }).from(traductions);
      
      return result;
    } else {
      // For other languages, join traductions and translations tables
      const result = await this.db.select({
        traduction_id: traductions.id,
        traduction_string: traductions.string,
        traduction: translations.traduction,
        language: translations.language
      })
      .from(traductions)
      .leftJoin(translations, and(
        eq(translations.traduction_id, traductions.id),
        eq(translations.language, language)
      ))
      .where(eq(translations.language, language)); // Only return rows with translations
      
      return result;
    }
  }
}

const storage = new PostgresStorage();
export default storage;