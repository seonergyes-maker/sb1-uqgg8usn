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
-   **Automatizaciones Avanzadas con Builder Visual (✅ Completed - Oct 24, 2025):**
    -   ✅ **BACKEND:** Schema simplificado - emails solo plantillas, métricas en automation_executions
    -   ✅ Tabla automation_executions: tracking individual por lead (leadId, automationId, currentStep, status, métricas)
    -   ✅ PATCH /api/automations/:id con validación: permite cambiar solo status, o editar completo si pausada
    -   ✅ GET /api/automations/:id/preview: métricas agregadas (total, active, completed, failed, emailsSent, emailsOpened, openRate, bounceRate, unsubscribeRate)
    -   ✅ **COMPONENT:** AutomationBuilder con selector de triggers y builder de acciones dinámico:
        -   3 triggers: segment_enter (lead entra a segmento), segment_exit (lead sale), segment_belongs (lead pertenece)
        -   Selector de segmento asociado al trigger
        -   Acciones como array JSON: send_email (selector de plantilla) y wait (duración + unidad minutos/horas/días)
        -   UI con cards numeradas, iconos visuales (Mail, Clock), separadores visuales entre pasos
        -   Agregar/eliminar acciones, validación de campos requeridos
    -   ✅ **AUTOMATIONS.TSX:** Integración completa del builder visual:
        -   Diálogos crear/editar usan AutomationBuilder (trigger, triggerSegmentId, actions callbacks)
        -   Serialización correcta: actions como JSON.stringify al enviar, JSON.parse al cargar
        -   Preview Dialog: métricas en grid + flujo visual de acciones con cards
        -   Validación UX: edición solo si pausada (toast error si activa)
        -   toggleStatusMutation separada para evitar corrupción de datos (solo envía campo status)
        -   Formularios simplificados: nombre + descripción + estado, resto desde builder
    -   ✅ **BUG FIX CRÍTICO:** toggleStatusMutation separada de updateMutation para evitar enviar campos vacíos que corromperían registros
    -   ✅ **ARQUITECTO REVIEW:** Sistema completo y funcional, flujos crear/activar/pausar/editar/previsualizar/eliminar validados
    -   📝 **VENTAJAS:** Builder visual intuitivo, validación robusta, métricas en tiempo real, arquitectura limpia separando plantillas de estado
-   **Templates Base System (✅ Completed - Oct 24, 2025):**
    -   ✅ **MIGRACIÓN ARQUITECTÓNICA:** Templates base movidas de BD a archivos estáticos en `/server/templates/`
    -   ✅ Estructura de carpetas: `/server/templates/landings/` y `/server/templates/emails/`
    -   ✅ Sistema de metadata centralizado en `/server/templates/index.ts`
    -   ✅ 3 templates HTML base para sector servicios: consultoria.html, agencia-digital.html, servicios-profesionales.html
    -   ✅ Endpoint GET `/api/templates/base` devuelve lista con metadata (sin content para performance)
    -   ✅ Endpoint GET `/api/templates/base/:id` devuelve template específica con HTML completo
    -   ✅ TemplateSelector actualizado para carga asíncrona de contenido al seleccionar
    -   ✅ POST `/api/landings` usa `loadTemplateContent('consultoria')` como template por defecto
    -   ✅ Corrección ESM: `fileURLToPath(import.meta.url)` para resolver `__dirname` en módulos ES
    -   ✅ Endpoint temporal `/api/seed/base-templates` eliminado
    -   ✅ Archivo `shared/serviceTemplates.ts` eliminado (obsoleto)
    -   ✅ FloatingEditor activa/desactiva `contenteditable` dinámicamente al editar/guardar
    -   ✅ Botón "Cambiar Template" integrado en FloatingEditor
    -   📝 **VENTAJAS:** Templates versionadas con Git, sin duplicación en BD, updates centralizados, ideal para SaaS multi-tenant
