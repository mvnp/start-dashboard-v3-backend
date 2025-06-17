# BarberPro Management System

## Overview

This is a comprehensive barbershop management system built with a modern full-stack architecture. The application provides role-based access control for managing multiple businesses, staff, clients, appointments, services, and financial operations. It includes features for accounting, support ticketing, WhatsApp integration, and subscription plan management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom barbershop theme
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with automatic authentication middleware
- **Database ORM**: Drizzle ORM with schema-first approach
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with role-based access control

## Key Components

### Authentication & Authorization
- **JWT Bearer Authentication**: Secure token-based system with 24-hour access tokens and 7-day refresh tokens
- Role-based access control with hierarchical permissions:
  - Super Admin: Full system access across all businesses
  - Merchant: Business owner with full access to their business
  - Employee: Staff member with limited business operations access
  - Client: Customer with booking and profile access
- Business-scoped data access with filtering based on user permissions
- JWT endpoints: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`
- All API endpoints require JWT Bearer authentication

### Database Schema
- **Users**: Core user authentication and profile data
- **Roles**: Hierarchical role definitions (super-admin, merchant, employee, client)
- **Businesses**: Multi-tenant business management
- **Persons**: Unified person entity for staff and clients
- **User-Business Relations**: Many-to-many relationships for business access
- **User-Role Relations**: Flexible role assignment system
- **Services**: Business-specific service offerings
- **Appointments**: Scheduling system with status tracking
- **Accounting Transactions**: Financial tracking with categories
- **Support Tickets**: Customer support management
- **WhatsApp Instances**: Communication integration
- **Barber Plans**: Subscription/service plan management
- **Payment Gateways**: Payment processing configuration

### Frontend Features
- Responsive design with mobile-first approach
- Dark/light theme support with CSS custom properties
- Real-time data updates via React Query
- Form validation with Zod schemas
- Toast notifications for user feedback
- Modal dialogs and confirmation prompts
- Search and filtering capabilities
- Pagination and data virtualization

### API Structure
- RESTful endpoints for all entities
- Middleware for authentication and business filtering
- Comprehensive CRUD operations
- Role-based data scoping
- Error handling with proper HTTP status codes

## Data Flow

1. **User Authentication**: Session-based auth with role and business assignment
2. **Data Access**: Business-scoped queries based on user permissions
3. **State Management**: React Query manages server state with optimistic updates
4. **Form Handling**: React Hook Form with Zod validation before API calls
5. **Real-time Updates**: Query invalidation triggers data refetch across components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for Neon
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **express-session**: Session management for authentication
- **wouter**: Lightweight React router
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR
- **Database**: Neon PostgreSQL serverless instance
- **Session Storage**: In-memory sessions for development
- **Auto-authentication**: Automatic Super Admin login for development

### Production Build
- **Frontend**: Vite production build with code splitting
- **Backend**: esbuild bundle for Node.js deployment
- **Database**: Neon PostgreSQL with connection pooling
- **Session Storage**: Configurable session store (PostgreSQL recommended)
- **Environment**: Environment variables for database and session configuration

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Development**: `npm run dev` (runs tsx server with Vite)
- **Production**: `npm run build && npm run start`
- **Database**: Automatic PostgreSQL provisioning via Replit
- **Port Configuration**: Backend on 5000, external on 80
- **Deployment**: Autoscale deployment target

## API Documentation

The application now includes comprehensive Swagger/OpenAPI documentation accessible at `/api-docs`. The documentation covers all major API endpoints including:

- **Authentication**: User login and session management
- **Client Management**: Full CRUD operations for client data
- **Service Management**: Business service offerings management
- **Appointment Management**: Scheduling with filtering and pagination
- **Business Management**: Multi-tenant business operations
- **Accounting**: Transaction and financial tracking
- **WhatsApp Integration**: Communication management

### Accessing Documentation
- **Production**: `https://9d5dc195-9aec-4464-a135-6e1134bfee48-00-3a9ys8x8hly4z.riker.replit.dev/api-docs`
- **Development**: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON: Available at both `/api-docs.json` endpoints

## Changelog

```
Changelog:
- June 17, 2025. Removed legacy session authentication system completely - SaaS now uses JWT-only authentication
- June 17, 2025. Implemented JWT Bearer authentication system with access/refresh tokens (24-hour lifetime)
- June 17, 2025. Added comprehensive Swagger API documentation with interactive UI
- June 16, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```