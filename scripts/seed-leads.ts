import { db } from "../server/db.js";
import { leads } from "../shared/schema.js";

async function seed() {
  console.log("Insertando leads de prueba...");

  const testLeads = [
    {
      clientId: 1,
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+34 612 345 678",
      source: "Landing Black Friday",
      status: "Nuevo",
      score: 85,
    },
    {
      clientId: 1,
      name: "Juan Martínez",
      email: "juan.martinez@empresa.com",
      phone: "+34 623 456 789",
      source: "Campaña email",
      status: "Calificado",
      score: 92,
    },
    {
      clientId: 1,
      name: "Ana López",
      email: "ana.lopez@startup.es",
      phone: "+34 634 567 890",
      source: "Formulario contacto",
      status: "Contactado",
      score: 78,
    },
    {
      clientId: 1,
      name: "Carlos Ruiz",
      email: "carlos.ruiz@tech.io",
      phone: "+34 645 678 901",
      source: "Landing webinar",
      status: "Nuevo",
      score: 68,
    },
    {
      clientId: 1,
      name: "Laura Fernández",
      email: "laura.f@marketing.es",
      phone: "+34 656 789 012",
      source: "Campaña email",
      status: "Convertido",
      score: 95,
    },
    {
      clientId: 1,
      name: "Pedro Sánchez",
      email: "pedro.s@innovacion.com",
      phone: "+34 667 890 123",
      source: "Landing producto",
      status: "Calificado",
      score: 88,
    },
    {
      clientId: 1,
      name: "Carmen Jiménez",
      email: "carmen.j@consultora.es",
      phone: "+34 678 901 234",
      source: "Referido",
      status: "Nuevo",
      score: 72,
    },
    {
      clientId: 1,
      name: "Roberto Díaz",
      email: "roberto.diaz@startup.io",
      phone: "+34 689 012 345",
      source: "Webinar gratuito",
      status: "Contactado",
      score: 81,
    },
    {
      clientId: 1,
      name: "Isabel Torres",
      email: "isabel.torres@agency.com",
      phone: "+34 690 123 456",
      source: "Landing descuento",
      status: "Convertido",
      score: 96,
    },
    {
      clientId: 1,
      name: "Miguel Ángel Ruiz",
      email: "miguel@digital.es",
      phone: "+34 601 234 567",
      source: "Campaña email",
      status: "Calificado",
      score: 90,
    },
  ];

  for (const lead of testLeads) {
    await db.insert(leads).values(lead);
  }

  console.log(`✓ ${testLeads.length} leads insertados correctamente`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error al insertar datos:", error);
  process.exit(1);
});
