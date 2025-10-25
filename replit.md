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
    -   Plan limits stored in `plan_limits` table with 5 tiers (Free, Starter, Essential, Professional, Business)
    -   Usage tracking in `usage_tracking` table (emailsSent counter resets monthly, initialized automatically on user registration)
    -   Middleware (server/middleware/limits.ts) validates capacity before resource creation
    -   Protected endpoints: POST /api/leads, POST /api/automations, POST /api/landings, POST /api/emails/:id/send
    -   Real-time usage calculation (contacts, automations, landings from actual counts; emails from monthly counter)
    -   Business plan offers unlimited resources (-1 limit value)
    -   New users automatically start with Free plan upon registration
-   **System Design Choices:** Employs a database-driven approach, real-time data updates via `TanStack Query`, robust form validation, and a modular design.
-   **Authentication:** JWT-based authentication with `bcryptjs` for password hashing, supporting user and admin roles with protected routes.
-   **Multi-Tenancy:** Critical data isolation ensures each user only accesses and manages their own content by linking data to the authenticated user's ID.
-   **Visual Editors:** Features in-place visual editors for Landing Pages and Email Templates, supporting dynamic variables and requiring specific elements like unsubscribe links for emails.
-   **Lead Capture System:** Public endpoint for capturing leads from landing pages, automatically tracking conversions.
-   **Pricing & Plans:** Implements a tiered pricing structure with 5 plans (Free, Starter, Essential, Professional, Business):
    -   Free ($0/mo): 100 contacts, 300 emails/mo, 1 automation, 1 landing page - **Assigned automatically on registration**
    -   Starter ($9.99/mo): 500 contacts, 1,500 emails/mo, 3 automations, 3 landing pages
    -   Essential ($29.99/mo): 2,500 contacts, 7,500 emails/mo, 10 automations, 10 landing pages
    -   Professional ($79.99/mo): 10,000 contacts, 25,000 emails/mo, 25 automations, 25 landing pages
    -   Business ($199.99/mo): Unlimited contacts/emails/automations/landing pages + custom domains + priority support
-   **Custom Domains:** Business plan users can configure custom domains for their landing pages via X-Forwarded-Host header detection.
-   **Tracking Integration:** Automatic injection of Google Analytics and Meta Pixel scripts in public landing pages when configured by the user.
-   **Email Automation System (✅ IMPLEMENTED):**
    -   **Real SMTP Email Sending:** Uses `nodemailer` to send real emails via SMTP configured by admin (server/services/emailService.ts)
    -   **SMTP Connection Testing:** Admin panel includes "Probar conexión" button to validate SMTP settings before saving (POST /api/settings/test-smtp)
    -   **Automatic Triggers:** Automatizations execute automatically when new leads are captured from landing pages
    -   **Scheduled Emails:** Support for delayed emails (days) via scheduling system that runs every 60 seconds
    -   **Variable Personalization:** Emails include dynamic variables ({{nombre}}, {{empresa}}, {{unsubscribe_link}})
    -   **Bulk Sending:** Can send to multiple recipients with individual error handling and reporting
    -   **Email Creation:** Frontend allows creating emails with name/subject only, content auto-filled with default template
-   **Segment-Landing Integration (✅ IMPLEMENTED):**
    -   **Auto-Segment Creation:** When a landing page is created, a segment with the same name is automatically created and associated
    -   **Database Relation:** Added `segmentId` field to `landings` table to link landings with their auto-created segments
    -   **Delete Protection:** Segments cannot be deleted if they have associated landing pages (validation in DELETE /api/segments/:id)
    -   **Automatic Association:** Segment filters are automatically configured to track leads from the landing page's slug

## Recent Changes (October 2025)
-   **Added SMTP connection testing:** New endpoint POST /api/settings/test-smtp validates SMTP connection before saving, admin panel includes "Probar conexión" button
-   **Implemented segment-landing integration:**
    -   Added `segmentId` field to `landings` table in schema (shared/schema.ts)
    -   Modified POST /api/landings to automatically create segment with same name when landing is created
    -   Added `getLandingsBySegmentId()` method to storage interface
    -   Modified DELETE /api/segments/:id to prevent deletion if landing pages are associated
    -   Segment filters automatically configured with landing page slug for lead tracking
-   **Fixed email creation bug:** Made `content` field optional in `insertEmailSchema` to allow backend to provide default template
-   **Added error handling:** Email creation form now shows error toast if mutation fails
-   **Implemented real email sending:** Replaced simulated email sending with actual SMTP delivery using nodemailer
-   **Created email service:** New `server/services/emailService.ts` handles SMTP configuration, sending, and personalization
-   **Created automation service:** New `server/services/automationService.ts` triggers automations on new leads and handles scheduled sends
-   **Integrated automation triggers:** Public lead capture endpoint now automatically triggers active automations with "new_lead" trigger
-   **Scheduled task processor:** Background job runs every 60 seconds to execute pending scheduled email tasks

## External Dependencies
-   **Database:** MySQL/MariaDB (configured via environment variables).
-   **Payment Gateways:** Stripe, PayPal (integration keys are anticipated).
-   **Email Services:** Custom SMTP server (configured via Admin Settings) using `nodemailer` library for real email delivery.