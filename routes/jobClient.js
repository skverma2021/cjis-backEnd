const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().input('jobId', sql.Int, jobId)
      .query(`SELECT job.description AS jobDes, client.shortName AS jobClient, CONVERT(VARCHAR(10), job.ordDateStart, 121) AS jobStart, CONVERT(VARCHAR(10), job.ordDateEnd, 121) AS jobEnd, job.ordValue AS jobValue
      FROM     client INNER JOIN
                        job ON client.id = job.clientId
      WHERE  (job.id = @jobId)`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
