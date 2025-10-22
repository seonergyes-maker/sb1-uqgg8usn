import { db } from "../server/db.js";
import { segments } from "../shared/schema.js";

async function seedSegments() {
  console.log("🌱 Insertando segmentos de prueba...");

  const testSegments = [
    {
      clientId: 1,
      name: "Leads de Alta Calidad",
      description: "Leads con score superior a 80 puntos",
      filters: JSON.stringify({ score: { min: 80 } }),
      leadCount: 3, // Tenemos 3 leads con score >= 80 (María 85, Juan 92, Laura 95)
    },
    {
      clientId: 1,
      name: "Leads Calificados",
      description: "Leads con estado Calificado o Convertido",
      filters: JSON.stringify({ status: ["Calificado", "Convertido"] }),
      leadCount: 5, // 3 Calificados + 2 Convertidos
    },
    {
      clientId: 1,
      name: "Leads de Email Marketing",
      description: "Leads que llegaron vía campaña de email",
      filters: JSON.stringify({ source: "Campaña email" }),
      leadCount: 3, // Juan, Laura, Miguel
    },
    {
      clientId: 1,
      name: "Leads Nuevos",
      description: "Leads con estado Nuevo sin contactar",
      filters: JSON.stringify({ status: "Nuevo" }),
      leadCount: 3, // María, Carlos, Carmen
    },
  ];

  try {
    for (const segment of testSegments) {
      await db.insert(segments).values(segment);
      console.log(`✅ Segmento creado: ${segment.name} (${segment.leadCount} leads)`);
    }

    console.log("\n✨ Segmentos de prueba insertados exitosamente!");
    console.log(`Total: ${testSegments.length} segmentos`);
    
  } catch (error) {
    console.error("❌ Error insertando segmentos:", error);
    throw error;
  }
  
  process.exit(0);
}

seedSegments();
