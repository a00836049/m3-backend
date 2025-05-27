const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  // Obtener el token del header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }
  
  try {
    // Usar la misma clave secreta que se usa en la ruta de login
    const secretKey = 'clave_secreta_jwt_marcelocardenas';
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next(); // Continuar con la siguiente función
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error de verificación de token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// GET /users - Obtener todos los usuarios - Protegido con verificación de token
router.get('/', verificarToken, async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM db_a25c05_wusap.dbo.marcelocardenas');
    res.json(result.recordset);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error al consultar los usuarios:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
