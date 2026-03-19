const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro de usuario
router.post('/registro', authController.registro);

// Login de usuario
router.post('/login', authController.login);

// WebAuthn / Passkeys
router.post('/webauthn/register-options', authController.generateRegisterOptions);
router.post('/webauthn/verify-registration', authController.verifyRegistration);
router.post('/webauthn/login-options', authController.generateLoginOptions);
router.post('/webauthn/verify-login', authController.verifyLogin);

module.exports = router;
