# LandFlow - Landing Page & Email Marketing Platform

## Project Overview
This is a full-stack marketing automation platform migrated from Lovable to Replit. It provides landing page creation, email campaigns, lead management, and analytics features.

## Recent Changes (October 22, 2025)

### Latest Update - Campaigns Module Complete ✅ (User Panel)
- **Integrated Campaigns module with MySQL database** (Third user panel module!)
- Created `campaigns` table with foreign key relationship to `clients`
- Implemented full CRUD API endpoints (`/api/campaigns`)
- Updated user Campaigns page to use real database data via TanStack Query
- All campaign operations work with real data: create, edit, delete, search, filter by status
- Implemented real-time statistics (Total campañas, Enviadas, Total destinatarios, Tasa apertura promedio)
- Campaign tracking metrics (openRate, clickRate, recipientCount)
- Support for campaign statuses (Borrador, Programada, Enviada)
- 4 test campaigns inserted for demo purposes (2 sent, 1 scheduled, 1 draft)
- Form validation with React Hook Form + Zod
- **¡Tres módulos del panel de usuario completamente funcionales con MySQL!**

### Segments Module Complete ✅ (User Panel)
- **Integrated Segments module with MySQL database** (Second user panel module!)
- Created `segments` table with foreign key relationship to `clients`
- Implemented full CRUD API endpoints (`/api/segments`)
- Updated user Segments page to use real database data via TanStack Query
- All segment operations work with real data: create, edit, delete, search
- Implemented real-time statistics (Total segments, Leads segmentados, Promedio por segmento)
- Segment filters system (stored as JSON)
- 4 test segments inserted for demo purposes
- Form validation with React Hook Form + Zod

### Leads Module Complete ✅ (User Panel)
- **Integrated Leads module with MySQL database** (First user panel module!)
- Created `leads` table with foreign key relationship to `clients`
- Implemented full CRUD API endpoints (`/api/leads`)
- Updated user Leads page to use real database data via TanStack Query
- All lead operations work with real data: create, edit, delete, search, filter
- Implemented real-time statistics (Total, Qualified, Converted, Avg Score)
- CSV export functionality
- Status tracking (Nuevo, Calificado, Contactado, Convertido)
- Lead scoring system (0-100 points) with visual progress bars
- 10 test leads inserted for demo purposes
- Form validation with React Hook Form + Zod

### Payments Module Complete ✅
- **Integrated Payments with MySQL database**
- Created `payments` table with foreign keys to `clients` and `subscriptions`
- Implemented full CRUD API endpoints (`/api/payments`)
- Updated admin Payments page to use real database data
- Support for Stripe and PayPal payment methods
- Payment status tracking (pending, completed, failed, refunded)
- Created `.env.example` with Stripe/PayPal configuration for dev and prod
- All payment operations (refund, retry, filter, export) work with real data
- Real-time statistics (Total processed, Completed, Pending, Failed)
- Real-time data updates with TanStack Query

### Dashboard Module Complete ✅
- **Integrated Dashboard with MySQL database**
- Created endpoint `/api/dashboard/stats` for real-time statistics
- Implemented metric calculations (total clients, active subscriptions, monthly revenue)
- Dashboard displays recent clients (last 5) with days since registration
- Fixed routing configuration for `/admin` and `/admin/dashboard` paths
- All dashboard statistics show real data from MySQL database

### Subscriptions Module Complete ✅
- **Integrated Subscriptions with MySQL database**
- Created `subscriptions` table with foreign key relationship to `clients`
- Implemented full CRUD API endpoints (`/api/subscriptions`)
- Updated admin Subscriptions page to use real database data
- All subscription operations (cancel, reactivate, filter, export) now work with real data
- 6 test subscriptions linked to existing clients

### Database Integration Complete ✅
- **Integrated MySQL/MariaDB database** with Drizzle ORM
- Created `clients` and `subscriptions` tables in MySQL
- Implemented full CRUD API endpoints for both modules
- All admin pages use real database data via TanStack Query
- Removed mock data - app now uses authentic MySQL data

