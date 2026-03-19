const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, '..', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log("Creando tablas en Supabase...");
    await pool.query(sql);
    console.log("¡Migración completada con éxito! Tablas listas.");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando la migración:", err);
    process.exit(1);
  }
}

runMigration();
