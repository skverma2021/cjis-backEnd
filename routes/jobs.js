const { validate } = require('../models/job');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getAllJobs');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { description, clientId, ordDateStart, ordDateEnd, ordValue } =
      req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    await pool
      .request()
      .input('description', sql.VarChar(50), description)
      .input('clientId', sql.Int, clientId)
      .input('ordDateStart', sql.Date, ordDateStart)
      .input('ordDateEnd', sql.Date, ordDateEnd)
      .input('ordValue', sql.Money, ordValue)
      .execute('postJob');
    res
      .status(201)
      .send(`Job data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting Job data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT route to insert city data
router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const { description, clientId, ordDateStart, ordDateEnd, ordValue } =
      req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('description', sql.VarChar(50), description)
      .input('clientId', sql.Int, clientId)
      .input('ordDateStart', sql.Date, ordDateStart)
      .input('ordDateEnd', sql.Date, ordDateEnd)
      .input('ordValue', sql.Money, ordValue)
      .execute('putJob');

    res
      .status(201)
      .send(`Job data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting job data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route to delete a record from the Job table
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Delete the record from the Employee table
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM job WHERE Id = @Id');

    res.send('Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET one Job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM job where id = @id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching Job:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
