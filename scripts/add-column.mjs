import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

try {
  console.log('Adding is_base_template column to templates table...');
  await connection.query('ALTER TABLE templates ADD COLUMN is_base_template TINYINT(1) NOT NULL DEFAULT 0');
  console.log('✅ Column added successfully!');
} catch (error) {
  if (error.code === 'ER_DUP_FIELDNAME') {
    console.log('✅ Column already exists');
  } else {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  }
} finally {
  await connection.end();
}
