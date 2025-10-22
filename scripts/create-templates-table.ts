import { db } from "../server/db.js";

async function createTemplatesTable() {
  console.log("📋 Creando tabla templates...");

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subject VARCHAR(500),
        content TEXT NOT NULL,
        variables TEXT,
        thumbnail VARCHAR(500),
        status VARCHAR(50) NOT NULL DEFAULT 'Activa',
        times_used INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log("✅ Tabla templates creada exitosamente!");
  } catch (error) {
    console.error("❌ Error al crear tabla templates:", error);
    throw error;
  }

  process.exit(0);
}

createTemplatesTable();
