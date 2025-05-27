const express = require('express');
const { getConnection, sql } = require('../db');
const bcrypt = require('bcrypt');
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

// POST /postusers - Protegido con verificación de token
router.post('/', verificarToken, async (req, res) => {
  const { nombre, apellido, password, pelicula_favorita } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getConnection();
    await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellido', sql.VarChar(50), apellido)
      .input('password', sql.VarChar(255), hashedPassword)
      .input('pelicula_favorita', sql.VarChar(100), pelicula_favorita)
      .query(
        `INSERT INTO db_a25c05_wusap.dbo.marcelocardenas 
        (nombre, apellido, password, pelicula_favorita) 
        VALUES (@nombre, @apellido, @password, @pelicula_favorita)`
      );
    // Cambiar a formato JSON para la respuesta
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error al insertar en la base de datos:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
