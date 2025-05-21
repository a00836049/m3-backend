const express = require('express');
const { getConnection, sql } = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .query(
        `SELECT * FROM db_a25c05_wusap.dbo.marcelocardenas WHERE nombre = @nombre`
      );
    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    res.json({ message: 'Login exitoso', user });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
