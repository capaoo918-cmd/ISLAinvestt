require('dotenv').config();
const pool = require('./db');

async function associateImages() {
  try {
    console.log("Asociando imágenes a proyectos...");

    const sets = {
      "Villa Amanecer - Cap Cana": [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", // Fallback if local not found or similar
        "/villa_amanecer_entrance_1773878316388.png",
        "/villa_amanecer_living_1773878332968.png",
        "/villa_amanecer_bedroom_1773878346590.png",
        "/villa_amanecer_kitchen_1773878360604.png",
        "/villa_amanecer_bathroom_1773878374799.png"
      ],
      "Condos Marina Garden - Punta Cana": [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
        "/marina_garden_entrance_1773878400218.png",
        "/marina_garden_living_1773878412863.png",
        "/marina_garden_bedroom_1773878424757.png",
        "/marina_garden_kitchen_1773878469501.png",
        "/marina_garden_bathroom_1773878482756.png"
      ],
      "Eco-Lodge Samaná Heights": [
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
        "/samana_eco_entrance_1773878437568.png",
        "/samana_eco_living_1773878449987.png",
        "/samana_eco_bedroom_1773878496164.png",
        "/samana_eco_kitchen_bathroom_set_1773878509269.png"
      ],
      "Penthouses Blue Horizon - Cabarete": [
        "https://images.unsplash.com/photo-1515263487990-61b07816b324",
        "/blue_horizon_penthouses_exterior_1773878522014.png",
        "/blue_horizon_living_1773878540214.png",
        "/blue_horizon_bedroom_1773878554507.png"
      ],
      "Golf Residences - Casa de Campo": [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
      ],
      "Las Terrenas Group Hub": [
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607"
      ],
      "Península de Samaná": [
        "https://images.unsplash.com/photo-1472224371017-08207f84aaae"
      ],
      "Torre Arpel 01": [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
      ]
    };

    for (const [titulo, fotos] of Object.entries(sets)) {
      await pool.query("UPDATE proyectos SET fotos = $1 WHERE titulo = $2", [fotos, titulo]);
      console.log(`Fotos actualizadas para: ${titulo}`);
    }

    console.log("Proceso completado.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

associateImages();
