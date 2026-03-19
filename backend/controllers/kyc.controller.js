const pool = require('../db');

// Simulación de procesamiento de KYC (Mock de integración con Sumsub/Jumio)
exports.procesarKYC = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    // En una integración real, aquí enviaríamos los archivos a la API externa
    // y esperaríamos un webhook. Para este prototipo, aprobamos automáticamente
    // después de una breve demora simulada.

    const result = await pool.query(
      'UPDATE usuarios SET estado_kyc = \'aprobado\', proveedor_kyc_id = $1 WHERE id_usuario = $2 RETURNING estado_kyc',
      [`mock_provider_${Date.now()}`, id_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      mensaje: 'Procesamiento KYC completado con éxito mediante IA.',
      estado: result.rows[0].estado_kyc
    });

  } catch (error) {
    console.error('Error al procesar KYC:', error);
    res.status(500).json({ error: 'Error del servidor procesando identidad' });
  }
};
