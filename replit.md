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
    -   **Campaigns:** CRUD operations, search, filter by status, real-time statistics, metrics tracking.
    -   **Automations:** CRUD operations, search, filter by status, real-time statistics, metrics tracking, multiple trigger support.

**System Design Choices:**
-   Full-stack architecture with a clear separation of concerns between client and server.
-   Database-driven approach for all dynamic content and user data, eliminating mock data.
-   Real-time data updates across the application leveraging `TanStack Query`.
-   Robust form validation using `React Hook Form` and `Zod`.
-   Modular design for both frontend components and backend API routes.

## External Dependencies
-   **Database:** MySQL/MariaDB (external instance configured via environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
-   **Payment Gateways:** Stripe, PayPal (integration keys for both are anticipated and mentioned in `.env.example`).
-   **Email Services:** SMTP server for sending emails (configuration managed via Admin Settings).