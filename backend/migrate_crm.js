const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runCrmMigration() {
  try {
    const sqlPath = path.join(__dirname, 'schema_crm.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log("Migrando Base de Datos de Ventas CRM...");
    await pool.query(sql);
    console.log("¡Tabla de Leads CRM creadas con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando la migración:", err);
    process.exit(1);
  }
}

runCrmMigration();
