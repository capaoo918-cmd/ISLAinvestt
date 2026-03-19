const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a la base de datos PostgreSQL (ej. Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test de conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a PostgreSQL exitosamente');
  }
});

module.exports = pool;
