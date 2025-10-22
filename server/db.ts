import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../shared/schema.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const poolConnection = mysql.createPool(connectionString);

export const db = drizzle(poolConnection, { schema, mode: 'default' });
