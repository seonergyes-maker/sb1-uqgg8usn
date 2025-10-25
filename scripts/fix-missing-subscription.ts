import mysql from "mysql2/promise";

async function fixMissingSubscription() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "db4free.net",
    user: process.env.DB_USER || "pruebas_email",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pruebas_email",
    port: 3306,
  });

  console.log("🔄 Creando suscripción Free para usuario existente...");

  try {
    // Get user with id=2 (or all users without subscription)
    const [users]: any = await connection.execute(
      `SELECT id, email, name FROM clients WHERE role = 'user'`
    );

    for (const user of users) {
      // Check if user already has a subscription
      const [existingSubscriptions]: any = await connection.execute(
        `SELECT id FROM subscriptions WHERE client_id = ?`,
        [user.id]
      );

      if (existingSubscriptions.length === 0) {
        // Create Free subscription
        const startDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await connection.execute(
          `INSERT INTO subscriptions (client_id, plan, status, start_date, end_date, paypal_subscription_id, paypal_plan_id, billing_cycle_anchor, last_billing_date, created_at, updated_at)
           VALUES (?, 'Free', 'active', ?, NULL, NULL, NULL, NULL, NULL, NOW(), NOW())`,
          [user.id, startDate]
        );
        console.log(`✅ Suscripción Free creada para usuario: ${user.email} (ID: ${user.id})`);
      } else {
        console.log(`⏭️  Usuario ${user.email} (ID: ${user.id}) ya tiene suscripción`);
      }
    }

    console.log("✅ Proceso completado exitosamente");
  } catch (error: any) {
    console.error("❌ Error creando suscripciones:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

fixMissingSubscription()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
