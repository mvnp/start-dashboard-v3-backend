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

### Business Selection System
- **Multi-Business Support**: Users can be registered to multiple businesses
- **Mandatory Business Selection**: After login, users with multiple businesses must select an active business via modal
- **Session Storage**: Selected business ID is stored in browser session for persistence
- **Business Change Button**: Available in sidebar and mobile header for quick business switching
- **Super Admin Exemption**: Super Admin bypasses business selection requirement and sees all data
- **Automatic Filtering**: All forms, lists, and CRUD operations use selected business context
- **Logout on Close**: Attempting to close business selection modal without selection triggers logout

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
- **Authentication**: Clean login required - no auto-authentication

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

## Translation System and Edition Mode

### Edition Mode Features
- **Inline Translation Editing**: Toggle-able edition mode that displays pen icons next to translatable text
- **Real-time String Translation**: Click pen icon to edit translations inline, save with Enter key
- **Language-based Context**: Automatically uses language from business settings for translation context
- **Database Persistence**: English source strings stored in `traductions` table (id, string, timestamps); Foreign language translations stored in `translations` table (id, traduction_id FK, traduction, language, timestamps)
- **JWT Authentication**: All translation endpoints require Bearer authentication
- **Smart Fallback**: Shows original English text when no translation exists

### Translation API Endpoints (New Architecture)
- `GET /api/traductions/en` - Get all English source strings (traductions table)
- `GET /api/traductions/:language` - Get all translations for a language (translations table with JOIN)
- `GET /api/traductions/:string/:language` - Get specific translation
- `POST /api/traductions` - Create or update translation (handles both English source and foreign translations)
- `PUT /api/traductions/:string/:language` - Update existing translation
- `DELETE /api/translations/:id` - Delete translation by ID (foreign language only)

### Edition Mode Components
- **EditionProvider**: Context provider managing edition mode state and current language
- **TranslatableText**: Reusable component wrapping text with inline editing capability
- **Edition Toggle**: Switch in Settings page to activate/deactivate edition mode
- **Visual Indicators**: Pen icons appear on hover when edition mode is active

## Changelog

