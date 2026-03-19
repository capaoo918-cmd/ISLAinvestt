const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superadmin.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Este middleware adicional aplicará a TODAS LAS RUTAS de este archivo para máxima seguridad.
// router.use(verifyToken, superAdminController.verificarSuperAdmin) -> Para el Prototipo y que puedan probar, voy a simularlo sin el bloque absoluto,
// Pero en producción se descomenta la línea de verificación rigurosa de Rol = 'admin'.

// ============= Control Usuarios y KYC ============= 
router.get('/usuarios', superAdminController.obtenerUsuarios);
// id es id_usuario UUID, action en body ('aprobar', 'rechazar')
router.post('/usuarios/kyc/:id', superAdminController.auditarKYC);

// ============= Auditoría Proyectos Fiduciarios ============= 
router.get('/proyectos', superAdminController.obtenerProyectos);
// action en body nuevo_estado ('activo', 'cancelado', etc)
router.post('/proyectos/estado/:id', superAdminController.cambiarEstadoProyecto);

// ============= Libros Contables y Retenciones ============= 
router.get('/boveda', superAdminController.obtenerSaldoEscrow);

module.exports = router;
