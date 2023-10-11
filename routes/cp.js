const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const bcrypt = require('bcrypt');

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { passwd } = req.body;
    const hashPass = await bcrypt.hash(passwd, 10);

    const pool = await sql.connect(config);

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('passwd', sql.VarChar(150), hashPass)
      .query('UPDATE emp SET passwd = @passwd WHERE id = @id');

    res.send(`Password updated successfully !`);
  } catch (err) {
    console.error('Error updating employee data:', err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
