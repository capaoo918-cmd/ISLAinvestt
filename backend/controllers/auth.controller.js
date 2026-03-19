const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Registro de Nuevos Usuarios
exports.registro = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    // Validación básica de entrada
    if (!email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (rol !== 'inversor' && rol !== 'creador') {
      return res.status(400).json({ error: 'Rol inválido. Debe ser inversor o creador' });
    }

    // Verificar si el email ya existe
    const userExist = await pool.query('SELECT email FROM usuarios WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Encriptar contraseña
    const saltRounds = 12; // Valor seguro recomendado
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar en la base de datos
    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash, rol, estado_kyc, dos_factores_activo)
       VALUES ($1, $2, $3, 'pendiente', FALSE)
       RETURNING id_usuario, email, rol, estado_kyc`,
      [email, passwordHash, rol]
    );

    const newUser = result.rows[0];

    // Generar JWT para inicio de sesión automático
    const payload = {
      id_usuario: newUser.id_usuario,
      rol: newUser.rol,
      estado_kyc: newUser.estado_kyc
    };
    const jwtSecret = process.env.JWT_SECRET || 'llave-secreta-temporal-para-desarrollo-isla2024';
    const token_acceso = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    // Respuesta Exitosa
    res.status(201).json({
      mensaje: "Usuario registrado exitosamente. Por favor, completa la verificación de identidad (KYC).",
      token_acceso: token_acceso,
      usuario: newUser
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno o de base de datos' });
  }
};

// Inicio de Sesión
exports.login = async (req, res) => {
  try {
    const { email, password, ip_cliente } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Buscar al usuario
    const userResult = await pool.query(
      'SELECT id_usuario, password_hash, rol, estado_kyc, dos_factores_activo FROM usuarios WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    // Comparar la contraseña validando el hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Actualizar la IP (Log de seguridad)
    if (ip_cliente) {
      await pool.query(
        'UPDATE usuarios SET ultima_ip_acceso = $1 WHERE id_usuario = $2',
        [ip_cliente, user.id_usuario]
      );
    }

    // Generar JWT temporal o definitivo según 2FA
    const payload = {
      id_usuario: user.id_usuario,
      rol: user.rol,
      estado_kyc: user.estado_kyc
    };

    const jwtSecret = process.env.JWT_SECRET || 'llave-secreta-temporal-para-desarrollo-isla2024';
    
    let token_acceso = null;
    let requiere_2fa = user.dos_factores_activo;

    if (!requiere_2fa) {
      // Si no hay 2FA, emite el token oficial que dura 24h
      token_acceso = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    } else {
      // Si requiere 2FA, emite un token MUY temporal (ej. 5 minutos) habilitado sólo para la ruta de verificar 2FAOTP
      token_acceso = jwt.sign({ ...payload, pre_2fa: true }, jwtSecret, { expiresIn: '5m' });
    }

    // Respuesta Exitosa
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token_acceso: token_acceso,
      requiere_2fa: requiere_2fa,
      usuario: {
        id_usuario: user.id_usuario,
        rol: user.rol,
        estado_kyc: user.estado_kyc
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error durante el inicio de sesión' });
  }
};
