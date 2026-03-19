const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://postgres:Cuent%40personal4785@db.ymjufwwsodbryjoioqxu.supabase.co:5432/postgres';

async function setupAdmin() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado a la bóveda de datos...');

    const email = 'admin@islainvest.com';
    const password = 'admin12345';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar o actualizar admin
    const query = `
      INSERT INTO usuarios (id_usuario, email, password_hash, rol, estado_kyc)
      VALUES (gen_random_uuid(), $1, $2, 'admin', 'verificado')
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = $2, rol = 'admin', estado_kyc = 'verificado';
    `;

    await client.query(query, [email, hashedPassword]);
    console.log('Usuario ADMINISTRADOR creado con éxito.');
    console.log('Email: admin@islainvest.com');
    console.log('Password: admin12345');

  } catch (err) {
    console.error('Error al configurar admin:', err);
  } finally {
    await client.end();
  }
}

setupAdmin();
