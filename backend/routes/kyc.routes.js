const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kyc.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Procesar verificación de identidad (Requiere login)
router.post('/procesar', verifyToken, kycController.procesarKYC);

module.exports = router;
