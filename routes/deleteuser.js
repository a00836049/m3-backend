const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// DELETE /deleteuser/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query(
        `DELETE FROM db_a25c05_wusap.dbo.marcelocardenas
         WHERE id_usuario = @id`
      );
    res.status(200).send('Usuario eliminado correctamente');
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
