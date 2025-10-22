import { db } from "./db.js";
import { clients, subscriptions } from "../shared/schema.js";

async function seedSubscriptions() {
  try {
    // Get existing clients
    const existingClients = await db.select().from(clients);
    
    if (existingClients.length === 0) {
      console.log("No clients found. Please create clients first.");
      return;
    }

    console.log(`Found ${existingClients.length} clients`);

    // Create subscriptions for existing clients
    const subscriptionsData = [
      {
        clientId: existingClients[0].id,
        plan: "Growth",
        price: "99.00",
        status: "active",
        startDate: "2024-01-15",
        nextBilling: "2024-04-15",
      },
      {
        clientId: existingClients[1].id,
        plan: "Essential",
        price: "49.00",
        status: "active",
        startDate: "2024-02-03",
        nextBilling: "2024-05-03",
      },
      {
        clientId: existingClients[2].id,
        plan: "Scale",
        price: "199.00",
        status: "active",
        startDate: "2023-11-20",
        nextBilling: "2024-04-20",
      },
      {
        clientId: existingClients[3].id,
        plan: "Growth",
        price: "99.00",
        status: "trial",
        startDate: "2024-03-10",
        nextBilling: "2024-03-24",
      },
      {
        clientId: existingClients[4].id,
        plan: "Enterprise",
        price: "399.00",
        status: "active",
        startDate: "2023-08-12",
        nextBilling: "2024-04-12",
      },
      {
        clientId: existingClients[5].id,
        plan: "Essential",
        price: "49.00",
        status: "canceled",
        startDate: "2024-01-28",
        nextBilling: null,
      },
    ];

    for (const sub of subscriptionsData) {
      await db.insert(subscriptions).values(sub);
      console.log(`Created subscription for client ${sub.clientId}`);
    }

    console.log("✅ Subscriptions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding subscriptions:", error);
    process.exit(1);
  }
}

seedSubscriptions();
