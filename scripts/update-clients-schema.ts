import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function updateClientsTable() {
  try {
    console.log("🔄 Actualizando esquema de tabla clients...");
    
    // Check if columns already exist
    const checkColumns = await db.execute(sql`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'clients' 
      AND COLUMN_NAME IN ('password', 'role', 'is_active')
    `);
    
    const existingColumns = (checkColumns[0] as any[]).map((row: any) => row.COLUMN_NAME);
    
    // Add password column if it doesn't exist
    if (!existingColumns.includes('password')) {
      console.log("➕ Agregando columna 'password'...");
      await db.execute(sql`
        ALTER TABLE clients 
        ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'changeme123'
      `);
    } else {
      console.log("✓ Columna 'password' ya existe");
    }
    
    // Add role column if it doesn't exist
    if (!existingColumns.includes('role')) {
      console.log("➕ Agregando columna 'role'...");
      await db.execute(sql`
        ALTER TABLE clients 
        ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'
      `);
    } else {
      console.log("✓ Columna 'role' ya existe");
    }
    
    // Add is_active column if it doesn't exist
    if (!existingColumns.includes('is_active')) {
      console.log("➕ Agregando columna 'is_active'...");
      await db.execute(sql`
        ALTER TABLE clients 
        ADD COLUMN is_active INT NOT NULL DEFAULT 1
      `);
    } else {
      console.log("✓ Columna 'is_active' ya existe");
    }
    
    console.log("✅ Esquema actualizado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error actualizando esquema:", error);
    process.exit(1);
  }
}

updateClientsTable();
