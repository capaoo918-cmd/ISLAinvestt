require('dotenv').config();
const pool = require('./db');

async function updateSchemaAndData() {
  try {
    console.log("Iniciando actualización de esquema...");

    await pool.query(`
      ALTER TABLE proyectos 
      ADD COLUMN IF NOT EXISTS metraje INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS habitaciones INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS banos INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS salas INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS patio BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS piscina BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS amenidades TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS fotos TEXT[] DEFAULT '{}';
    `);

    console.log("Esquema actualizado. Poblando datos técnicos...");

    const allAmenidades = ["Gimnasio", "Seguridad 24/7", "Gazebo", "Área Infantil", "Cámaras de Vigilancia", "Parqueo Techado", "Ascensor", "Planta Eléctrica Full", "Pozo de Agua", "Lobby de Lujo"];

    const res = await pool.query("SELECT id_proyecto, titulo FROM proyectos");
    
    for (const row of res.rows) {
      let m2 = 120 + Math.floor(Math.random() * 200);
      let hab = 2 + Math.floor(Math.random() * 3);
      let ban = 2 + Math.floor(Math.random() * 2);
      let sale = 1 + Math.floor(Math.random() * 2);
      let patio = Math.random() > 0.5;
      let piscina = Math.random() > 0.3;
      
      const ams = allAmenidades.sort(() => 0.5 - Math.random()).slice(0, 5);

      await pool.query(`
        UPDATE proyectos 
        SET metraje = $1, habitaciones = $2, banos = $3, salas = $4, patio = $5, piscina = $6, amenidades = $7
        WHERE id_proyecto = $8
      `, [m2, hab, ban, sale, patio, piscina, ams, row.id_proyecto]);
      
      console.log(`Actualizado: ${row.titulo}`);
    }

    process.exit(0);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateSchemaAndData();
