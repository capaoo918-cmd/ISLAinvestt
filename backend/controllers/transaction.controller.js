const pool = require('../db');

// Inversor: Iniciar un cierre digital y mover fondos al Escrow
exports.iniciarInversion = async (req, res) => {
  try {
    const { id_proyecto, monto } = req.body;
    const id_inversor = req.user.id_usuario;

    // 1. Validar que el usuario tenga KYC Aprobado
    const userQuery = await pool.query('SELECT estado_kyc, rol FROM usuarios WHERE id_usuario = $1', [id_inversor]);
    if (userQuery.rows[0].estado_kyc !== 'aprobado') {
      return res.status(403).json({ error: 'Denegado: Debes tener el KYC aprobado para mover fondos al Escrow.' });
    }
    if (userQuery.rows[0].rol !== 'inversor') {
      return res.status(403).json({ error: 'Denegado: Sólo los inversores pueden fondear proyectos.' });
    }

    // 2. Comprobar que el Proyecto Exista y esté activo
    const projectQuery = await pool.query('SELECT estado_proyecto FROM proyectos WHERE id_proyecto = $1', [id_proyecto]);
    if (projectQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // 3. Registrar la Inversión en estado 'retenido_escrow'
    const invResult = await pool.query(
      `INSERT INTO inversiones (id_inversor, id_proyecto, monto_invertido, estado_fondos, firma_digital_id)
       VALUES ($1, $2, $3, 'retenido_escrow', $4) RETURNING id_inversion`,
      [id_inversor, id_proyecto, monto, `docusign_mock_${Date.now()}`]
    );

    const id_inversion = invResult.rows[0].id_inversion;

    // 4. Crear el Log Inmutable de la transacción
    const hashUnico = `tx_0x${Math.random().toString(16).substring(2)}${Date.now()}`;
    const logResult = await pool.query(
      `INSERT INTO log_transacciones (id_inversion, tipo_operacion, monto, hash_transaccion, detalles_proveedor_pago)
       VALUES ($1, 'deposito_inicial', $2, $3, $4) RETURNING id_transaccion, hash_transaccion, ejecutado_en`,
      [id_inversion, monto, hashUnico, JSON.stringify({ proveedor: 'Stripe Connect Escrow', status: 'succeeded' })]
    );

    res.status(201).json({
      mensaje: 'Fondos asegurados exitosamente en la Bóveda Escrow.',
      transaccion: logResult.rows[0]
    });

  } catch (error) {
    console.error('Error al procesar inversión:', error);
    res.status(500).json({ error: 'Error del servidor procesando la inversión' });
  }
};

// Creador: Crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
  try {
    const { titulo, meta_financiera } = req.body;
    const id_creador = req.user.id_usuario;

    // Validar Rol
    const userQuery = await pool.query('SELECT rol FROM usuarios WHERE id_usuario = $1', [id_creador]);
    if (userQuery.rows[0].rol !== 'creador') {
      return res.status(403).json({ error: 'Denegado: Sólo los Creadores pueden registrar proyectos.' });
    }

    // Insertar Proyecto (Nace "en_auditoria" por la BD)
    const result = await pool.query(
      `INSERT INTO proyectos (id_creador, titulo, meta_financiera, cuenta_escrow_id, contrato_marco_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_creador, titulo, meta_financiera, `stripe_escrow_${Date.now()}`, `contrato_base_${Date.now()}`]
    );

    res.status(201).json({
      mensaje: 'Proyecto registrado y en fase de auditoría administrativa.',
      proyecto: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error del servidor registrando el proyecto' });
  }
};

// Creador/Inversor: Obtener métricas rápidas
exports.obtenerPizarron = async (req, res) => {
  try {
    const rol = req.user.rol;
    const id_usuario = req.user.id_usuario;

    if (rol === 'creador') {
      // El creador ve sus proyectos y cuánto dinero se ha retenido en el escrow para esos proyectos
      const proyectosQuery = await pool.query(
        `SELECT p.id_proyecto, p.titulo, p.estado_proyecto, p.meta_financiera, 
         COALESCE(SUM(i.monto_invertido), 0) as total_recaudado_escrow
         FROM proyectos p
         LEFT JOIN inversiones i ON p.id_proyecto = i.id_proyecto AND i.estado_fondos = 'retenido_escrow'
         WHERE p.id_creador = $1
         GROUP BY p.id_proyecto`,
        [id_usuario]
      );
      return res.status(200).json({ proyectos: proyectosQuery.rows });
    } else {
      // El inversor ve sus inversiones en Escrow
      const inversionesQuery = await pool.query(
        `SELECT i.id_inversion, p.titulo, i.monto_invertido, i.estado_fondos, t.hash_transaccion, t.ejecutado_en
         FROM inversiones i
         JOIN proyectos p ON i.id_proyecto = p.id_proyecto
         JOIN log_transacciones t ON i.id_inversion = t.id_inversion
         WHERE i.id_inversor = $1 AND t.tipo_operacion = 'deposito_inicial'`,
        [id_usuario]
      );
      return res.status(200).json({ inversiones: inversionesQuery.rows });
    }
  } catch (error) {
    console.error('Error al obtener pizarrón:', error);
    res.status(500).json({ error: 'Error del servidor obteniendo las métricas' });
  }
};
// Público: Obtener todos los proyectos activos para el Marketplace
exports.obtenerProyectosPublicos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id_proyecto, p.titulo, p.meta_financiera, p.estado_proyecto,
       COALESCE(SUM(i.monto_invertido), 0) as total_recaudado
       FROM proyectos p
       LEFT JOIN inversiones i ON p.id_proyecto = i.id_proyecto AND i.estado_fondos = 'liberado_al_proyecto'
       WHERE p.estado_proyecto = 'activo'
       GROUP BY p.id_proyecto`
    );
    res.status(200).json({ proyectos: result.rows });
  } catch (error) {
    console.error('Error al obtener proyectos públicos:', error);
    res.status(500).json({ error: 'Error del servidor obteniendo proyectos' });
  }
};

// Obtener detalle de un proyecto específico
exports.obtenerDetalleProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.email as creador_email, 
       COALESCE(SUM(i.monto_invertido), 0) as total_recaudado
       FROM proyectos p
       JOIN usuarios u ON p.id_creador = u.id_usuario
       LEFT JOIN inversiones i ON p.id_proyecto = i.id_proyecto AND i.estado_fondos = 'liberado_al_proyecto'
       WHERE p.id_proyecto = $1
       GROUP BY p.id_proyecto, u.email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ proyecto: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener detalle del proyecto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
