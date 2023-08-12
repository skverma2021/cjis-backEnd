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

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM cities');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching cities:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
