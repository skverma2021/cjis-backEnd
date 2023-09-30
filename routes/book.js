// const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');

const config = {
  server: 'VERMARNCDBG',
  database: 'CJIS',
  user: 'apiUserLogin',
  password: 'theApiUser',
  trustServerCertificate: true,
};
// used in TransferPosting.jsx
router.get('/:id', async (req, res) => {
  // console.log('Hi from book.js');
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .execute('getEmpBookHeads');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching empDetails:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
