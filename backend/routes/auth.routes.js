const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro de usuario
router.post('/registro', authController.registro);

// Login de usuario
router.post('/login', authController.login);

module.exports = router;
