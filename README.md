# LandFlow

**LandFlow** es una plataforma completa para la creación de landing pages optimizadas y automatización de email marketing. Diseñada para empresas que buscan escalar sus campañas de forma predecible y profesional.

## 🚀 Características Principales

✅ **Landings Profesionales** - Crea páginas optimizadas para conversión  
✅ **Automatización Completa** - Embudos automatizados en piloto automático  
✅ **Email Marketing Ilimitado** - Campañas y secuencias sin límites de embudos  
✅ **Analytics Avanzado** - Métricas de leads, conversiones y rendimiento  
✅ **Segmentación Inteligente** - Control total de tus contactos  
✅ **Escalabilidad** - Ideal para crecer de forma predecible

## 📋 Estructura del Proyecto

### **Landing Page Pública**
- **Home** (`/`) - Página principal con Hero, características y CTA
- **Precios** (`/precios`) - 4 planes: Essential, Growth, Scale, Enterprise
- **Nosotros** (`/nosotros`) - Información sobre la empresa
- **Contacto** (`/contacto`) - Formulario de contacto y soporte
- **Login** (`/login`) - Página de inicio de sesión
- **Registro** (`/registro`) - Página de registro de usuarios

### **Panel de Administración** (`/admin`)
Sin autenticación (por ahora)

Páginas implementadas:
- **Dashboard** - Vista general con métricas clave
- **Clientes** - Gestión de clientes registrados
- **Suscripciones** - Administración de planes activos
- **Pagos** - Historial de transacciones
- **Configuración** - Ajustes generales del sistema

### **Panel de Usuario** (`/panel`)
Sin autenticación (por ahora)

Páginas implementadas:
- **Dashboard** - Vista general del usuario
- **Leads** - Gestión de contactos capturados
  - **Segmentos** - Segmentación avanzada de leads
- **Landings** - Creación y gestión de landing pages
  - **Landing Editor** - Editor visual de páginas
- **Campañas** - Email marketing y secuencias
  - **Email Editor** - Editor visual de emails
  - **Scheduler** - Programación de envíos
- **Automatizaciones** - Workflows automatizados
- **Estadísticas** - Métricas y rendimiento
  - **Analytics Avanzado** - Análisis detallado
  - **A/B Testing** - Pruebas de optimización
- **Configuración** - Ajustes de la cuenta
- **Perfil** - Información personal del usuario
- **Facturación** - Pagos y plan actual
- **Plantillas** - Biblioteca de templates
- **Integraciones** - Conexiones externas
- **Webhooks** - Gestión de eventos

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **State**: TanStack Query

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño moderno basado en:
- **Colores HSL** - Tokens semánticos para consistencia
- **Gradientes** - Efectos visuales sutiles y elegantes
- **Animaciones** - Transiciones suaves (fade-in, scale-in, float, glow)
- **Componentes UI** - shadcn/ui completamente personalizado

Todos los colores y estilos están centralizados en:
- `src/index.css` - Variables CSS y tokens de diseño
- `tailwind.config.ts` - Configuración de Tailwind

## 📦 Planes y Precios

| Plan | Contactos | Emails/mes | Precio |
|------|-----------|------------|--------|
| **Essential** | 1.000 | 5.000 | 49 €/mes |
| **Growth** | 5.000 | 20.000 | 99 €/mes |
| **Scale** | 20.000 | 60.000 | 199 €/mes |
| **Enterprise** | +20.000 | +60.000 | Desde 399 €/mes |

**Emails adicionales:**
- 1,5 € por cada 1.000 emails extra
- Bloques opcionales: +5.000 (15€), +20.000 (50€), +50.000 (100€)

## 🚀 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📝 Changelog

### Prompt 1 - Landing Page Inicial
**Fecha**: Primera implementación

**Implementado:**
- ✅ Sistema de diseño moderno (colores HSL, gradientes, animaciones)
- ✅ Componente Button con variantes `hero` y `cta`
- ✅ Navbar responsive con navegación y botones Login/Registro
- ✅ Footer con enlaces y detalles de empresa
- ✅ Página Home con secciones:
  - Hero (título, descripción, CTAs)
  - Features (6 características clave)
  - How It Works (4 pasos)
  - CTA Section
