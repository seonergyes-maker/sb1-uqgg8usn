# LandFlow - Landing Page & Email Marketing Platform

## Overview
LandFlow is a full-stack marketing automation platform designed to help businesses automate and optimize their marketing efforts. It provides tools for creating landing pages, managing email campaigns, handling leads, and analyzing marketing performance. The platform aims to be a comprehensive solution for lead management, segmentation, email campaign creation, and marketing automation, all supported by a robust database for real-time data and analytics.

## User Preferences
- Always use Spanish for communication
- Use MySQL/MariaDB for database (never PostgreSQL unless requested)
- Keep `.local/state/replit/agent/progress_tracker.md` updated with [x] markers for completed items

## System Architecture
The project follows a full-stack architecture with a `client/` for the frontend, a `server/` for the backend, and a `shared/` directory for common types and schemas.

**Frontend:**
-   Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
-   Uses `wouter` for routing, `TanStack Query` for state management, and `React Hook Form` with `Zod` for form validation.

**Backend:**
-   Developed using Express and TypeScript.
-   Interacts with a MySQL/MariaDB database via `Drizzle ORM`.
-   Exposes RESTful API endpoints for all data operations.

**UI/UX and Features:**
-   **Admin Panel:** Includes CRUD operations for Clients, Subscriptions, and Payments. Features a Dashboard for real-time statistics and a Settings module for platform configuration.
-   **User Panel:** Offers CRUD operations and management for Leads, Segments, Automations, Templates (email and landing), and Landings. Includes a Scheduler for task management.
-   **System Design Choices:** Employs a database-driven approach, real-time data updates via `TanStack Query`, robust form validation, and a modular design.
-   **Authentication:** JWT-based authentication with `bcryptjs` for password hashing, supporting user and admin roles with protected routes.
-   **Multi-Tenancy:** Critical data isolation ensures each user only accesses and manages their own content by linking data to the authenticated user's ID.
-   **Visual Editors:** Features in-place visual editors for Landing Pages and Email Templates, supporting dynamic variables and requiring specific elements like unsubscribe links for emails.
-   **Lead Capture System:** Public endpoint for capturing leads from landing pages, automatically tracking conversions.
-   **Pricing & Plans:** Implements a tiered pricing structure (Starter, Essential, Professional, Business) with varying feature limits.

## External Dependencies
-   **Database:** MySQL/MariaDB (configured via environment variables).
-   **Payment Gateways:** Stripe, PayPal (integration keys are anticipated).
-   **Email Services:** Generic SMTP server for email sending (configured via Admin Settings).