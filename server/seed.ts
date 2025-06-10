import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users, business, staff, clients, barberPlans, services, appointments, paymentGateways, accountingTransactions, supportTickets, faqs, whatsappInstances } from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedDatabase() {
  console.log("Starting database seeding...");

  // First create users for staff (super-admin, merchant, collaborator)
  const staffUsers = await db.insert(users).values([
    { username: "admin", password: "admin123", role: "super-admin" },
    { username: "john.martinez", password: "john123", role: "merchant" },
    { username: "maria.rodriguez", password: "maria123", role: "collaborator" },
    { username: "carlos.silva", password: "carlos123", role: "collaborator" },
    { username: "ana.costa", password: "ana123", role: "collaborator" },
    { username: "pedro.santos", password: "pedro123", role: "collaborator" },
    { username: "lucia.oliveira", password: "lucia123", role: "collaborator" },
    { username: "rafael.almeida", password: "rafael123", role: "collaborator" }
  ]).returning();

  // Create users for clients
  const clientUsers = await db.insert(users).values([
    { username: "david.wilson", password: "david123", role: "client" },
    { username: "michael.johnson", password: "michael123", role: "client" },
    { username: "sarah.brown", password: "sarah123", role: "client" },
    { username: "james.davis", password: "james123", role: "client" },
    { username: "emma.miller", password: "emma123", role: "client" },
    { username: "robert.garcia", password: "robert123", role: "client" },
    { username: "lisa.martinez", password: "lisa123", role: "client" },
    { username: "william.anderson", password: "william123", role: "client" }
  ]).returning();

  // Create business records linked to merchant users
  const businesses = await db.insert(business).values([
    {
      user_id: staffUsers[1].id, // John Martinez as merchant
      name: "Elite Barbershop",
      description: "Premium barbershop providing high-quality cuts and grooming services",
      address: "123 Main Street, Downtown",
      phone: "+1234567891",
      email: "contact@elitebarbershop.com",
      tax_id: "987654321"
    },
    {
      user_id: staffUsers[0].id, // Admin as super-admin can have a business too
      name: "Admin Business Hub",
      description: "Administrative business management center",
      address: "456 Admin Avenue",
      phone: "+1234567890",
      email: "admin@barbershop.com",
      tax_id: "123456789"
    }
  ]).returning();

  // Create staff records linked to users and businesses
  const staffMembers = await db.insert(staff).values([
    {
      user_id: staffUsers[0].id,
      business_id: businesses[1].id, // Admin Business Hub
      first_name: "Admin",
      last_name: "Super",
      email: "admin@barbershop.com",
      phone: "+1234567890",
      tax_id: "12345678901",
      role: "Administrator",
      hire_date: "2020-01-01",
      salary: 8000
    },
    {
      user_id: staffUsers[1].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "John",
      last_name: "Martinez",
      email: "john@barbershop.com",
      phone: "+1234567891",
      tax_id: "12345678902",
      role: "Senior Barber",
      hire_date: "2022-01-15",
      salary: 4500
    },
    {
      user_id: staffUsers[2].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Maria",
      last_name: "Rodriguez",
      email: "maria@barbershop.com",
      phone: "+1234567892",
      tax_id: "12345678903",
      role: "Master Barber",
      hire_date: "2021-08-20",
      salary: 5200
    },
    {
      user_id: staffUsers[3].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Carlos",
      last_name: "Silva",
      email: "carlos@barbershop.com",
      phone: "+1234567893",
      tax_id: "12345678904",
      role: "Barber",
      hire_date: "2023-03-10",
      salary: 3800
    },
    {
      user_id: staffUsers[4].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Ana",
      last_name: "Costa",
      email: "ana@barbershop.com",
      phone: "+1234567894",
      tax_id: "12345678905",
      role: "Stylist",
      hire_date: "2022-11-05",
      salary: 4200
    },
    {
      user_id: staffUsers[5].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Pedro",
      last_name: "Santos",
      email: "pedro@barbershop.com",
      phone: "+1234567895",
      tax_id: "12345678906",
      role: "Junior Barber",
      hire_date: "2023-06-20",
      salary: 3200
    },
    {
      user_id: staffUsers[6].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Lucia",
      last_name: "Oliveira",
      email: "lucia@barbershop.com",
      phone: "+1234567896",
      tax_id: "12345678907",
      role: "Receptionist",
      hire_date: "2022-09-15",
      salary: 2800
    },
    {
      user_id: staffUsers[7].id,
      business_id: businesses[0].id, // Elite Barbershop
      first_name: "Rafael",
      last_name: "Almeida",
      email: "rafael@barbershop.com",
      phone: "+1234567897",
      tax_id: "12345678908",
      role: "Assistant",
      hire_date: "2023-04-01",
      salary: 2500
    }
  ]).returning();

  // Create client records linked to users
  const clientList = await db.insert(clients).values([
    {
      user_id: clientUsers[0].id,
      first_name: "David",
      last_name: "Wilson",
      email: "david.wilson@email.com",
      phone: "+1555123456",
      tax_id: "98765432100",
      type: "individual",
      address: "123 Main St, City, State 12345"
    },
    {
      user_id: clientUsers[1].id,
      first_name: "Michael",
      last_name: "Johnson",
      email: "m.johnson@email.com",
      phone: "+1555123457",
      tax_id: "98765432101",
      type: "individual",
      address: "456 Oak Ave, City, State 12345"
    },
    {
      user_id: clientUsers[2].id,
      first_name: "Sarah",
      last_name: "Brown",
      email: "sarah.brown@email.com",
      phone: "+1555123458",
      tax_id: "98765432102",
      type: "individual",
      address: "789 Pine St, City, State 12345"
    },
    {
      user_id: clientUsers[3].id,
      first_name: "James",
      last_name: "Davis",
      email: "james.davis@email.com",
      phone: "+1555123459",
      tax_id: "98765432103",
      type: "individual",
      address: "321 Elm St, City, State 12345"
    },
    {
      user_id: clientUsers[4].id,
      first_name: "Emma",
      last_name: "Miller",
      email: "emma.miller@email.com",
      phone: "+1555123460",
      tax_id: "98765432104",
      type: "individual",
      address: "654 Maple Ave, City, State 12345"
    },
    {
      user_id: clientUsers[5].id,
      first_name: "Robert",
      last_name: "Garcia",
      email: "robert.garcia@email.com",
      phone: "+1555123461",
      tax_id: "98765432105",
      type: "individual",
      address: "987 Cedar Ln, City, State 12345"
    },
    {
      user_id: clientUsers[6].id,
      first_name: "Lisa",
      last_name: "Martinez",
      email: "lisa.martinez@email.com",
      phone: "+1555123462",
      tax_id: "98765432106",
      type: "individual",
      address: "147 Birch Dr, City, State 12345"
    },
    {
      user_id: clientUsers[7].id,
      first_name: "William",
      last_name: "Anderson",
      email: "william.anderson@email.com",
      phone: "+1555123463",
      tax_id: "98765432107",
      type: "individual",
      address: "258 Walnut St, City, State 12345"
    }
  ]).returning();

  // Seed Services
  const serviceList = await db.insert(services).values([
    {
      name: "Classic Haircut",
      description: "Traditional men's haircut with scissors and clipper",
      duration: 30,
      price: 2500, // Price in cents
      staff_id: staffMembers[0].id
    },
    {
      name: "Beard Trim",
      description: "Professional beard trimming and shaping",
      duration: 20,
      price: 1500, // Price in cents
      staff_id: staffMembers[0].id
    },
    {
      name: "Hot Towel Shave",
      description: "Traditional hot towel shave with straight razor",
      duration: 45,
      price: 3500, // Price in cents
      staff_id: staffMembers[1].id
    }
  ]).returning();

  // Seed Appointments
  await db.insert(appointments).values([
    {
      client_id: clientList[0].id,
      staff_id: staffMembers[0].id,
      service_id: serviceList[0].id,
      appointment_date: "2024-06-15",
      appointment_time: "10:00",
      status: "scheduled",
      notes: "First appointment"
    },
    {
      client_id: clientList[1].id,
      staff_id: staffMembers[1].id,
      service_id: serviceList[2].id,
      appointment_date: "2024-06-16",
      appointment_time: "14:00",
      status: "completed",
      notes: "Regular customer"
    }
  ]);

  // Seed Barber Plans
  await db.insert(barberPlans).values([
    {
      title: "Basic Plan",
      subtitle: "Perfect for new barbers",
      benefits: ["Basic training materials", "Essential tools included", "Email support"],
      image1: "/images/basic-plan.jpg",
      image2: "/images/basic-tools.jpg",
      price1m: 9999,
      price3m: 27999,
      price12m: 99999,
      payment_link: "https://payment.example.com/basic"
    },
    {
      title: "Professional Plan",
      subtitle: "For experienced barbers",
      benefits: ["Advanced training modules", "Premium tool set", "Priority support", "Business management tools"],
      image1: "/images/pro-plan.jpg",
      image2: "/images/pro-tools.jpg",
      price1m: 19999,
      price3m: 54999,
      price12m: 199999,
      payment_link: "https://payment.example.com/professional"
    }
  ]);

  // Seed Payment Gateways
  await db.insert(paymentGateways).values([
    {
      name: "Main Mercado Pago",
      type: "MercadoPago",
      email: "payments@barbershop.com",
      staff_id: staffMembers[0].id,
      is_active: true,
      api_url: "https://api.mercadopago.com",
      api_key: "mp_key_123",
      token: "mp_token_456"
    },
    {
      name: "Backup PayPal",
      type: "PayPal",
      email: "backup@barbershop.com",
      staff_id: staffMembers[1].id,
      is_active: false,
      api_url: "https://api.paypal.com",
      api_key: "pp_key_789",
      token: "pp_token_012"
    }
  ]);

  // Seed Accounting Transactions
  await db.insert(accountingTransactions).values([
    {
      type: "revenue",
      category: "Haircut Services",
      description: "Classic haircut service payment",
      amount: 2500,
      payment_method: "cash",
      transaction_date: "2024-06-10",
      staff_id: staffMembers[0].id,
      client_id: clientList[0].id,
      notes: "Cash payment received",
      reference_number: "TXN001",
      is_recurring: false
    },
    {
      type: "expense",
      category: "Supplies",
      description: "Hair cutting tools and supplies",
      amount: 15000,
      payment_method: "credit_card",
      transaction_date: "2024-06-05",
      staff_id: staffMembers[1].id,
      client_id: null,
      notes: "Monthly supply purchase",
      reference_number: "EXP001",
      is_recurring: true
    }
  ]);

  // Seed Support Tickets
  await db.insert(supportTickets).values([
    {
      title: "Unable to book appointment",
      description: "Customer experiencing issues with the online booking system",
      category: "Technical",
      priority: "medium",
      status: "open",
      client_email: "customer@email.com",
      client_name: "Jane Smith",
      assigned_staff_id: staffMembers[0].id,
      resolution_notes: null,
      attachments: []
    },
    {
      title: "Payment processing error",
      description: "Credit card payment failed during checkout",
      category: "Payment",
      priority: "high",
      status: "resolved",
      client_email: "john.doe@email.com",
      client_name: "John Doe",
      assigned_staff_id: staffMembers[1].id,
      resolution_notes: "Payment gateway issue resolved, customer charged successfully",
      attachments: ["payment_log.txt"]
    }
  ]);

  // Seed FAQs
  await db.insert(faqs).values([
    {
      question: "What are your operating hours?",
      answer: "We are open Monday to Friday from 9 AM to 7 PM, and Saturday from 8 AM to 6 PM. We are closed on Sundays.",
      category: "General",
      is_published: true,
      order_index: 1
    },
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment through our online booking system, call us directly, or visit our shop. We recommend booking in advance to secure your preferred time slot.",
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
    }
  ]);

  // Seed WhatsApp Instances
  await db.insert(whatsappInstances).values([
    {
      name: "Main Business WhatsApp",
      phone_number: "+1234567890",
      status: "connected",
      webhook_url: "https://barbershop.com/webhook",
      session_id: "main_session_123",
      last_seen: new Date(),
      qr_code: null
    },
    {
      name: "Customer Support",
      phone_number: "+1234567891",
      status: "disconnected",
      webhook_url: "https://barbershop.com/webhook2",
      session_id: null,
      last_seen: null,
      qr_code: null
    }
  ]);

  console.log("Database seeding completed successfully!");
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };