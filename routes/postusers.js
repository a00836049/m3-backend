const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, apellido, password, pelicula_favorita } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellido', sql.VarChar(50), apellido)
      .input('password', sql.VarChar(255), password)
      .input('pelicula_favorita', sql.VarChar(100), pelicula_favorita)
      .query(
        `INSERT INTO db_a25c05_wusap.dbo.marcelocardenas 
        (nombre, apellido, password, pelicula_favorita) 
        VALUES (@nombre, @apellido, @password, @pelicula_favorita)`
      );
    res.status(201).send('Registro insertado correctamente');
  } catch (err) {
    console.error('Error al insertar en la base de datos:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
