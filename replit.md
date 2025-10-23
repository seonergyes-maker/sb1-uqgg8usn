# LandFlow - Landing Page & Email Marketing Platform

## Overview
LandFlow is a full-stack marketing automation platform that enables users to create landing pages, manage email campaigns, handle leads, and analyze marketing performance. It aims to provide a comprehensive solution for businesses to automate and optimize their marketing efforts. The platform offers capabilities such as lead management, segmentation, email campaign creation, and marketing automation, all integrated with a robust database backend for real-time data management and analytics.

## User Preferences
- Always use Spanish for communication
- Use MySQL/MariaDB for database (never PostgreSQL unless requested)
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items

## System Architecture
The project is structured into a `client/` for the frontend, a `server/` for the backend, and a `shared/` directory for common types and schemas.

**Frontend:**
-   Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
-   Uses `wouter` for routing.
-   State management is handled by `TanStack Query`.
-   Forms are managed with `React Hook Form` and `Zod` for validation.

**Backend:**
-   Developed using Express and TypeScript.
-   Connects to a MySQL/MariaDB database via `Drizzle ORM`.
-   Provides RESTful API endpoints for all data operations.

**UI/UX and Features:**
-   **Admin Panel:**
    -   **Clients:** CRUD operations, search, filter, export, suspend/reactivate.
    -   **Subscriptions:** CRUD operations, linked to clients, search, filter, cancel/reactivate, real-time statistics.
    -   **Dashboard:** Real-time platform statistics (clients, subscriptions, revenue), recent clients list.
    -   **Payments:** CRUD operations, linked to clients/subscriptions, refund/retry, search, filter, real-time statistics, supports Stripe/PayPal.
    -   **Settings:** Manage company info, email configuration, SMTP, notification preferences, integration keys.
-   **User Panel:**
    -   **Leads:** CRUD operations, search, filter, CSV export, status tracking, lead scoring, real-time statistics.
    -   **Segments:** CRUD operations, search, real-time statistics, JSON-based filter system.
    -   **Automations:** CRUD operations, search, filter by status, real-time statistics, metrics tracking, multiple trigger support.
    -   **Templates:** CRUD operations for email and landing templates, dynamic variables system, type/category filtering.
    -   **Landings:** CRUD operations, metrics tracking (views, conversions), status management.
    -   **Scheduler:** Task scheduling system for email campaigns via Amazon SES (replaces old Campaigns module).

**System Design Choices:**
-   Full-stack architecture with a clear separation of concerns between client and server.
-   Database-driven approach for all dynamic content and user data, eliminating mock data.
-   Real-time data updates across the application leveraging `TanStack Query`.
-   Robust form validation using `React Hook Form` and `Zod`.
-   Modular design for both frontend components and backend API routes.

## Recent Progress
-   **Authentication System (✅ Completed):**
    -   ✅ JWT-based authentication with bcryptjs for password hashing
    -   ✅ Schema clients actualizado: campos password, role, isActive
    -   ✅ Rutas de autenticación: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
    -   ✅ Admin login via environment secrets (ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET)
    -   ✅ User registration and login funcionales
    -   ✅ AuthContext y ProtectedRoute para manejo de estado y rutas protegidas
    -   ✅ /panel/* requiere autenticación (role: user)
    -   ✅ /admin/* requiere autenticación (role: admin)
    -   ✅ Páginas Login y Register conectadas a API real
-   **User Panel Modules Completed (6/11 modules):**
    -   ✅ Leads: CRUD completo, 10 leads de prueba, estadísticas en tiempo real (30% calificados, 20% convertidos)
    -   ✅ Segmentos: 4 segmentos de prueba, 14 leads segmentados, filtros JSON
    -   ✅ Automatizaciones: 5 automatizaciones con sistema de triggers, 1,380 ejecuciones, 25.22% tasa éxito
    -   ✅ Estadísticas: Dashboard con métricas agregadas de todos los módulos
    -   ✅ Landings: 5 landing pages con tracking, 9,670 visitas totales, 1,623 conversiones, 15.91% tasa promedio
    -   ✅ Templates: 8 plantillas (5 email, 3 landing), 14,064 usos totales, sistema de variables dinámicas
-   **Templates Base System:**
    -   ✅ Sistema de templates base implementado (clientId = 0 para identificar templates base)
    -   ✅ TemplateSelector component con grid visual, filtros y búsqueda
    -   ✅ Endpoint GET /api/templates/base para templates base
    -   ✅ Ruta pública /l/:slug para visualizar landings sin autenticación
    -   ✅ Tracking automático de visitas en landings públicas
    -   ✅ 2 templates base creados: Email Bienvenida Moderna, Landing Producto Moderno
    -   📝 Pendiente: Insertar 10 templates base adicionales (4 email + 6 landing) en BD
    -   📝 Pendiente: Integrar selector en formularios de Automatizaciones
    -   📝 Pendiente: Editor visual con preview side-by-side
-   **Architecture Changes:**
    -   🗑️ Campaigns module eliminated (replaced by Scheduler + Amazon SES architecture)
    -   📅 Scheduler schema created for scheduled email campaigns
    -   📧 Multi-tenant SES architecture defined (sender identities, configuration sets, event tracking)
-   **Next Steps:** Formulario captura de leads en landings públicas, Activar automatizaciones al capturar leads, Completar templates base, A/B Testing, Scheduler implementation

## External Dependencies
-   **Database:** MySQL/MariaDB (external instance configured via environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
-   **Payment Gateways:** Stripe, PayPal (integration keys for both are anticipated and mentioned in `.env.example`).
-   **Email Services:** SMTP server for sending emails (configuration managed via Admin Settings).