import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  tax_id: text("tax_id").notNull(),
  role: text("role").notNull(),
  hire_date: text("hire_date").notNull(),
  salary: integer("salary").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  tax_id: text("tax_id").notNull(),
  type: text("type").notNull(),
  address: text("address").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const barberPlans = pgTable("barber_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  benefits: text("benefits").array().notNull(),
  image1: text("image1").notNull(),
  image2: text("image2").notNull(),
  price1m: integer("price1m").notNull(),
  price3m: integer("price3m").notNull(),
  price12m: integer("price12m").notNull(),
  payment_link: text("payment_link").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in cents
  staff_id: integer("staff_id").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull(),
  staff_id: integer("staff_id").notNull(),
  service_id: integer("service_id").notNull(),
  appointment_date: text("appointment_date").notNull(),
  appointment_time: text("appointment_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, in_progress, completed, cancelled
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const paymentGateways = pgTable("payment_gateways", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Mercado Pago, Asaas, Pagbank
  api_url: text("api_url").notNull(),
  api_key: text("api_key").notNull(),
  token: text("token").notNull(),
  email: text("email").notNull(),
  staff_id: integer("staff_id").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const accountingTransactions = pgTable("accounting_transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "revenue" or "expense"
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // Amount in cents
  payment_method: text("payment_method").notNull(),
  reference_number: text("reference_number"),
  client_id: integer("client_id"),
  staff_id: integer("staff_id"),
  transaction_date: text("transaction_date").notNull(),
  notes: text("notes"),
  is_recurring: boolean("is_recurring").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  category: text("category").notNull(),
  client_email: text("client_email").notNull(),
  client_name: text("client_name").notNull(),
  assigned_staff_id: integer("assigned_staff_id"),
  resolution_notes: text("resolution_notes"),
  attachments: text("attachments").array().default([]), // Array of file URLs/paths
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  resolved_at: timestamp("resolved_at"),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  is_published: boolean("is_published").notNull().default(true),
  order_index: integer("order_index").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertStaffSchema = createInsertSchema(staff).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertBarberPlanSchema = createInsertSchema(barberPlans).omit({
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
});

export const insertPaymentGatewaySchema = createInsertSchema(paymentGateways).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAccountingTransactionSchema = createInsertSchema(accountingTransactions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  created_at: true,
  updated_at: true,
  resolved_at: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const whatsappInstances = pgTable("whatsapp_instances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone_number: text("phone_number").notNull(),
  status: text("status").notNull().default("disconnected"), // disconnected, connecting, connected
  qr_code: text("qr_code"),
  session_id: text("session_id"),
  last_seen: timestamp("last_seen"),
  webhook_url: text("webhook_url"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const insertWhatsappInstanceSchema = createInsertSchema(whatsappInstances).omit({
  id: true,
  created_at: true,
  updated_at: true,
  qr_code: true,
  session_id: true,
  last_seen: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staff.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertBarberPlan = z.infer<typeof insertBarberPlanSchema>;
export type BarberPlan = typeof barberPlans.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertPaymentGateway = z.infer<typeof insertPaymentGatewaySchema>;
export type PaymentGateway = typeof paymentGateways.$inferSelect;
export type InsertAccountingTransaction = z.infer<typeof insertAccountingTransactionSchema>;
export type AccountingTransaction = typeof accountingTransactions.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertWhatsappInstance = z.infer<typeof insertWhatsappInstanceSchema>;
export type WhatsappInstance = typeof whatsappInstances.$inferSelect;
