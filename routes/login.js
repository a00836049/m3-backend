const express = require('express');
const { getConnection, sql } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Necesitarás instalar: npm install jsonwebtoken
const router = express.Router();

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'clave_secreta_jwt_marcelocardenas';

router.post('/', async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .query(
        'SELECT * FROM db_a25c05_wusap.dbo.marcelocardenas WHERE nombre = @nombre'
      );
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id_usuario, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );
    
    // No enviar la contraseña al cliente
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      message: 'Login exitoso', 
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error en login:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
