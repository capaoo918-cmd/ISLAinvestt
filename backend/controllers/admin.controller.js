const pool = require('../db');

// Obtener la información del Radar de Ventas (CRM Leads + Alfred status)
exports.getLeadsCRM = async (req, res) => {
    try {
        const query = await pool.query(
            `SELECT id_lead, nombre_contacto, email, telefono_whatsapp, tipo_lead, etapa_ventas,
             ultima_interaccion_en, historial_chat 
             FROM crm_leads 
             ORDER BY ultima_interaccion_en DESC`
        );
        res.status(200).json({ leads: query.rows });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Error del servidor consultando el CRM' });
    }
};

// Obtener Métricas de Uso de la Plataforma y lo más buscado
exports.getPlatformUsage = async (req, res) => {
    try {
        // En un mundo ideal esto vendría del pool real:
        // const busquedas = await pool.query(`SELECT termino_busqueda, contador FROM analytics_busquedas ORDER BY contador DESC LIMIT 5`);
        
        // MOCK DATA DE ALTO VALOR para la presentación del MVP (Se reemplazaría con BD real conforme haya tráfico)
        const busquedasFake = [
            { termino_busqueda: "Alta Rentabilidad Punta Cana", contador: 1420 },
            { termino_busqueda: "Propiedades Ley CONFOTUR", contador: 1250 },
            { termino_busqueda: "Villas Cap Cana frente al mar", contador: 890 },
            { termino_busqueda: "Airbnb friendly", contador: 850 },
            { termino_busqueda: "Fraccional desde $10k", contador: 620 }
        ];

        // MOCK ENGAGEMENT
        const engagement = {
            usuarios_activos_mensuales: 4500,
            tiempo_promedio_sesion: "4m 20s",
            tasa_retencion: "68%",
            bounce_rate: "24%"
        };

        res.status(200).json({ top_searches: busquedasFake, engagment: engagement });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Error del servidor consultando métricas' });
    }
};

// Obtener Data Completa de Cada Propiedad para dársela a los vendedores (Productividad de Real Estate)
exports.getPropertyPerformance = async (req, res) => {
    try {
        // Obtenemos los proyectos reales y les anexamos métricas analíticas simuladas altamente persuasivas
        const query = await pool.query(`SELECT id_proyecto, titulo, meta_financiera, estado_proyecto FROM proyectos`);
        
        const proyectosConData = query.rows.map(p => {
            // Simulamos analíticas que harían brillar a los Real Estate (cuánto interés genera su propiedad)
            const vistas = Math.floor(Math.random() * 5000) + 500;
            const favs = Math.floor(vistas * 0.15); // 15% guardan a favoritos
            const inicianCierre = Math.floor(vistas * 0.05); // 5% le dan a Iniciar cierre

            return {
                id_proyecto: p.id_proyecto,
                titulo: p.titulo,
                estado_proyecto: p.estado_proyecto,
                meta_financiera: p.meta_financiera,
                vistas_totales: vistas,
                guardados_favoritos: favs,
                clics_iniciar_cierre: inicianCierre,
                tasa_conversion_potencial: ((inicianCierre / vistas) * 100).toFixed(1) + "%"
            };
        });

        res.status(200).json({ properties: proyectosConData });
    } catch (error) {
        console.error('Error fetching property performance:', error);
        res.status(500).json({ error: 'Error del servidor analizando propiedades' });
    }
};
