const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();

// GET /users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM db_a25c05_wusap.dbo.marcelocardenas');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al consultar los usuarios:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