- ✅ Página Precios (4 planes detallados)
- ✅ Página Nosotros (historia, misión, valores)
- ✅ Página Contacto (formulario y opciones)
- ✅ Páginas Login y Registro
- ✅ Página NotFound mejorada
- ✅ Actualización de metadatos SEO

**Archivos creados:**
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/home/*` (Hero, Features, HowItWorks, CTASection)
- `src/pages/Home.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`

**Archivos modificados:**
- `src/index.css`
- `tailwind.config.ts`
- `src/components/ui/button.tsx`
- `src/App.tsx`
- `index.html`

### Prompt 2 - Panel de Administración
**Fecha**: Segunda implementación

**Implementado:**
- ✅ Panel de admin completo sin autenticación
- ✅ AdminSidebar con navegación colapsable
- ✅ AdminLayout con header y área de contenido
- ✅ Páginas de administración:
  - Dashboard con métricas clave
  - Clientes con tabla de gestión
  - Suscripciones con estado de planes
  - Pagos con historial de transacciones
  - Configuración del sistema
- ✅ Icono de acceso rápido en Navbar

**Archivos creados:**
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/pages/admin/Dashboard.tsx`
- `src/pages/admin/Clients.tsx`
- `src/pages/admin/Subscriptions.tsx`
- `src/pages/admin/Payments.tsx`
- `src/pages/admin/Settings.tsx`

**Archivos modificados:**
- `src/App.tsx` (rutas admin)
- `src/components/Navbar.tsx` (enlace admin)

### Prompt 3 - Panel de Usuario
**Fecha**: Tercera implementación

**Implementado:**
- ✅ Panel de usuario completo sin autenticación
- ✅ UserSidebar con navegación colapsable y submenús
- ✅ UserLayout con header, notificaciones y área de contenido
- ✅ Páginas de usuario:
  - Dashboard con métricas personales
  - Leads con gestión de contactos
  - Segmentos (subpágina de Leads)
  - Landings para crear páginas
  - Campañas de email marketing
  - Automatizaciones de workflows
  - Estadísticas con gráficos
  - Configuración de cuenta
  - Perfil de usuario
  - Facturación y pagos
- ✅ Logo LandFlow con gradiente en sidebar
- ✅ Enlace de acceso rápido en Navbar

**Archivos creados:**
- `src/components/user/UserSidebar.tsx`
- `src/components/user/UserLayout.tsx`
- `src/pages/user/UserDashboard.tsx`
- `src/pages/user/Leads.tsx`
- `src/pages/user/Segments.tsx`
- `src/pages/user/Landings.tsx`
- `src/pages/user/Campaigns.tsx`
- `src/pages/user/Automations.tsx`
- `src/pages/user/Statistics.tsx`
- `src/pages/user/UserSettings.tsx`
- `src/pages/user/Profile.tsx`
- `src/pages/user/Billing.tsx`

**Archivos modificados:**
- `src/App.tsx` (rutas usuario)
- `src/components/Navbar.tsx` (enlace panel usuario)

### Prompt 4 - Documentación y README
**Fecha**: Cuarta implementación

**Implementado:**
- ✅ README.md completo con documentación del proyecto
- ✅ Changelog detallado de todas las implementaciones
- ✅ Estructura y tecnologías documentadas
- ✅ Guías de instalación y desarrollo

**Archivos creados:**
- `README.md` (este archivo)

### Prompt 5 - Revisión y Completado de Páginas
**Fecha**: Quinta implementación

**Estado:**
- ✅ Todas las páginas ya están creadas y con contenido estructural completo
- ✅ Las 6 páginas públicas están completamente diseñadas (Home, Precios, Nosotros, Contacto, Login, Registro)
- ✅ Las 5 páginas de administración tienen contenido completo (Dashboard, Clientes, Suscripciones, Pagos, Configuración)
- ✅ Las 10 páginas de usuario están completamente estructuradas:
  - Dashboard con métricas y gráficos
  - Leads con tabla de gestión y filtros
  - Segmentos con análisis de audiencia
  - Landings con cards visuales y estadísticas
  - Campañas con tabla detallada de emails
  - Automatizaciones con flujos y métricas
  - Estadísticas con múltiples gráficos
  - Configuración con emails, notificaciones, dominio e integraciones
  - Perfil con gestión de datos personales y seguridad
  - Facturación con plan actual y métodos de pago

**Nota:** Todas las páginas tienen diseño completo, componentes UI funcionales y datos de ejemplo. 
Solo falta implementar la funcionalidad backend (autenticación, base de datos, APIs, etc.)

### Prompt 6 - Expansión Panel Usuario
**Fecha**: Sexta implementación

**Implementado:**
- ✅ ThemeToggle (modo oscuro/claro)
- ✅ OnboardingWizard (tutorial inicial)
- ✅ Templates (galería de plantillas)
- ✅ EmailEditor (editor visual de emails)
- ✅ LandingEditor (editor visual de landings)
- ✅ ABTesting (pruebas A/B)
- ✅ Scheduler (programación de campañas)
- ✅ Webhooks (gestión de eventos)
- ✅ Integrations (conexiones externas)
- ✅ AdvancedAnalytics (análisis avanzado)

**Archivos creados:**
- `src/components/ThemeToggle.tsx`
- `src/components/OnboardingWizard.tsx`
- `src/pages/user/Templates.tsx`
- `src/pages/user/EmailEditor.tsx`
- `src/pages/user/LandingEditor.tsx`
- `src/pages/user/ABTesting.tsx`
- `src/pages/user/Scheduler.tsx`
- `src/pages/user/Webhooks.tsx`
- `src/pages/user/Integrations.tsx`
- `src/pages/user/AdvancedAnalytics.tsx`

**Archivos modificados:**
- `src/App.tsx` (nuevas rutas)
- `src/components/user/UserLayout.tsx` (ThemeToggle)

### Prompt 7 - Funcionalidad Admin
**Fecha**: Séptima implementación

**Implementado:**
- ✅ Búsqueda funcional en tablas admin
- ✅ Filtros avanzados con diálogos
- ✅ Acciones de botones (editar, eliminar, exportar)
- ✅ Confirmaciones con AlertDialog
- ✅ Toasts de notificación
- ✅ Export de datos a CSV

**Archivos modificados:**
- `src/pages/admin/Clients.tsx`
- `src/pages/admin/Subscriptions.tsx`
- `src/pages/admin/Payments.tsx`
- `README.md`

---

## 📌 Estado Actual

**✅ Completado:**
- ✅ Landing page completa y responsive con todas las secciones
- ✅ Panel de administración con 5 páginas funcionales
- ✅ Panel de usuario con 10 páginas completamente diseñadas
- ✅ Sistema de diseño consistente con tokens HSL
- ✅ Navegación y rutas configuradas
- ✅ Sidebar colapsable en ambos paneles
- ✅ Componentes UI completos de shadcn/ui
- ✅ Datos de ejemplo en todas las páginas
- ✅ Diseño responsive en toda la aplicación

**🔄 Pendiente (Funcionalidad):**
- Autenticación y autorización (login/registro real)
- Integración con backend (Lovable Cloud / Supabase)
- Funcionalidad real en formularios
- Conexión a base de datos
- Sistema de pagos (Stripe)
- Envío real de emails
- Generador de landing pages dinámico
- Editor de campañas con plantillas
- Constructor visual de automatizaciones
- Upload de imágenes
- Gestión real de archivos
- APIs de integración (Google Analytics, Facebook Pixel, Zapier)

## 📞 Soporte

Para más información, visita [lovable.dev](https://lovable.dev/projects/e360fdc0-c04b-4d1a-8d70-8c0b1f270c9c)

---

**Última actualización**: Prompt 5 - Revisión completa del proyecto (todas las páginas con contenido estructural completo)
