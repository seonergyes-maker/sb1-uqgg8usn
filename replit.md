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
-   **User Profile:** Complete profile management for users to update personal information (name, email, company, phone, location, avatar), change password securely with current password validation, and view account details.
-   **User Settings:** Comprehensive configuration panel for each user including email settings (fromName, fromEmail, replyTo, signature), notification preferences, tracking integration (Google Analytics, Meta Pixel), and custom domain setup (Business plan only).
-   **Billing & Subscriptions:** Full subscription management system with PayPal recurring payments integration:
    -   View current subscription plan and next billing date
    -   Real-time usage tracking with visual progress bars (contacts, emails, automations, landing pages)
    -   Payment history with localized formatting
    -   Change plan flow with 4 tiers (Starter: $9.99, Essential: $29.99, Professional: $79.99, Business: $199.99)
    -   Cancel subscription with confirmation dialog
    -   Automatic monthly email counter reset via PayPal webhook
-   **Plan Limits Enforcement:** Robust limit validation system protecting platform resources:
    -   Plan limits stored in `plan_limits` table with 4 tiers
    -   Usage tracking in `usage_tracking` table (emailsSent counter resets monthly)
    -   Middleware (server/middleware/limits.ts) validates capacity before resource creation
    -   Protected endpoints: POST /api/leads, POST /api/automations, POST /api/landings, POST /api/emails/:id/send
    -   Real-time usage calculation (contacts, automations, landings from actual counts; emails from monthly counter)
    -   Business plan offers unlimited resources (-1 limit value)
-   **System Design Choices:** Employs a database-driven approach, real-time data updates via `TanStack Query`, robust form validation, and a modular design.
-   **Authentication:** JWT-based authentication with `bcryptjs` for password hashing, supporting user and admin roles with protected routes.
-   **Multi-Tenancy:** Critical data isolation ensures each user only accesses and manages their own content by linking data to the authenticated user's ID.
-   **Visual Editors:** Features in-place visual editors for Landing Pages and Email Templates, supporting dynamic variables and requiring specific elements like unsubscribe links for emails.
-   **Lead Capture System:** Public endpoint for capturing leads from landing pages, automatically tracking conversions.
-   **Pricing & Plans:** Implements a tiered pricing structure (Starter, Essential, Professional, Business) with varying feature limits:
    -   Starter ($9.99/mo): 500 contacts, 1,000 emails/mo, 5 automations, 3 landing pages
    -   Essential ($29.99/mo): 2,000 contacts, 5,000 emails/mo, 15 automations, 10 landing pages
    -   Professional ($79.99/mo): 10,000 contacts, 25,000 emails/mo, 50 automations, 25 landing pages
    -   Business ($199.99/mo): Unlimited contacts/emails/automations/landing pages + custom domains
-   **Custom Domains:** Business plan users can configure custom domains for their landing pages via X-Forwarded-Host header detection.
-   **Tracking Integration:** Automatic injection of Google Analytics and Meta Pixel scripts in public landing pages when configured by the user.

## External Dependencies
-   **Database:** MySQL/MariaDB (configured via environment variables).
-   **Payment Gateways:** Stripe, PayPal (integration keys are anticipated).
-   **Email Services:** Generic SMTP server for email sending (configured via Admin Settings).