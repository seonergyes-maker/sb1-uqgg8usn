# LandFlow - Landing Page & Email Marketing Platform

## Project Overview
This is a full-stack marketing automation platform migrated from Lovable to Replit. It provides landing page creation, email campaigns, lead management, and analytics features.

## Recent Changes (October 22, 2025)

### Latest Update - Dashboard Module Complete ✅
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

### 🚧 To Be Implemented
- **Pagos** - Connect to database and implement payment tracking
- **Configuración** - System settings and configuration management

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

## User Preferences
- Always use Spanish for communication
- Use MySQL/MariaDB for database (never PostgreSQL unless requested)
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items
