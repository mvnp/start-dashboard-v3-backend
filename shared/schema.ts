import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, time, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create ENUM types to match the database
export const transactionTypeEnum = pgEnum('transaction_type', ['revenue', 'expense']);
export const priorityLevelEnum = pgEnum('priority_level', ['Low', 'Medium', 'High', 'Urgent']);
export const ticketStatusEnum = pgEnum('ticket_status', ['Open', 'In Progress', 'Resolved', 'Closed']);
export const whatsappStatusEnum = pgEnum('whatsapp_status', ['Connected', 'Disconnected', 'Error']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description"),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  tax_id: text("tax_id"),
  user_id: integer("user_id").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const persons = pgTable("persons", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  phone: text("phone"),
  tax_id: text("tax_id"),
  hire_date: date("hire_date"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  user_id: integer("user_id").references(() => users.id),
});

export const users_business = pgTable("users_business", {
  user_id: integer("user_id").references(() => users.id),
  business_id: integer("business_id").references(() => businesses.id),
});

export const users_roles = pgTable("users_roles", {
  user_id: integer("user_id").references(() => users.id),
  role_id: integer("role_id").references(() => roles.id),
});

export const accounting_transaction_categories = pgTable("accounting_transaction_categories", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  business_id: integer("business_id").references(() => businesses.id),
});

export const accounting_transactions = pgTable("accounting_transactions", {
  id: serial("id").primaryKey(),
  type: transactionTypeEnum("type").notNull(),
  category: text("category"),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_method: text("payment_method"),
  reference_number: text("reference_number"),
  transaction_date: date("transaction_date").notNull(),
  notes: text("notes"),
  is_recurring: boolean("is_recurring").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: integer("user_id").references(() => users.id),
  accounting_category_id: integer("accounting_category_id").references(() => accounting_transaction_categories.id),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // duration in minutes
  price: decimal("price", { precision: 10, scale: 2 }),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  business_id: integer("business_id").references(() => businesses.id),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  appointment_date: date("appointment_date").notNull(),
  appointment_time: time("appointment_time").notNull(),
  status: text("status").default('Scheduled'),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
  user_id: integer("user_id").references(() => users.id),
  business_id: integer("business_id").references(() => businesses.id),
  service_id: integer("service_id").references(() => services.id),
});

export const barber_plans = pgTable("barber_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  benefits: text("benefits").array(),
  image1: text("image1"),
  image2: text("image2"),
  price1m: decimal("price1m", { precision: 10, scale: 2 }),
  price3m: decimal("price3m", { precision: 10, scale: 2 }),
  price12m: decimal("price12m", { precision: 10, scale: 2 }),
  payment_link: text("payment_link"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  business_id: integer("business_id").references(() => businesses.id),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  is_published: boolean("is_published").default(true),
  order_index: integer("order_index").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const payment_gateway_types = pgTable("payment_gateway_types", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
});

export const payment_gateways = pgTable("payment_gateways", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  api_url: text("api_url"),
  api_key: text("api_key"),
  token: text("token"),
  email: text("email"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  business_id: integer("business_id").references(() => businesses.id),
  type_id: integer("type_id").references(() => payment_gateway_types.id),
});

export const support_ticket_categories = pgTable("support_ticket_categories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});

export const support_tickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: priorityLevelEnum("priority").default('Medium'),
  status: ticketStatusEnum("status").default('Open'),
  category: text("category"),
  client_email: text("client_email"),
  client_name: text("client_name"),
  resolution_notes: text("resolution_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  resolved_at: timestamp("resolved_at"),
  deleted_at: timestamp("deleted_at"),
  assigned_user_id: integer("assigned_user_id").references(() => users.id),
  ticket_open_user_id: integer("ticket_open_user_id").references(() => users.id),
  business_id: integer("business_id").references(() => businesses.id),
});

export const whatsapp_instances = pgTable("whatsapp_instances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone_number: text("phone_number"),
  status: whatsappStatusEnum("status").default('Disconnected'),
  qr_code: text("qr_code"),
  session_id: text("session_id"),
  last_seen: timestamp("last_seen"),
  webhook_url: text("webhook_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  business_id: integer("business_id").references(() => businesses.id),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPersonSchema = createInsertSchema(persons).omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  salary: z.union([z.string(), z.number()]).optional().transform((val) => val ? String(val) : undefined),
});

export const insertUserBusinessSchema = createInsertSchema(users_business);

export const insertUserRoleSchema = createInsertSchema(users_roles);

export const insertAccountingTransactionCategorySchema = createInsertSchema(accounting_transaction_categories).omit({
  id: true,
});

export const insertAccountingTransactionSchema = createInsertSchema(accounting_transactions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const insertBarberPlanSchema = createInsertSchema(barber_plans).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPaymentGatewayTypeSchema = createInsertSchema(payment_gateway_types).omit({
  id: true,
});

export const insertPaymentGatewaySchema = createInsertSchema(payment_gateways).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertSupportTicketCategorySchema = createInsertSchema(support_ticket_categories).omit({
  id: true,
});

export const insertSupportTicketSchema = createInsertSchema(support_tickets).omit({
  id: true,
  created_at: true,
  updated_at: true,
  resolved_at: true,
  deleted_at: true,
});

export const insertWhatsappInstanceSchema = createInsertSchema(whatsapp_instances).omit({
  id: true,
  created_at: true,
  updated_at: true,
  qr_code: true,
  session_id: true,
  last_seen: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof persons.$inferSelect;
export type InsertUserBusiness = z.infer<typeof insertUserBusinessSchema>;
export type UserBusiness = typeof users_business.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof users_roles.$inferSelect;
export type InsertAccountingTransactionCategory = z.infer<typeof insertAccountingTransactionCategorySchema>;
export type AccountingTransactionCategory = typeof accounting_transaction_categories.$inferSelect;
export type InsertAccountingTransaction = z.infer<typeof insertAccountingTransactionSchema>;
export type AccountingTransaction = typeof accounting_transactions.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertBarberPlan = z.infer<typeof insertBarberPlanSchema>;
export type BarberPlan = typeof barber_plans.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertPaymentGatewayType = z.infer<typeof insertPaymentGatewayTypeSchema>;
export type PaymentGatewayType = typeof payment_gateway_types.$inferSelect;
export type InsertPaymentGateway = z.infer<typeof insertPaymentGatewaySchema>;
export type PaymentGateway = typeof payment_gateways.$inferSelect;
export type InsertSupportTicketCategory = z.infer<typeof insertSupportTicketCategorySchema>;
export type SupportTicketCategory = typeof support_ticket_categories.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof support_tickets.$inferSelect;
export type InsertWhatsappInstance = z.infer<typeof insertWhatsappInstanceSchema>;
export type WhatsappInstance = typeof whatsapp_instances.$inferSelect;