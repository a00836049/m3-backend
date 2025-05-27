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
    const secretKey = 'clave_secreta_jwt_marcelocardenas'; // Asegúrate de que sea la misma usada en login
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next(); // Continuar con la siguiente función
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error de verificación de token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// DELETE /deleteuser/:id - Protegido con verificación de token
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query(
        `DELETE FROM db_a25c05_wusap.dbo.marcelocardenas
         WHERE id_usuario = @id`
      );
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error al eliminar el usuario:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
