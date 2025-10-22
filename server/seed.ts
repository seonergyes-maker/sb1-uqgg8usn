import { db } from './db.js';
import { clients } from '../shared/schema.js';

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    const mockClients = [
      {
        name: "María García",
        email: "maria@empresa.com",
        plan: "Growth",
        status: "active",
        contacts: 3420,
        emailsSent: 12500,
      },
      {
        name: "Juan Martínez",
        email: "juan@startup.es",
        plan: "Essential",
        status: "active",
        contacts: 890,
        emailsSent: 3200,
      },
      {
        name: "Ana López",
        email: "ana@business.com",
        plan: "Scale",
        status: "active",
        contacts: 15600,
        emailsSent: 48000,
      },
      {
        name: "Carlos Ruiz",
        email: "carlos@tech.io",
        plan: "Growth",
        status: "trial",
        contacts: 1200,
        emailsSent: 0,
      },
      {
        name: "Laura Sánchez",
        email: "laura@marketing.es",
        plan: "Enterprise",
        status: "active",
        contacts: 45000,
        emailsSent: 120000,
      },
      {
        name: "Pedro Fernández",
        email: "pedro@shop.com",
        plan: "Essential",
        status: "suspended",
        contacts: 450,
        emailsSent: 1800,
      },
    ];

    for (const client of mockClients) {
      await db.insert(clients).values(client);
      console.log(`✅ Cliente creado: ${client.name}`);
    }

    console.log('🎉 Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
