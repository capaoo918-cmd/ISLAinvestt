const express = require('express');
const router = express.Router();
const intelligenceController = require('../controllers/intelligence.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Rutas protegidas para Administrador
router.get('/property-stats/:id', intelligenceController.getPropertyStats);
router.post('/ai-coach/insight', intelligenceController.getAICoachInsights);
router.get('/leaderboard', intelligenceController.getPerformanceLeaderboard);
router.get('/sales-audit', intelligenceController.getSalesAudit);
router.get('/revenue', intelligenceController.getRevenueData);

module.exports = router;
