const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runAnalyticsMigration() {
  try {
    const sqlPath = path.join(__dirname, 'schema_analytics.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log("Migrando Base de Datos de Analíticas...");
    await pool.query(sql);
    console.log("¡Tablas de Analíticas de Rendimiento creadas con éxito!");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando la migración:", err);
    process.exit(1);
  }
}

runAnalyticsMigration();
