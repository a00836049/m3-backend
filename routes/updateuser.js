const express = require('express');
const { getConnection, sql } = require('../db');
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

// PUT /updateuser/:id - Protegido con verificación de token
router.put('/:id', verificarToken, async (req, res) => {
  const userId = req.params.id;
  const { nombre, apellido, pelicula_favorita } = req.body;
  
  try {
    const pool = await getConnection();
    
    // Primero, verificamos si el usuario existe y obtenemos sus datos actuales
    const checkUser = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT * FROM db_a25c05_wusap.dbo.marcelocardenas WHERE id_usuario = @id');
    
    if (checkUser.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Actualizar solo los campos proporcionados, sin tocar la contraseña
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellido', sql.VarChar(50), apellido)
      .input('pelicula', sql.VarChar(50), pelicula_favorita)
      .query(
        `UPDATE db_a25c05_wusap.dbo.marcelocardenas 
         SET nombre = @nombre, apellido = @apellido, pelicula_favorita = @pelicula 
         WHERE id_usuario = @id`
      );
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'No se pudo actualizar el usuario' });
    }
    
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
  }
});

module.exports = router;
