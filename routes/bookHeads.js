// const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/:id/:m/:y', async (req, res) => {
  try {
    const { id, m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookHeadsNew');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching bookHeads:', err);
    res.status(500).send('Internal Server Error');
  }
});

// save for now
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input('id', sql.Int, id)
//       .execute('getBookHeads');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching bookHeads:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

module.exports = router;
