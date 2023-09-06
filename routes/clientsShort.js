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
  // console.log('here in short');
  try {
    const { mode } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().query('getClientsShort');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
