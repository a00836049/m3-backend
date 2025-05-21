const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// PUT /updateuser/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, password, pelicula_favorita } = req.body;
  try {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellido', sql.VarChar(50), apellido)
      .input('password', sql.VarChar(255), password)
      .input('pelicula_favorita', sql.VarChar(100), pelicula_favorita)
      .query(
        `UPDATE db_a25c05_wusap.dbo.marcelocardenas
         SET nombre = @nombre,
             apellido = @apellido,
             password = @password,
             pelicula_favorita = @pelicula_favorita
         WHERE id_usuario = @id`
      );
    res.status(200).send('Usuario actualizado correctamente');
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