-   **Sistema de Captura de Leads (✅ Completed - Oct 23, 2025):**
    -   ✅ Endpoint POST /api/public/leads (sin autenticación) para captura desde landings públicas
    -   ✅ Validación de campos requeridos: clientId, name, email
    -   ✅ Tracking automático de conversiones: actualiza landing.conversions y landing.conversionRate
    -   ✅ Inyección de variables globales en PublicLanding: LANDING_CLIENT_ID y LANDING_SLUG
    -   ✅ 3 templates mobile-first con formularios integrados (Consultoría, Agencia Digital, Servicios Profesionales)
    -   ✅ JavaScript inline para envío de formularios con fetch API
    -   ✅ Mensajes de éxito/error visuales en cada formulario
    -   ✅ Corrección crítica: firma de apiRequest actualizada en FloatingEditor (url, method, data)
-   **Editor In-Place para Landings (✅ Completed):**
    -   ✅ Template HTML predeterminado para landings nuevas (hero, features, CTA, footer)
    -   ✅ Endpoint POST /api/landings usa template por defecto si no se proporciona contenido
    -   ✅ FloatingEditor component: botones flotantes Editar/Guardar/Cancelar/Cambiar Template/Volver al Panel (bottom-right)
    -   ✅ Modo edición: contentEditable activado con outline visual
    -   ✅ Detección automática de propietario en /l/:slug (user.id === landing.clientId)
    -   ✅ Guardar cambios: PATCH /api/landings/:id actualiza contenido HTML
    -   ✅ Redirección a /l/:slug después de crear landing para edición inmediata
    -   ✅ Auto-invalidación de cache y reload al guardar cambios
-   **Landings UI Improvements (✅ Completed - Oct 23, 2025):**
    -   ✅ Estados actualizados: "Activa" y "Borrador" (eliminado "Desactivada")
    -   ✅ Estado por defecto: "Borrador" para todas las landings nuevas
    -   ✅ Badge "New" verde para landings creadas en los últimos 7 días
    -   ✅ Menú dropdown simplificado: solo Toggle Activar/Desactivar (con iconos Eye/EyeOff), Editar y Eliminar
    -   ✅ Botones con `e.stopPropagation()` para evitar conflictos con navegación de cards
    -   ✅ Filtro de estado actualizado a "Activa/Borrador"
-   **Pricing & Plans (✅ Completed):**
    -   ✅ 4 planes escalados: Starter (gratuito), Essential (€15), Professional (€49), Business (€99)
    -   ✅ Plan Starter: 1k contactos, 3k emails/mes, 2 landings, 1 automatización
    -   ✅ Plan Essential: 2.5k contactos, 10k emails/mes, 5 landings, 3 automatizaciones
    -   ✅ Plan Professional: 10k contactos, 50k emails/mes, landings ilimitadas, 10 automatizaciones, A/B Testing
    -   ✅ Plan Business: 25k contactos, 150k emails/mes, todo ilimitado, API completa
    -   ✅ Página de precios actualizada con ventajas competitivas vs Mailchimp/Brevo
    -   ✅ Registro asigna plan Starter por defecto
    -   ✅ 5 clientes existentes migrados a plan Starter
-   **Multi-Tenant Data Isolation (✅ CRITICAL FIX - Oct 23, 2025):**
    -   ✅ **SEGURIDAD:** Reemplazado `clientId = 1` hardcodeado por `user.id` dinámico del AuthContext
    -   ✅ Todos los módulos del panel actualizados: Landings, Leads, Segments, Automations, Templates
    -   ✅ Cada usuario ahora solo ve/edita su propio contenido (aislamiento total de datos)
    -   ✅ Formularios de creación incluyen automáticamente el clientId del usuario autenticado
    -   ✅ Patrón implementado: `const { user } = useAuth(); const clientId = user?.id || 0;`
-   **Architecture Changes:**
    -   🗑️ Campaigns module eliminated (replaced by Scheduler + Amazon SES architecture)
    -   📅 Scheduler schema created for scheduled email campaigns
    -   📧 Multi-tenant SES architecture defined (sender identities, configuration sets, event tracking)
-   **Next Steps:** Formulario captura de leads en landings públicas, Activar automatizaciones al capturar leads, Completar templates base, A/B Testing, Scheduler implementation, Sistema de límites por plan

## External Dependencies
-   **Database:** MySQL/MariaDB (external instance configured via environment variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
-   **Payment Gateways:** Stripe, PayPal (integration keys for both are anticipated and mentioned in `.env.example`).
-   **Email Services:** SMTP server for sending emails (configuration managed via Admin Settings).