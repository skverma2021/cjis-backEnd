const { validate } = require('../models/discipline');
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
    const result = await pool.request().query('SELECT * FROM discipline');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching discipline:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { id, description } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('id', sql.TinyInt, id)
      .input('description', sql.VarChar(50), description)
      .query(
        'INSERT INTO discipline (id,description) VALUES (@id,@description)'
      );

    // res;
    res
      .status(201)
      .send(
        `Discipline data inserted successfully ${JSON.stringify(req.body)}`
      );
  } catch (err) {
    console.error('Error inserting discipline data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT route to update employee data
router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    // console.log(id);
    const { description } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Update employee data in the Employees table
    await pool
      .request()
      .input('id', sql.TinyInt, id)
      .input('description', sql.VarChar(50), description)
      .query('UPDATE discipline SET description = @description WHERE id = @id');

    res.send(
      `Discipline data updated successfully ${JSON.stringify(req.body)}`
    );
  } catch (err) {
    console.error('Error updating Discipline data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route to delete a record from the Employee table
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Delete the record from the Employee table
    await pool
      .request()
      .input('id', sql.TinyInt, id)
      .query('DELETE FROM discipline WHERE Id = @Id');

    res.send('Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send('Internal Server Error');
  }
});

// GET one Employee
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.TinyInt, id)
      .query('SELECT * FROM discipline where id = @id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching discipline:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
