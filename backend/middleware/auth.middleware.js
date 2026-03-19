const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ error: 'Denegado: Se requiere un token de acceso' });
  }

  try {
    // El formato esperado es "Bearer [token]"
    const tokenParts = token.split(' ');
    const tokenString = tokenParts.length === 2 ? tokenParts[1] : tokenParts[0];

    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'super-secreto-isla-invest-12345');
    
    // Guardar los datos del usuario en la solicitud (req.user) para usarlos en el controlador
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
