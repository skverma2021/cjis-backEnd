// const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/:m/:y', async (req, res) => {
  try {
    const { m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookingDates');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching bookHeads:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
