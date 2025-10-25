import mysql from "mysql2/promise";

async function columnExists(connection: any, tableName: string, columnName: string): Promise<boolean> {
  const [rows] = await connection.execute(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [process.env.DB_NAME || "pruebas_email", tableName, columnName]
  );
  return (rows as any[]).length > 0;
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "db4free.net",
    user: process.env.DB_USER || "pruebas_email",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pruebas_email",
    port: 3306,
  });

  console.log("🔄 Aplicando migraciones de schema...");

  try {
    // Add SMTP columns to clients table
    const smtpColumns = [
      { name: "smtp_host", type: "VARCHAR(255)" },
      { name: "smtp_port", type: "INT" },
      { name: "smtp_user", type: "VARCHAR(255)" },
      { name: "smtp_password", type: "VARCHAR(255)" },
      { name: "smtp_encryption", type: "VARCHAR(10) DEFAULT 'tls'" },
      { name: "smtp_auth", type: "VARCHAR(20) DEFAULT 'login'" },
    ];

    for (const col of smtpColumns) {
      const exists = await columnExists(connection, "clients", col.name);
      if (!exists) {
        await connection.execute(`ALTER TABLE clients ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Columna ${col.name} agregada a tabla clients`);
      } else {
        console.log(`⏭️  Columna ${col.name} ya existe en tabla clients`);
      }
    }

    // Add isSystem column to segments table
    const isSystemExists = await columnExists(connection, "segments", "is_system");
    if (!isSystemExists) {
      await connection.execute(`ALTER TABLE segments ADD COLUMN is_system INT DEFAULT 0`);
      console.log("✅ Columna is_system agregada a tabla segments");
    } else {
      console.log("⏭️  Columna is_system ya existe en tabla segments");
    }

    console.log("✅ Todas las migraciones aplicadas exitosamente");
  } catch (error: any) {
    console.error("❌ Error aplicando migraciones:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
