import { db } from "../server/db.js";
import { landings } from "../shared/schema.js";

const landingPagesData = [
  {
    clientId: 1,
    name: "Black Friday 2025",
    slug: "black-friday-2025",
    title: "Mega Ofertas Black Friday - Hasta 70% de Descuento",
    description: "Aprovecha las mejores ofertas del año. Descuentos de hasta 70% en todos nuestros productos durante Black Friday.",
    content: JSON.stringify({
      hero: {
        title: "Black Friday 2025",
        subtitle: "Hasta 70% de descuento",
        cta: "Ver Ofertas",
      },
      features: [
        { title: "Envío Gratis", description: "En todos los pedidos" },
        { title: "Devoluciones", description: "30 días garantizados" },
        { title: "Soporte 24/7", description: "Estamos para ayudarte" },
      ],
    }),
    status: "Publicada",
    publishedAt: new Date("2024-11-15"),
    views: 3547,
    conversions: 486,
    conversionRate: "13.70",
  },
  {
    clientId: 1,
    name: "Webinar Marketing Digital",
    slug: "webinar-marketing-digital",
    title: "Webinar Gratuito: Estrategias de Marketing Digital 2025",
    description: "Aprende las mejores estrategias de marketing digital para 2025. Webinar gratuito con expertos de la industria.",
    content: JSON.stringify({
      hero: {
        title: "Webinar Gratuito",
        subtitle: "Marketing Digital 2025",
        cta: "Regístrate Ahora",
      },
      benefits: [
        "Aprende de expertos",
        "Certificado de asistencia",
        "Material descargable",
        "Q&A en vivo",
      ],
    }),
    status: "Publicada",
    publishedAt: new Date("2024-10-20"),
    views: 1892,
    conversions: 245,
    conversionRate: "12.95",
  },
  {
    clientId: 1,
    name: "Ebook Gratis: Email Marketing",
    slug: "ebook-email-marketing",
    title: "Descarga Gratis: Guía Completa de Email Marketing",
    description: "Guía completa de email marketing con estrategias probadas para aumentar tus conversiones. Descarga gratis.",
    content: JSON.stringify({
      hero: {
        title: "Ebook Gratis",
        subtitle: "Guía Completa de Email Marketing",
        cta: "Descargar Ahora",
      },
      contents: [
        "Fundamentos del Email Marketing",
        "Segmentación Avanzada",
        "Automatización de Campañas",
        "Métricas y Optimización",
      ],
    }),
    status: "Publicada",
    publishedAt: new Date("2024-09-10"),
    views: 4231,
    conversions: 892,
    conversionRate: "21.08",
  },
  {
    clientId: 1,
    name: "Lanzamiento Producto Nuevo",
    slug: "lanzamiento-producto-2025",
    title: "Descubre Nuestro Nuevo Producto Revolucionario",
    description: "El producto que esperabas ya está aquí. Descubre todas las características y beneficios de nuestra nueva línea.",
    content: JSON.stringify({
      hero: {
        title: "Nuevo Lanzamiento",
        subtitle: "Innovación que Transforma",
        cta: "Comprar Ahora",
      },
      features: [
        { title: "Tecnología Avanzada", description: "Lo último en innovación" },
        { title: "Diseño Premium", description: "Elegante y funcional" },
        { title: "Garantía Extendida", description: "2 años incluidos" },
      ],
    }),
    status: "Programada",
    views: 0,
    conversions: 0,
    conversionRate: "0.00",
  },
  {
    clientId: 1,
    name: "Consultoría Gratuita",
    slug: "consultoria-gratuita",
    title: "Consultoría Gratuita de 30 Minutos con Nuestros Expertos",
    description: "Agenda una consultoría gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos de negocio.",
    content: JSON.stringify({
      hero: {
        title: "Consultoría Gratuita",
        subtitle: "30 Minutos con Expertos",
        cta: "Agendar Ahora",
      },
      benefits: [
        "Análisis personalizado",
        "Recomendaciones específicas",
        "Plan de acción claro",
        "Sin compromiso",
      ],
    }),
    status: "Borrador",
    views: 0,
    conversions: 0,
    conversionRate: "0.00",
  },
];

async function seedLandings() {
  try {
    console.log("🌱 Seeding landings...");

    // Insert landings
    for (const landing of landingPagesData) {
      await db.insert(landings).values(landing);
      console.log(`✅ Created landing: ${landing.name}`);
    }

    console.log("✨ Landings seeded successfully!");
    console.log(`📊 Total landings created: ${landingPagesData.length}`);
    console.log(`📈 Total views: ${landingPagesData.reduce((sum, l) => sum + l.views, 0)}`);
    console.log(`🎯 Total conversions: ${landingPagesData.reduce((sum, l) => sum + l.conversions, 0)}`);
    
    const publishedLandings = landingPagesData.filter(l => l.status === "Publicada");
    const avgConversion = publishedLandings.reduce((sum, l) => sum + parseFloat(l.conversionRate), 0) / publishedLandings.length;
    console.log(`💹 Conversion rate average: ${avgConversion.toFixed(2)}%`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding landings:", error);
    process.exit(1);
  }
}

seedLandings();
