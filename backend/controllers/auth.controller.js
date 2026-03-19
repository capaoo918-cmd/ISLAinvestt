const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.FRONTEND_URL || `http://${RP_ID}:3000`;

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

// --- WebAuthn / Passkeys: Registro ---

exports.generateRegisterOptions = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = userResult.rows[0];

    const authsResult = await pool.query('SELECT id_credencial FROM autenticadores WHERE id_usuario = $1', [user.id_usuario]);
    const userAuthenticators = authsResult.rows.map(row => ({
      credentialID: row.id_credencial,
      transports: ['internal'],
    }));

    const options = await generateRegistrationOptions({
      rpName: 'IslaInvest',
      rpID: RP_ID,
      userID: user.id_usuario,
      userName: email,
      attestationType: 'none',
      excludeCredentials: userAuthenticators,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    await pool.query('UPDATE usuarios SET challenge_webauthn = $1 WHERE id_usuario = $2', [options.challenge, user.id_usuario]);
    res.json(options);
  } catch (error) {
    console.error('WebAuthn Register Options Error:', error);
    res.status(500).json({ error: 'Fallo al generar opciones de registro' });
  }
};

exports.verifyRegistration = async (req, res) => {
  try {
    const { email, registrationResponse } = req.body;
    const userResult = await pool.query('SELECT id_usuario, challenge_webauthn FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = userResult.rows[0];

    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: user.challenge_webauthn,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (verification.verified) {
      const { registrationInfo } = verification;
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      await pool.query(
        'INSERT INTO autenticadores (id_credencial, id_usuario, clave_publica, conteo_signo, transporte) VALUES ($1, $2, $3, $4, $5)',
        [Buffer.from(credentialID), user.id_usuario, Buffer.from(credentialPublicKey), counter, JSON.stringify(['internal'])]
      );

      await pool.query('UPDATE usuarios SET challenge_webauthn = NULL WHERE id_usuario = $1', [user.id_usuario]);
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, error: 'Verificación fallida' });
    }
  } catch (error) {
    console.error('WebAuthn Verify Registration Error:', error);
    res.status(500).json({ error: 'Error al verificar registro' });
  }
};

// --- WebAuthn / Passkeys: Login ---

exports.generateLoginOptions = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = userResult.rows[0];

    const authsResult = await pool.query('SELECT id_credencial FROM autenticadores WHERE id_usuario = $1', [user.id_usuario]);
    const allowCredentials = authsResult.rows.map(row => ({
      id: row.id_credencial,
      type: 'public-key',
      transports: ['internal'],
    }));

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials,
      userVerification: 'preferred',
    });

    await pool.query('UPDATE usuarios SET challenge_webauthn = $1 WHERE id_usuario = $2', [options.challenge, user.id_usuario]);
    res.json(options);
  } catch (error) {
    console.error('WebAuthn Login Options Error:', error);
    res.status(500).json({ error: 'Fallo al generar opciones de login' });
  }
};

exports.verifyLogin = async (req, res) => {
  try {
    const { email, authResponse } = req.body;
    const userResult = await pool.query('SELECT id_usuario, challenge_webauthn, rol, estado_kyc FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = userResult.rows[0];
    const credentialIDBuffer = Buffer.from(authResponse.id, 'base64url');
    
    const authResult = await pool.query('SELECT * FROM autenticadores WHERE id_credencial = $1', [credentialIDBuffer]);
    if (authResult.rows.length === 0) return res.status(404).json({ error: 'Credencial no reconocida' });

    const authenticator = authResult.rows[0];

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: user.challenge_webauthn,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: authenticator.id_credencial,
        credentialPublicKey: authenticator.clave_publica,
        counter: authenticator.conteo_signo,
      },
    });

    if (verification.verified) {
      await pool.query('UPDATE autenticadores SET conteo_signo = $1 WHERE id_credencial = $2', [verification.authenticationInfo.newCounter, authenticator.id_credencial]);
      await pool.query('UPDATE usuarios SET challenge_webauthn = NULL WHERE id_usuario = $1', [user.id_usuario]);

      const jwtSecret = process.env.JWT_SECRET || 'llave-secreta-temporal-para-desarrollo-isla2024';
      const token_acceso = jwt.sign({ id_usuario: user.id_usuario, rol: user.rol, estado_kyc: user.estado_kyc }, jwtSecret, { expiresIn: '24h' });

      res.json({ verified: true, token_acceso, usuario: { id_usuario: user.id_usuario, rol: user.rol, estado_kyc: user.estado_kyc } });
    } else {
      res.status(400).json({ verified: false, error: 'Firma biométrica inválida' });
    }
  } catch (error) {
    console.error('WebAuthn Verify Login Error:', error);
    res.status(500).json({ error: 'Error al verificar autenticación' });
  }
};
