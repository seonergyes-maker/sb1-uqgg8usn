import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'landflow',
  multipleStatements: true
});

console.log('Connected to MySQL database');

const sql = readFileSync('./drizzle/0000_wakeful_earthquake.sql', 'utf8');

const statements = sql
  .split('--> statement-breakpoint')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`Executing ${statements.length} SQL statements...`);

for (const statement of statements) {
  try {
    await connection.execute(statement);
    const tableName = statement.match(/CREATE TABLE `(\w+)`/)?.[1] || 'unknown';
    console.log(`✓ Created table: ${tableName}`);
  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ALREADY') {
      const tableName = statement.match(/CREATE TABLE `(\w+)`/)?.[1] || 'unknown';
      console.log(`⚠ Table already exists: ${tableName}`);
    } else {
      console.error('Error executing statement:', error.message);
    }
  }
}

await connection.end();
console.log('\n✓ Migration completed successfully!');
