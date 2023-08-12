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
// const { jobId } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input('jobId', sql.Int, jobId)
router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .query(
        `SELECT A.id as stageId, A.theStage,depttId = (select depttId from workPlan where (jobId = @jobId) and (stageId = A.id)),startDt = (select schDtStart from workPlan where (jobId = @jobId) and (stageId = A.id)),endDt = (select schDtEnd from workPlan where (jobId = @jobId) and (stageId = A.id)) FROM     jobExStages A`
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
