import { db } from "../server/db.js";
import { campaigns } from "../shared/schema.js";

async function seedCampaigns() {
  console.log("🌱 Insertando campañas de prueba...");

  const testCampaigns = [
    {
      clientId: 1,
      name: "Bienvenida nuevos leads",
      subject: "¡Bienvenido a LandFlow! 🚀",
      content: "Hola {{nombre}},\n\nGracias por unirte a LandFlow. Estamos emocionados de tenerte con nosotros.\n\nEn esta plataforma podrás crear landing pages profesionales, gestionar tus leads y lanzar campañas de email marketing efectivas.\n\n¡Comencemos!",
      status: "Enviada",
      recipientCount: 2458,
      openRate: "32.80",
      clickRate: "9.97",
      sentAt: new Date("2024-02-15"),
    },
    {
      clientId: 1,
      name: "Newsletter Marzo",
      subject: "Las mejores prácticas de email marketing",
      content: "Hola,\n\nEste mes queremos compartir contigo las mejores prácticas para tus campañas de email:\n\n1. Personaliza tus mensajes\n2. Segmenta tu audiencia\n3. Prueba diferentes horarios\n4. Optimiza para móvil\n\n¿Quieres saber más? Lee nuestro blog completo.",
      status: "Enviada",
      recipientCount: 2180,
      openRate: "32.80",
      clickRate: "9.08",
      sentAt: new Date("2024-03-10"),
    },
    {
      clientId: 1,
      name: "Webinar próximo jueves",
      subject: "Te esperamos en nuestro webinar gratuito",
      content: "¡Hola!\n\nEste jueves tenemos un webinar especial sobre cómo optimizar tus landing pages para conversión.\n\nFecha: 28 de Marzo\nHora: 16:00 GMT\n\nReserva tu plaza ahora, los cupos son limitados.",
      status: "Programada",
      recipientCount: 1500,
      openRate: "0.00",
      clickRate: "0.00",
      scheduledAt: new Date("2024-03-28"),
    },
    {
      clientId: 1,
      name: "Oferta especial - 30% OFF",
      subject: "Solo hoy: 30% de descuento en todos los planes",
      content: "¡Oferta exclusiva!\n\nPor tiempo limitado, obtén un 30% de descuento en cualquier plan de LandFlow.\n\nUsa el código: LANDFLOW30\n\nVálido hasta las 23:59 de hoy.",
      status: "Borrador",
      recipientCount: 0,
      openRate: "0.00",
      clickRate: "0.00",
    },
  ];

  try {
    for (const campaign of testCampaigns) {
      await db.insert(campaigns).values(campaign);
      console.log(`✅ Campaña creada: ${campaign.name} (${campaign.status})`);
    }

    console.log("\n✨ Campañas de prueba insertadas exitosamente!");
    console.log(`Total: ${testCampaigns.length} campañas`);
    
  } catch (error) {
    console.error("❌ Error insertando campañas:", error);
    throw error;
  }
  
  process.exit(0);
}

seedCampaigns();
