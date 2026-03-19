const express = require('express');
const router = express.Router();
const transController = require('../controllers/transaction.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Invertir en un proyecto (Requiere ser inversor aprobado)
router.post('/invertir', verifyToken, transController.iniciarInversion);

// Crear un nuevo proyecto (Requiere ser creador aprobado)
router.post('/crear_proyecto', verifyToken, transController.crearProyecto);

// Obtener métricas del panel según el rol
router.get('/pizarron', verifyToken, transController.obtenerPizarron);

// Obtener proyectos públicos para el Marketplace
router.get('/proyectos', transController.obtenerProyectosPublicos);

// Obtener detalle de un proyecto específico
router.get('/proyectos/:id', transController.obtenerDetalleProyecto);

module.exports = router;
