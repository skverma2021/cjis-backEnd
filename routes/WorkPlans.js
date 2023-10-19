// const { validate } = require('../models/discipline');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        'SELECT workPlan.id, workPlan.jobId, workPlan.stageId, jobExStages.theStage, workPlan.depttId, deptt.name AS theDeptt, workPlan.schDtStart, workPlan.schDtEnd FROM     deptt INNER JOIN workPlan ON deptt.id = workPlan.depttId INNER JOIN jobExStages ON workPlan.stageId = jobExStages.id'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching workPlans:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .execute('getJobWorkPlan');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching job workPlan:', err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/:jobId/:stageId', async (req, res) => {
  try {
    const { jobId, stageId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .input('stageId', sql.TinyInt, stageId)
      .query(
        'SELECT id, jobId, stageId, depttId, schDtStart, schDtEnd FROM workPlan WHERE  (jobId = @jobId) AND (stageId = @stageId)'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching job workPlan:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert workPlan
router.post('/', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { jobId, stageId, depttId, schDtStart, schDtEnd, shareVal } =
      req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .input('stageId', sql.TinyInt, stageId)
      .input('depttId', sql.TinyInt, depttId)
      .input('schDtStart', sql.Date, schDtStart)
      .input('schDtEnd', sql.Date, schDtEnd)
      .input('shareVal', sql.Money, shareVal)
      .execute('postWorkPlan');

    // res;
    res
      .status(201)
      .send(`WorkPlan data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting workPlan data:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:jobId/:stageId', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { jobId, stageId } = req.params;
    const { depttId, schDtStart, schDtEnd, shareVal } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .input('stageId', sql.TinyInt, stageId)
      .input('depttId', sql.TinyInt, depttId)
      .input('schDtStart', sql.Date, schDtStart)
      .input('schDtEnd', sql.Date, schDtEnd)
      .input('shareVal', sql.Money, shareVal)
      .execute('putWorkPlan');

    // res;
    res
      .status(201)
      .send(`WorkPlan data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating workPlan data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