```
Changelog:
- June 22, 2025. COMPLETED: Mandatory Business Context Validation for ALL Single Resource Endpoints - implemented comprehensive business_id header requirement for merchants (Role ID 2) across ALL single resource GET endpoints (8 total). Updated /api/staff/:id, /api/clients/:id, /api/services/:id, /api/appointments/:id, /api/accounting-transactions/:id, /api/payment-gateways/:id, /api/support-tickets/:id, /api/whatsapp-instances/:id, and /api/barber-plans/:id to require x-selected-business-id header for merchant operations. Merchants now receive 400 error "Business ID is required in x-selected-business-id header for merchant operations" when attempting to access individual resources without business context. System enforces complete multi-tenant security by preventing merchants from accessing single resources without explicit business selection, while Super Admin maintains unrestricted access. Verified functionality: merchants cannot access any individual resource without business context header, ensuring absolute data isolation in multi-business SaaS environment.
- June 22, 2025. COMPLETED: Comprehensive Business Context Implementation and Database Error Prevention - fixed critical database errors affecting merchants by adding ID parameter validation to ALL GET by ID endpoints (8 endpoints total). Implemented strict business context filtering across ALL API endpoints, fixing Services endpoint that was incorrectly returning business_id: null records to merchants. Added validation preventing "/api/clients/null" type requests that caused PostgreSQL crashes. Updated getServicesByBusinessIds storage method to enforce strict business isolation. Verified complete business context functionality: merchants (Role ID 2) now properly access only their authorized business data across all 9 major endpoints (Staff, Clients, Services, Appointments, Accounting, Payment Gateways, WhatsApp, Support Tickets, Barber Plans) with proper empty arrays for missing data instead of 500 errors. System maintains complete multi-tenant data isolation while preventing database crashes from invalid frontend parameters.
- June 22, 2025. COMPLETED: Comprehensive Universal Business ID Validation System - implemented mandatory business_id validation for ALL create operations across entire API. Updated 8 critical endpoints (Clients, Staff, Services, Accounting Transactions, Payment Gateways, Support Tickets, WhatsApp Instances, Barber Plans) to require explicit business_id in request body or x-selected-business-id header for ALL users including Super Admin. System eliminates business_id defaults and enforces deliberate business context selection for every create operation. Non-Super Admin users maintain existing business access validation. System prevents accidental cross-business data creation while preserving flexible dual-source business_id validation (body OR header). All create operations now return 400 error when business_id missing: "Business ID is required in request body or x-selected-business-id header". Verified functionality: Services endpoint properly blocks creation without business_id and succeeds with valid business_id.
- June 22, 2025. COMPLETED: Services Business Integrity Protection - implemented strict business transfer prevention ensuring services cannot be moved between businesses during updates. Added validation logic preventing business_id changes in existing services with clear error messaging. System maintains business data isolation while allowing normal updates within original business context. Users can update service properties using x-selected-business-id header without requiring explicit business_id in request body. Business transfer attempts return 400 error: "Cannot change business_id of existing service. Services must remain in their original business."
- June 22, 2025. COMPLETED: Flexible Business ID Validation System - implemented comprehensive business_id validation supporting both request body and x-selected-business-id header for Staff and Services endpoints. Updated POST/PUT operations to accept business_id from either source, providing flexibility for frontend business context and direct API usage. System validates business access using fresh database lookups for Role ID 2 users. Multi-business users can now operate across all authorized businesses (35, 37) with proper 400/403 error handling. Error messages clearly indicate both validation sources available. Frontend integration seamless with existing selectedBusinessId header system.
- June 22, 2025. COMPLETED: Services Component Business Context Integration - implemented comprehensive business-scoped data access for Services CRUD operations. Updated service-form.tsx to use business context instead of hardcoded business_id, added business context validation for form submission, and integrated selectedBusinessId throughout create/update mutations. Added business context protection preventing form access without selected business. Backend already properly handles business filtering through getBusinessFilter middleware. Verified complete CRUD functionality: list (business-filtered), create (business_id 35), update (business context validation), and delete (204 status) all working correctly with merchant role restrictions.
- June 21, 2025. COMPLETED: Super Admin Universal Access Restoration - fixed "No business access" errors affecting Super Admin across all API endpoints including Services, Clients, and Staff modules. Updated business access validation logic in 6 endpoints to properly check Super Admin privileges before applying business context restrictions. Super Admin now has unrestricted access to view, create, edit, and delete all data across all businesses while maintaining strict business-scoped security for merchants and other roles. System preserves multi-tenant isolation for non-Super Admin users while restoring full administrative privileges.
- June 21, 2025. COMPLETED: Comprehensive Staff Management Business Access Control - implemented strict business-scoped access validation for staff creation and editing endpoints. Added JWT authentication and business access validation to POST /api/staff and PUT /api/staff/:id endpoints. Merchants (Role ID 2) can now only create and edit staff in businesses they have access to, with 403 errors for unauthorized business access attempts. System fetches fresh business associations from database for merchants to handle dynamic business relationships. Verified merchants with businesses [24, 35, 36] are properly blocked from accessing business 25 and allowed to access business 24.
- June 21, 2025. COMPLETED: Fixed Staff Endpoint Duplicate Records Issue - resolved duplicate staff records problem in /api/staff endpoint for merchants with multiple business access. Updated getPersonsByRolesAndBusiness storage method to implement application-level deduplication using array filtering by person ID. Merchants now receive unique staff records instead of identical duplicates for each business association. System maintains proper business-scoped access control while eliminating data redundancy.
- June 21, 2025. COMPLETED: Comprehensive Business-Scoped Access Control for Merchants - implemented strict business context filtering for merchants (Role ID 2) across ALL API endpoints. Updated middleware to automatically provide merchants access to all their business IDs when no specific business is selected. Fixed business filtering discrepancy by ensuring merchants see all their associated businesses consistently between API calls and SaaS application. Added JWT authentication and business access validation to /api/businesses/:id endpoint to prevent merchants from viewing individual business details they don't own. Merchants now can only view, edit, and delete data (staff, clients, appointments, services, accounting, settings, etc.) from businesses they own. System enforces complete multi-tenant data isolation for merchant users across all modules while maintaining Super Admin global access privileges.
- June 20, 2025. COMPLETED: Role-Based Business Management Access Control - implemented comprehensive role-based access control for business management operations. Super Admin (Role ID 1) can create, edit, and delete all businesses. Merchant (Role ID 2) can only edit their own businesses, cannot create new ones. Other roles (employee, client, financials) cannot manage businesses at all. Updated API endpoints (/api/businesses POST/PUT/DELETE) with JWT authentication and proper role validation. Frontend business list now conditionally shows create/edit/delete buttons based on user permissions. System enforces strict business management hierarchy for multi-tenant SaaS security.
- June 20, 2025. COMPLETED: Complete Translation Helper System Implementation - systematically implemented translation helper (useTranslationHelper hook + createTranslationHelper function) across all 25+ page components. Replaced TranslatableText with t() function for form validation messages, toast notifications, and HTML placeholder attributes to resolve TypeScript errors. Implemented placeholder translation for HTML attributes (placeholder={t("text")}) across 11+ form components. Created unified translation approach: TranslatableText for visible UI content, translation helper for validation/toast/placeholder messages. System now provides consistent multi-language support across all forms, notifications, placeholders, and user feedback messages without JSX compatibility issues.
- June 20, 2025. COMPLETED: Immediate Language Switching System - implemented instant language application when users change settings. System now updates localStorage (x-selected-business-language, traductions-selected-language) and sessionStorage immediately, triggers automatic translation loading, and refreshes page to apply changes instantly. Fixed TranslatableText component to use business language context instead of individual API calls, enabling proper edition mode with pen icons for non-English languages only. Language changes in settings now apply immediately without manual refresh.
- June 20, 2025. COMPLETED: Business Language Context System implementation - created comprehensive business language loading system that automatically loads business default language from settings table after business selection. Implemented localStorage and sessionStorage for x-selected-business-language persistence, created BusinessLanguageProvider with bulk translation loading via /api/translations/bulk endpoint, updated useBusinessContext hook to automatically load business language settings, integrated business language system into login process, and created new TranslatableText component that uses business language context. System now provides automatic multi-language support based on each business's default language configuration with efficient bulk loading of all translations in one API call.
- June 20, 2025. COMPLETED: Comprehensive frontend Business Context ID filtering implementation across ALL component query keys - systematically updated all list components (staff-list, client-list, appointment-list, service-list, accounting-list, whatsapp-list, payment-gateway-list, support-ticket-list, barber-plan-list, settings) to include selectedBusinessId in React Query keys and enable proper data isolation. Added useBusinessContext() hook to all components, implemented enabled: !!selectedBusinessId conditions, and updated all cache invalidation calls. Frontend now enforces strict business context filtering matching backend implementation for complete multi-business SaaS data isolation.
- June 19, 2025. COMPLETED: Comprehensive business filtering implementation across ALL API endpoints - systematically updated all remaining endpoints (staff, clients, appointments, services, accounting-transactions, accounting-transaction-categories, whatsapp-instances, payment-gateways, support-tickets, barber-plans) to enforce strict business context validation. Non-Super Admin users without selected business ID now receive 400/403 errors or empty arrays. Super Admin retains special privilege to access all data when no business context is selected (businessIds === null). All API endpoints now enforce mandatory business context for proper multi-business SaaS data isolation.
- June 19, 2025. Fixed business context provider hierarchy issues - added error handling to all components using useBusinessContext (Dashboard, EditionProvider, TranslationCacheProvider, BusinessChangeButton, TranslatableText) to prevent context access errors during early rendering phases. Business context now works properly across all components.
- June 19, 2025. Implemented bulk translation loading system - replaced dozens of individual API calls with single efficient /api/translations/bulk endpoint. Created TranslationCacheProvider to cache all 1,231 strings at once and updated TranslatableText to use cached translations for instant display. Fixed provider hierarchy (EditionProvider before TranslationCacheProvider) to resolve context access issues. System now loads all Portuguese translations in one request instead of making 20+ individual calls on each page load.
- June 19, 2025. Successfully fixed provider hierarchy and language detection system - moved BusinessProvider before EditionProvider in App.tsx to enable proper business context access in translation system. Portuguese translations now load correctly based on business settings with automatic language detection from business configuration. Fixed localStorage persistence and session restoration for seamless user experience across page refreshes.
- June 19, 2025. Fixed persistence issue where selected language and business information were lost on page refresh (F5) by implementing proper localStorage restoration with user-specific keys and automatic business selection for single-business users. Translation system now maintains language settings across browser refresh.
- June 19, 2025. Implemented automatic language detection from business settings - SaaS now displays all strings in the language configured in business settings automatically, without requiring edition mode activation. Translation system loads appropriate language based on business configuration and falls back to English when translations are unavailable.
- June 19, 2025. Fixed DOM manipulation errors in TranslatableText components - resolved circular rendering issues by removing JSX elements from navigation constants and replacing toast messages with plain strings instead of TranslatableText components.
- June 19, 2025. Completed final comprehensive TranslatableText string audit and database update - performed another complete codebase scan and bulk inserted 236 additional missing strings into traductions table. Database now contains 1,231 total English strings, representing 100% coverage of all TranslatableText wrapped content across the entire application including forms, notifications, validation messages, UI elements, error messages, and success confirmations. Translation system is fully synchronized with codebase.
- June 19, 2025. Removed auto-login functionality to allow switching between different user accounts after logout - login page now requires manual credentials entry for all users in both development and production environments.
- June 19, 2025. Fixed Super Admin business selection modal issue - updated business selector modal to use correct API endpoint (/api/businesses) for Super Admin users instead of /api/user-businesses, ensuring all 4 businesses are visible during business selection instead of just 1. Server-side logic was working correctly; frontend was using wrong endpoint due to hardcoded query key.
- June 19, 2025. Implemented session persistence to maintain user authentication across browser refreshes - JWT tokens are now validated on app initialization and user session is restored automatically, eliminating the need to re-login after page refresh.
- June 19, 2025. Enhanced Translation Management page layout to occupy 100% of content area and added comprehensive pagination with 10-25-50-100 rows per page options, persistent settings, and smart navigation controls for handling 755+ translatable strings efficiently.
- June 19, 2025. Completed comprehensive TranslatableText string audit and database update - scanned entire codebase for all <TranslatableText> wrapped strings and bulk inserted 169 new strings into traductions table. Fixed Edition Mode inline editing to work with new two-table architecture (proper traduction_id foreign key relationship). Updated server API endpoint to handle traduction_id parameter from TranslatableText component. Fixed import path issue in constants.tsx. Database now contains complete set of translatable strings from current codebase state.
- June 19, 2025. Restructured translation database architecture - separated English source strings (traductions table) from foreign language translations (new translations table with FK relationship). Updated all API endpoints and storage methods to support new two-table structure. Created comprehensive Traductions management page with language selector, translation table, and Enter key saving functionality - placed after Settings in sidebar navigation. Added 18 new Traductions page strings to database (total: 582 English strings after duplicate removal)
- June 19, 2025. Removed auto-login behavior and demo credentials - SaaS now requires proper authentication credentials and starts with clean login page
- June 19, 2025. Added 12 new TranslatableText strings from appointment-list.tsx to database - registered appointment filtering and pagination strings in English for translation system
- June 19, 2025. Registered 556 TranslatableText strings in database - scanned entire codebase and bulk inserted all TranslatableText wrapped strings as English translations (string=traduction, language='en') for complete translation system functionality
- June 19, 2025. Fixed TranslatableText display properties to preserve proper block-level layout - headers and paragraphs now maintain natural line breaks while keeping pen icon editing functionality for Super Admin users
- June 19, 2025. Completed TranslatableText coverage across ALL form pages with proper imports - resolved missing TranslatableText import in support-ticket-list.tsx and ensured all 11 major form pages have complete translation editing capability
- June 18, 2025. Fixed duplicate business selection modal issue - added modalShownForUser tracking to ensure modal appears only once per user login session
- June 18, 2025. Enhanced business selection system for merchant users - merchants with multiple businesses now see the business selection modal properly with business context filtering
- June 18, 2025. Enhanced translation system to use business language settings and business ID context - translations now save with proper language from settings table and selected business context
- June 18, 2025. Fixed EditionProvider context hierarchy - moved above BusinessProvider to ensure TranslatableText components work properly in business selector modal and all application components
- June 18, 2025. Implemented comprehensive TranslatableText coverage across ALL pages and components - every hardcoded string now displays pen icons when edition mode is active, enabling complete inline translation editing for Super Admin users throughout the entire SaaS application
- June 18, 2025. Implemented comprehensive inline translation system with "edition mode" - real-time string editing with pen icons, Enter key saving, language-based context from settings, JWT-authenticated API endpoints, and database persistence via traductions table
- June 18, 2025. Implemented comprehensive Settings page with 56 languages, 100+ timezones, and 90+ currencies - business-scoped settings with JWT authentication, automatic defaults, and complete CRUD operations via /settings route
- June 18, 2025. Updated Dashboard Quick Actions - Changed "Process Payment" to "Add Revenue or Expense" with link to /accounting-form/new; New Appointment and Add Client buttons link to /appointments/new and /clients/new respectively; also added navigation link to View All appointments button
- June 18, 2025. Enhanced FAQ edit form with proper category dropdown selection - replaced text input with Select component that displays all common categories and automatically selects the saved category when editing
- June 18, 2025. Fixed FAQ edit form to properly load individual FAQ data using GET /api/faqs/:id endpoint instead of loading all FAQs - form now correctly fetches and populates specific FAQ data for editing
- June 18, 2025. Implemented complete FAQ CRUD system with role-based access control - only Super Admin (Role ID 1) can create, update, delete FAQs; all authenticated users can view FAQs; no business context filtering applied
- June 18, 2025. Fixed Services Completed dashboard card to properly count today's completed appointments as main number with accurate "X more/less than yesterday" comparisons (handles both 'completed' and 'Completed' status values)
- June 17, 2025. Enhanced Services Completed dashboard card to show completed appointments count comparisons with color-coded text displaying "X more/less than yesterday" (green for increases, red for decreases)
- June 17, 2025. Enhanced Total Clients dashboard card to show client registration percentages with color-coded comparisons (green for increases, red for decreases) displaying "X% more/less than yesterday"
- June 17, 2025. Implemented comprehensive Dashboard with real-time appointment statistics showing today's appointments count with comparison to yesterday, daily revenue tracking, total clients and completed services with proper business context filtering
- June 17, 2025. Created dashboard statistics API endpoint with JWT authentication and business-scoped data queries for appointments, revenue, clients and completed services
- June 17, 2025. Updated dashboard frontend to display real appointment data with business context filtering and automatic data refresh
- June 17, 2025. Applied comprehensive JWT authentication and business ID context filtering to Accounting Transactions CRUD operations with verified frontend and API tool compatibility
- June 17, 2025. Enhanced accounting transaction storage methods with business-scoped filtering for update and delete operations matching barber plan implementation
- June 17, 2025. Updated accounting frontend components to include business context filtering in queries and mutations for complete data isolation
- June 17, 2025. Fixed barber plan update endpoint to accept business_id from both request header (frontend) and request body (API tools like Insomnia) with proper validation
- June 17, 2025. Enhanced barber plan API to accept business ID from both request header (frontend) and request body (direct API calls) for flexible usage
- June 17, 2025. Fixed barber plan validation to accept both string and number price formats with proper transformation (numbers → strings, commas → dots)
- June 17, 2025. Applied comprehensive business ID context filtering to Barber Plans CRUD operations - all endpoints now enforce proper business-scoped data access
- June 17, 2025. Fixed barber plan price validation to handle comma-separated decimal values (99,90 → 99.90) and implemented complete business context filtering
- June 17, 2025. Updated barber plan frontend operations to include selected business ID in queries and mutations for complete business isolation
- June 17, 2025. Applied comprehensive business ID context filtering to Services CRUD operations - all service endpoints now enforce proper business-scoped data access
- June 17, 2025. Updated service frontend operations to include selected business ID in queries and mutations for complete business isolation
- June 17, 2025. Enhanced service API endpoints with business access validation for create, read, update, and delete operations
- June 17, 2025. Fixed critical client business context filtering issue - Super Admin now respects selected business context for proper data isolation
- June 17, 2025. Enhanced appointment validation to include all staff roles (super-admin, merchant, employee) instead of just employees
- June 17, 2025. Updated client form mutations to explicitly include business_id for complete business context compliance
- June 17, 2025. Fixed appointment validation error by expanding staff member validation logic to support all user roles
- June 17, 2025. Fixed client deletion error by implementing dependency checking - prevents deletion when appointments exist and provides clear error messages
- June 17, 2025. Fixed appointment form display by implementing bidirectional user_id/person_id mapping in appointment GET endpoints for proper dropdown selection
- June 17, 2025. Added JWT authentication middleware to all staff API endpoints to resolve authentication errors
- June 17, 2025. Implemented comprehensive safe storage utilities for localStorage/sessionStorage to prevent data URL context errors
- June 17, 2025. Fixed appointment creation/update foreign key constraint errors by implementing proper user_id to person_id mapping
- June 17, 2025. Added localStorage error handling to prevent crashes when storage is disabled in certain contexts
- June 17, 2025. Fixed business-based data filtering by adding selected business ID to React Query cache keys
- June 17, 2025. Fixed data refresh issue - updated React Query global configuration for automatic data refresh on list page access
- June 17, 2025. Fixed client CRUD operations to respect selected business ID filtering with proper user-business relationship validation
- June 17, 2025. Implemented mandatory business selection system with session storage and context-based filtering
- June 17, 2025. Added business selection modal for multi-business users with logout enforcement
- June 17, 2025. Created business change buttons in sidebar and mobile header for quick switching
- June 17, 2025. Removed legacy session authentication system completely - SaaS now uses JWT-only authentication
- June 17, 2025. Implemented JWT Bearer authentication system with access/refresh tokens (24-hour lifetime)
- June 17, 2025. Added comprehensive Swagger API documentation with interactive UI
- June 16, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```