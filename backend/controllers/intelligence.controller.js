const pool = require('../db');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Estadísticas de Propiedad y Matchmaking
exports.getPropertyStats = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vistas únicas
        const viewsRes = await pool.query('SELECT COUNT(*) FROM vistas_propiedades WHERE id_propiedad = $1', [id]);
        
        // Leads interesados
        const leadsRes = await pool.query(`
            SELECT u.id_usuario, u.email, li.score_interes 
            FROM leads_interesados li
            JOIN usuarios u ON li.id_usuario = u.id_usuario
            WHERE li.id_propiedad = $1
            ORDER BY li.score_interes DESC
        `, [id]);

        // Datos de la propiedad para contexto
        const propRes = await pool.query('SELECT * FROM proyectos WHERE id_proyecto = $1', [id]);

        res.json({
            vistas: viewsRes.rows[0].count,
            leads: leadsRes.rows,
            propiedad: propRes.rows[0]
        });
    } catch (error) {
        console.error('Error in getPropertyStats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

// 2. AI Real Estate Coach (OpenAI)
exports.getAICoachInsights = async (req, res) => {
    try {
        const { propertyData, type } = req.body; // type: 'strategy' or 'pitch'

        const systemPrompt = `Eres el 'IslaInvest Sales Coach'. Tu misión es asesorar al administrador para cerrar ventas inmobiliarias de lujo. 
        Analiza los datos técnicos y genera un resultado persuasivo y táctico. 
        Solo responde sobre procesos de ventas inmobiliarias.`;

        const userPrompt = type === 'strategy' 
            ? `Genera 3 recomendaciones tácticas de oferta y una estrategia de negociación para la propiedad: ${JSON.stringify(propertyData)}`
            : `Genera un borrador de correo persuasivo (Pitch) para un lead VIP interesado en: ${JSON.stringify(propertyData)}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
        });

        res.json({ insight: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error in AICoach:', error);
        res.status(500).json({ error: 'Error en el motor de IA' });
    }
};

// 3. Leaderboard
exports.getPerformanceLeaderboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.email, mv.volumen_ventas, mv.conversion_rate 
            FROM metricas_vendedores mv
            JOIN usuarios u ON mv.id_vendedor = u.id_usuario
            ORDER BY mv.volumen_ventas DESC LIMIT 10
        `);
        res.json({ leaderboard: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Error en leaderboard' });
    }
};

// 4. Sales Audit
exports.getSalesAudit = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT vg.*, p.titulo 
            FROM ventas_gestionadas vg
            JOIN proyectos p ON vg.id_propiedad = p.id_proyecto
            ORDER BY vg.fecha_cierre DESC
        `);
        res.json({ ventas: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Error en auditoría' });
    }
};

// 5. Revenue
exports.getRevenueData = async (req, res) => {
    try {
        const comisiones = await pool.query('SELECT SUM(comision_plataforma) as total FROM ventas_gestionadas WHERE estado_legal = \'completado\'');
        const transito = await pool.query('SELECT SUM(comision_plataforma) as total FROM ventas_gestionadas WHERE estado_legal != \'completado\'');
        
        res.json({
            cobrado: comisiones.rows[0].total || 0,
            en_transito: transito.rows[0].total || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Error contable' });
    }
};
