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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().input('id', sql.Int, id).query(`
    SELECT emp.id AS empId, job.description AS nameJob, jobExStages.theStage AS nameStage, CONVERT(VARCHAR(10), workPlan.schDtStart, 111) AS dtStart, CONVERT(VARCHAR(10), workPlan.schDtEnd, 111) AS dtEnd, workPlan.id AS wpId
    FROM     job INNER JOIN
                      workPlan ON job.id = workPlan.jobId INNER JOIN
                      jobExStages ON workPlan.stageId = jobExStages.id INNER JOIN
                      emp ON workPlan.depttId = emp.curDeptt
    WHERE  (emp.id = @id)
    ORDER BY wpId
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching bookHeads:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