### Previous Migration
- Migrated project structure from Lovable to Replit full-stack template
- Moved all frontend files from `src/` to `client/src/`
- Created backend server with Express in `server/` directory
- Converted routing from react-router-dom to wouter
- Set up shared types in `shared/schema.ts`
- Configured full-stack development environment

## Project Structure
```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components (admin & user)
│   │   ├── lib/         # Utility functions & query client
│   │   └── hooks/       # Custom React hooks
│   ├── public/          # Static assets
│   └── index.html       # HTML entry point
├── server/              # Backend Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes (clients CRUD)
│   ├── storage.ts       # Database operations with Drizzle
│   ├── db.ts            # MySQL connection config
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared types/schemas
│   └── schema.ts        # Drizzle schemas & Zod validation
├── drizzle.config.ts    # Drizzle Kit configuration
└── package.json         # Dependencies and scripts
```

## Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter (migrated from react-router-dom)
- **Backend**: Express + TypeScript
- **Database**: MySQL/MariaDB with Drizzle ORM
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Validation**: drizzle-zod for type-safe schemas

## Database

### Configuration
Uses external MySQL/MariaDB database with the following environment variables:
- `DB_HOST` - MySQL server host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

### Schema Management
```bash
npx drizzle-kit push  # Push schema changes to MySQL database
```

### Current Tables
- **clients** - Customer/client management
  - id, name, email, plan, status
  - contacts, emailsSent
  - registeredAt, updatedAt

- **subscriptions** - Subscription management
  - id, clientId (FK to clients), plan, price
  - status, startDate, nextBilling
  - createdAt, updatedAt

- **payments** - Payment tracking and processing
  - id, clientId (FK to clients), subscriptionId (FK to subscriptions)
  - amount, currency, paymentMethod (stripe/paypal)
  - paymentStatus (pending/completed/failed/refunded)
  - transactionId, metadata (JSON)
  - createdAt, updatedAt

- **leads** - Lead/Contact management (User panel)
  - id, clientId (FK to clients), name, email, phone
  - source, status, score
  - createdAt, updatedAt

- **segments** - Segment/Group management (User panel)
  - id, clientId (FK to clients), name, description
  - filters (JSON), leadCount
  - createdAt, updatedAt

- **campaigns** - Email campaign management (User panel)
  - id, clientId (FK to clients), name, subject, content
  - status (Borrador/Programada/Enviada), recipientCount
  - openRate, clickRate (decimal metrics)
  - scheduledAt, sentAt
  - createdAt, updatedAt

## Development
```bash
npm run dev    # Start development server on port 5000
npm run build  # Build for production
npm run start  # Run production build
```

## Admin Panel Features

### ✅ Clientes (Fully Functional)
- View all clients from MySQL database
- Create new clients with form validation
- Update client information
- Delete clients with confirmation
- Suspend/reactivate clients
- Search by name or email
- Filter by plan and status
- Export to CSV
- Real-time data updates with TanStack Query

### ✅ Suscripciones (Fully Functional)
- View all subscriptions from MySQL database
- Linked to clients with foreign key relationship
- Cancel/reactivate subscriptions
- Search by client name or plan
- Filter by plan and status
- Export to CSV
- Real-time statistics (Active, Trial, Canceled)
- Real-time data updates with TanStack Query

### ✅ Dashboard (Fully Functional)
- View real-time platform statistics from MySQL
- Total clients, active subscriptions, monthly revenue
- Recent clients list (last 5 registered)
- All metrics calculated from real database data
- Real-time data updates with TanStack Query

### ✅ Pagos (Fully Functional)
- View all payments from MySQL database
- Linked to clients and subscriptions with foreign key relationships
- Process refunds and retry failed payments
- Search by client name or transaction ID
- Filter by payment method (Stripe, PayPal) and status
- Export to CSV
- Real-time statistics (Total processed, Completed, Pending, Failed)
- Support for invoice generation (UI ready)
- Real-time data updates with TanStack Query

