import { db } from "../server/db";
import { clients } from "../shared/schema";
import { sql } from "drizzle-orm";

async function updateClientPlans() {
  try {
    console.log("🔄 Actualizando planes de clientes existentes...");
    
    // Update all existing clients to Starter plan
    const result = await db.execute(sql`
      UPDATE clients 
      SET plan = 'Starter' 
      WHERE plan IN ('Essential', 'Growth', 'Scale', 'Enterprise')
    `);
    
    console.log(`✅ ${(result[0] as any).affectedRows} clientes actualizados al plan Starter`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error actualizando planes:", error);
    process.exit(1);
  }
}

updateClientPlans();
