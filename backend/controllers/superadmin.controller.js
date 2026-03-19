const pool = require('../db');

// Middleware extra: Verificar si el rol es Admin Total
exports.verificarSuperAdmin = async (req, res, next) => {
    try {
        const id_usuario = req.user.id_usuario;
        const userQuery = await pool.query('SELECT rol FROM usuarios WHERE id_usuario = $1', [id_usuario]);
        
        if (userQuery.rows.length === 0 || userQuery.rows[0].rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso Denegado: Se requieren privilegios de Super Administrador.' });
        }
        next();
    } catch (error) {
        console.error('Error verificación admin:', error);
        res.status(500).json({ error: 'Error interno verificando permisos' });
    }
};

// ======================= GESTIÓN DE USUARIOS Y KYC ======================= //

exports.obtenerUsuarios = async (req, res) => {
    try {
        const query = await pool.query(
            `SELECT id_usuario, email, rol, estado_kyc, proveedor_kyc_id, ultima_ip_acceso, creado_en 
             FROM usuarios 
             ORDER BY creado_en DESC`
        );
        res.status(200).json({ usuarios: query.rows });
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo la lista de usuarios globales' });
    }
};

exports.auditarKYC = async (req, res) => {
    try {
        const { accion } = req.body; // 'aprobar' o 'rechazar'
        const id_usuario = req.params.id;

        const nuevoEstado = accion === 'aprobar' ? 'aprobado' : 'rechazado';

        const updateQuery = await pool.query(
            `UPDATE usuarios SET estado_kyc = $1 WHERE id_usuario = $2 RETURNING email, estado_kyc`,
            [nuevoEstado, id_usuario]
        );

        if (updateQuery.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(200).json({ 
            mensaje: `El Perfil KYC de ${updateQuery.rows[0].email} fue auditado y actualizado a: ${nuevoEstado.toUpperCase()}.`
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar estado de KYC' });
    }
};

// ======================= AUDITORÍA DE PROYECTOS ======================= //

exports.obtenerProyectos = async (req, res) => {
    try {
        const query = await pool.query(
            `SELECT p.id_proyecto, p.titulo, p.estado_proyecto, p.meta_financiera, p.creado_en, 
                    u.email as email_promotor 
             FROM proyectos p
             JOIN usuarios u ON p.id_creador = u.id_usuario
             ORDER BY p.creado_en DESC`
        );
        res.status(200).json({ proyectos: query.rows });
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo portafolio global' });
    }
};

exports.cambiarEstadoProyecto = async (req, res) => {
    try {
        const { nuevo_estado } = req.body; // 'activo', 'financiado', 'congelado_por_fraude', 'cancelado'
        const id_proyecto = req.params.id;

        const validEstados = ['en_auditoria', 'activo', 'financiado', 'congelado_por_fraude', 'cancelado'];
        if (!validEstados.includes(nuevo_estado)) {
            return res.status(400).json({ error: 'Estado de proyecto inválido.' });
        }

        const query = await pool.query(
            `UPDATE proyectos SET estado_proyecto = $1 WHERE id_proyecto = $2 RETURNING titulo`,
            [nuevo_estado, id_proyecto]
        );

        if (query.rows.length === 0) return res.status(404).json({ error: 'Fideicomiso no encontrado' });

        res.status(200).json({
            mensaje: `El estatus legal Fideicomiso "${query.rows[0].titulo}" fue modificado a: ${nuevo_estado.toUpperCase()}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el estado del fideicomiso' });
    }
};

// ======================= FONDOS ESCROW Y REEMBOLSOS ======================= //

exports.obtenerSaldoEscrow = async (req, res) => {
    try {
        // En una plataforma Real, esto llamaría a \`stripe.balance.retrieve()\`
        // Visualizaremos las finanzas bloqueadas en base de datos.
        const query = await pool.query(
            `SELECT 
                SUM(CASE WHEN estado_fondos = 'retenido_escrow' THEN monto_invertido ELSE 0 END) AS total_en_boveda,
                SUM(CASE WHEN estado_fondos = 'liberado_al_proyecto' THEN monto_invertido ELSE 0 END) AS total_liberado,
                SUM(CASE WHEN estado_fondos = 'reembolsado' THEN monto_invertido ELSE 0 END) AS total_reembolsado
             FROM inversiones`
        );

        // Ultimas transacciones inmutables globales
        const ledgerQuery = await pool.query(
            `SELECT t.hash_transaccion, t.tipo_operacion, t.monto, t.ejecutado_en, p.titulo as proyecto
             FROM log_transacciones t
             JOIN inversiones i ON t.id_inversion = i.id_inversion
             JOIN proyectos p ON i.id_proyecto = p.id_proyecto
             ORDER BY t.ejecutado_en DESC LIMIT 20`
        );

        res.status(200).json({ 
            balances: query.rows[0] || { total_en_boveda: 0, total_liberado: 0, total_reembolsado: 0 },
            auditoria_logs: ledgerQuery.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error analizando las finanzas del Escrow global' });
    }
};