### ✅ Configuración (Fully Functional)
- View and update platform settings from MySQL database
- Company information (name, contact email, phone)
- Email configuration (from name, from email, reply-to email)
- SMTP server configuration for email sending
- Notification preferences (new clients, payments, failed payments, cancellations)
- Integration keys (Stripe, PayPal, Analytics)
- Terms and conditions management
- Real-time data updates with TanStack Query

## User Panel Features

### ✅ Leads (Fully Functional)
- View all leads from MySQL database
- Create new leads with form validation
- Update lead information
- Delete leads with confirmation
- Search by name, email, or phone
- Filter by status and source
- Export to CSV
- Real-time statistics (Total, Qualified, Converted, Average Score)
- Lead status tracking (Nuevo, Calificado, Contactado, Convertido)
- Lead scoring system (0-100 points) with visual indicators
- Real-time data updates with TanStack Query
- **10 test leads available for demo**

### ✅ Segmentos (Fully Functional)
- View all segments from MySQL database
- Create new segments with form validation
- Update segment information
- Delete segments with confirmation
- Search segments by name or description
- Real-time statistics (Total segments, Leads segmentados, Promedio por segmento)
- Filter system stored as JSON
- Real-time data updates with TanStack Query
- **4 test segments available for demo**

### ✅ Campañas (Fully Functional)
- View all campaigns from MySQL database
- Create new campaigns with form validation
- Update campaign information
- Delete campaigns with confirmation
- Search campaigns by name or subject
- Filter by status (Borrador, Programada, Enviada)
- Real-time statistics (Total campañas, Enviadas, Total destinatarios, Tasa apertura promedio)
- Campaign metrics tracking (open rate, click rate, recipient count)
- Status management (Draft, Scheduled, Sent)
- Real-time data updates with TanStack Query
- **4 test campaigns available for demo**

### 🚧 To Be Implemented (User Panel)
- **Landings** - Landing page creation and management
- **Automatizaciones** - Automated email sequences
- **Estadísticas** - Analytics and performance metrics
- **Templates** - Email and landing page templates
- **A/B Testing** - Campaign optimization
- **Scheduler** - Schedule emails and publications
- **Webhooks** - External integrations
- **Integrations** - Third-party service connections
- **User Settings** - User account preferences
- **Profile** - User profile management
- **Billing** - User subscription and payment management

### 🚧 To Be Implemented (Admin Panel)
- **Stripe Integration** - Connect Stripe SDK for real payment processing (keys ready in .env.example)
- **PayPal Integration** - Connect PayPal SDK for real payment processing (keys ready in .env.example)

## Migration Status
✅ **Migration Complete!** The project has been successfully migrated to the Replit full-stack structure on October 22, 2025.

### Completed Tasks
- ✅ Restructured project from Lovable format (src/) to Replit format (client/src/, server/, shared/)
- ✅ Created complete backend infrastructure with Express server
- ✅ Migrated routing from react-router-dom to wouter
- ✅ Updated all components to use wouter's Link component
- ✅ Configured Vite to allow Replit dev hosts
- ✅ Fixed useLocation() usage in UserSidebar and AdminSidebar
- ✅ Corrected tsconfig.app.json paths for proper module resolution
- ✅ Server running successfully on port 5000
- ✅ **Integrated MySQL database** with Drizzle ORM
- ✅ **Admin Clients page fully functional** with real database operations
- ✅ **Admin Subscriptions page fully functional** with real database operations and foreign key relations
- ✅ **Admin Dashboard page fully functional** with real-time statistics from MySQL
- ✅ **Admin Payments page fully functional** with real database operations, Stripe/PayPal support, and transaction tracking
- ✅ **Admin Settings page fully functional** with SMTP configuration and platform settings
- ✅ **User Leads page fully functional** with real database operations
- ✅ **User Segments page fully functional** with real database operations
- ✅ **User Campaigns page fully functional** with real database operations - THREE USER PANEL MODULES COMPLETE!

## User Preferences
- Always use Spanish for communication
- Use MySQL/MariaDB for database (never PostgreSQL unless requested)
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items
