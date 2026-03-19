const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres:Cuent%40personal4785@db.ymjufwwsodbryjoioqxu.supabase.co:5432/postgres';

async function migrate() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado a la bóveda de datos para migración...');

    const query = `
      CREATE TABLE IF NOT EXISTS autenticadores (
          id_credencial BYTEA PRIMARY KEY,
          id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
          clave_publica BYTEA NOT NULL,
          conteo_signo INT DEFAULT 0,
          transporte JSONB,
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(query);
    console.log('Tabla "autenticadores" creada con éxito.');

  } catch (err) {
    console.error('Error en migración:', err);
  } finally {
    await client.end();
  }
}

migrate();
