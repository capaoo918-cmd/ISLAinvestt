const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const kycRoutes = require('./routes/kyc.routes');
const txRoutes = require('./routes/transaction.routes');
const botRoutes = require('./routes/bot.routes');
const adminRoutes = require('./routes/admin.routes');
const superAdminRoutes = require('./routes/superadmin.routes');
const intelligenceRoutes = require('./routes/intelligence.routes');

const app = express();

// Habilitar CORS dinámico para despliegue
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://islainvest.vercel.app', 
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como apps móviles o curl)
    // En desarrollo o despliegues de prueba de Vercel, permitimos todo lo que termine en .vercel.app
    const isVercel = origin && origin.endsWith('.vercel.app');
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || isVercel || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.error(`Bloqueo CORS para el origen: ${origin}`);
      callback(new Error('No permitido por CORS (IslaInvest Security)'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/tx', txRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super', superAdminRoutes);
app.use('/api/intelligence', intelligenceRoutes);

const path = require('path');

// RUTAS HTML DE LA PLATAFORMA ORIGINAL (Para enlazar la transición SPA -> Dashboard Antiguo)
app.use(express.static(path.join(__dirname, '../')));

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor de IslaInvest ejecutándose en el puerto ${PORT}`);
});
