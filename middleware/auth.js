const jwt = require('jsonwebtoken');

// Usar la misma clave secreta que en login.js
const JWT_SECRET = 'clave_secreta_jwt_marcelocardenas';

function authMiddleware(req, res, next) {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar el usuario decodificado a la solicitud
    req.user = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al verificar token:', error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = authMiddleware;
