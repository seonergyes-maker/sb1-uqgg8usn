# LandFlow - Landing Page & Email Marketing Platform

## Project Overview
This is a full-stack marketing automation platform migrated from Lovable to Replit. It provides landing page creation, email campaigns, lead management, and analytics features.

## Recent Changes (October 22, 2025)

### Latest Update - Database Integration ✅
- **Integrated MySQL/MariaDB database** with Drizzle ORM
- Created `clients` table schema in MySQL
- Implemented full CRUD API endpoints for clients (`/api/clients`)
- Updated admin Clients page to use real database data via TanStack Query
- All client operations (create, update, delete, suspend, filter, export) now persist to database
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

### 🚧 To Be Implemented
- **Suscripciones** - Connect to database
- **Pagos** - Connect to database  
- **Dashboard** - Connect to real statistics
- **Configuración** - System settings

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

## User Preferences
- Always use Spanish for communication
- Use MySQL/MariaDB for database (never PostgreSQL unless requested)
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items
