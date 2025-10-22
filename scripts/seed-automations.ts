import { db } from "../server/db.js";
import { automations } from "../shared/schema.js";

async function seedAutomations() {
  console.log("🌱 Insertando automatizaciones de prueba...");

  const testAutomations = [
    {
      clientId: 1,
      name: "Bienvenida nuevos leads",
      description: "Serie de 5 emails para nuevos suscriptores durante los primeros 30 días",
      trigger: "new_lead",
      conditions: JSON.stringify({ leadSource: "formulario_web" }),
      actions: JSON.stringify({ 
        emails: [
          { delay: 0, subject: "Bienvenido a LandFlow" },
          { delay: 3, subject: "Cómo empezar con tu primera landing" },
          { delay: 7, subject: "Tips para mejorar tus conversiones" },
          { delay: 14, subject: "Casos de éxito de nuestros clientes" },
          { delay: 30, subject: "Actualización de funcionalidades" }
        ]
      }),
      status: "Activa",
      executionCount: 245,
      successRate: "35.10",
    },
    {
      clientId: 1,
      name: "Re-engagement inactivos",
      description: "Recupera leads sin actividad durante 30 días",
      trigger: "inactivity",
      conditions: JSON.stringify({ daysInactive: 30, leadStatus: "cualificado" }),
      actions: JSON.stringify({ 
        emails: [
          { delay: 0, subject: "Te echamos de menos" },
          { delay: 7, subject: "Oferta especial para ti" }
        ]
      }),
      status: "Activa",
      executionCount: 892,
      successRate: "20.00",
    },
    {
      clientId: 1,
      name: "Nurturing por score alto",
      description: "Secuencia para leads con puntuación mayor a 70",
      trigger: "lead_score_change",
      conditions: JSON.stringify({ minScore: 70 }),
      actions: JSON.stringify({ 
        emails: [
          { delay: 0, subject: "Contenido exclusivo para ti" },
          { delay: 2, subject: "Invitación a demo personalizada" }
        ],
        notifications: ["Notificar al equipo de ventas"]
      }),
      status: "Activa",
      executionCount: 156,
      successRate: "42.30",
    },
    {
      clientId: 1,
      name: "Post-webinar follow-up",
      description: "Seguimiento automático después de asistir a un webinar",
      trigger: "form_submit",
      conditions: JSON.stringify({ formType: "webinar_registration" }),
      actions: JSON.stringify({ 
        emails: [
          { delay: 1, subject: "Gracias por asistir a nuestro webinar" },
          { delay: 3, subject: "Grabación y materiales del webinar" }
        ]
      }),
      status: "Pausada",
      executionCount: 87,
      successRate: "28.70",
    },
    {
      clientId: 1,
      name: "Recuperación carrito abandonado",
      description: "Recordatorio para completar el proceso de compra",
      trigger: "campaign_click",
      conditions: JSON.stringify({ campaignType: "ecommerce", action: "cart_abandoned" }),
      actions: JSON.stringify({ 
        emails: [
          { delay: 1, subject: "Olvidaste algo en tu carrito" },
          { delay: 24, subject: "Tu carrito te espera + 10% descuento" },
          { delay: 72, subject: "Última oportunidad - carrito por expirar" }
        ]
      }),
      status: "Inactiva",
      executionCount: 0,
      successRate: "0.00",
    },
  ];

  try {
    for (const automation of testAutomations) {
      await db.insert(automations).values(automation);
      console.log(`✅ Automatización creada: ${automation.name} (${automation.status})`);
    }

    console.log("\n✨ Automatizaciones de prueba insertadas exitosamente!");
    console.log(`Total: ${testAutomations.length} automatizaciones`);
    console.log(`Activas: ${testAutomations.filter(a => a.status === "Activa").length}`);
    console.log(`Pausadas: ${testAutomations.filter(a => a.status === "Pausada").length}`);
    console.log(`Inactivas: ${testAutomations.filter(a => a.status === "Inactiva").length}`);
    
  } catch (error) {
    console.error("❌ Error insertando automatizaciones:", error);
    throw error;
  }
  
  process.exit(0);
}

seedAutomations();
