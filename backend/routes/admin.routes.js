const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Obtener Lista de Clientes Atendidos por Alfred
router.get('/crm/leads', adminController.getLeadsCRM);

// Obtener Top Búsquedas y Rendimiento de la Plataforma Global
router.get('/analytics/platform', adminController.getPlatformUsage);

// Obtener Big Data de cada Propiedad (Embudo de ventas por inmueble)
router.get('/analytics/properties', adminController.getPropertyPerformance);

module.exports = router;
