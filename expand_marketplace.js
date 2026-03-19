require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/db');

async function expandMarketplace() {
  try {
    // 1. Obtener un creador
    const creatorRes = await pool.query("SELECT id_usuario FROM usuarios WHERE rol = 'creador' LIMIT 1");
    if (creatorRes.rows.length === 0) {
      console.error("No se encontró ningún creador en la base de datos.");
      process.exit(1);
    }
    const id_creador = creatorRes.rows[0].id_usuario;

    // 2. Definir 5 nuevas propiedades
    const nuevasPropiedades = [
      {
        titulo: "Villa Amanecer - Cap Cana",
        meta: 850000,
        estado: "activo",
        escrow: "escrow_v1_amanecer"
      },
      {
        titulo: "Condos Marina Garden - Punta Cana",
        meta: 420000,
        estado: "activo",
        escrow: "escrow_v1_marina"
      },
      {
        titulo: "Eco-Lodge Samaná Heights",
        meta: 650000,
        estado: "activo",
        escrow: "escrow_v1_samana_eco"
      },
      {
        titulo: "Penthouses Blue Horizon - Cabarete",
        meta: 980000,
        estado: "activo",
        escrow: "escrow_v1_blue"
      },
      {
        titulo: "Golf Residences - Casa de Campo",
        meta: 1200000,
        estado: "activo",
        escrow: "escrow_v1_golf"
      }
    ];

    // 3. Insertar
    for (const prop of nuevasPropiedades) {
      await pool.query(
        "INSERT INTO proyectos (id_creador, titulo, meta_financiera, estado_proyecto, cuenta_escrow_id) VALUES ($1, $2, $3, $4, $5)",
        [id_creador, prop.titulo, prop.meta, prop.estado, prop.escrow]
      );
      console.log(`Insertada: ${prop.titulo}`);
    }

    console.log("Expansión completada con éxito.");
    process.exit(0);

  } catch (err) {
    console.error("Error expandiendo marketplace:", err);
    process.exit(1);
  }
}

expandMarketplace();
