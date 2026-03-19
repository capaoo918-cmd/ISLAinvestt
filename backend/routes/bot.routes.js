const express = require('express');
const router = express.Router();
const botController = require('../controllers/bot.controller');

// Chatbot Público (Alfred Fernandez) - No requiere verifyToken para captar nuevos Leads Anónimos
router.post('/chat', botController.chatConAlfred);

// Endpoint integrador de WhatsApp (Meta Developer)
router.post('/whatsapp', botController.webhookWhatsApp);
router.get('/whatsapp', (req, res) => {
    // Verificación de Meta Webhook (Hub Challenge)
    if (req.query['hub.verify_token'] == 'isla_invest_crm_token_123') {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;
