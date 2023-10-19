const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getDesignations');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching designations:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:short', async (req, res) => {
  const { mode } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`getDesignationsShort`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching designations:', err);
    res.status(500).send('Internal Server Error');
  }
});

const checkTrailParameter = (req, res, next) => {
  const validTrailValue = 'trail'; // The valid value for 'trail'
  const userTrailValue = req.params.trail; // The value provided by the user

  if (userTrailValue !== validTrailValue) {
    return res.json([]); // Return an empty array if 'trail' is not the expected value
  }

  next(); // Proceed to the route handler if the 'trail' value is correct
};

router.get('/trail/:empId', async (req, res) => {
  const { empId } = req.params;
  // if (trail !== 'trail') empId = 1;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      // .input('trail', sql.VarChar(5), trail)
      .execute(`getEmpDesigTrail`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employee designations:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/empdesig', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, desigId, fromDt } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('desigId', sql.Int, desigId)
      .input('fromDt', sql.Date, fromDt)
      .execute('postEmpDesig');

    // res;
    res
      .status(201)
      .send(`empDesig data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting empDesig data:', err);
    res.status(500).send('Internal Server Error');
  }
});

const checkEmpDesigParameter = (req, res, next) => {
  const validEmpDesigValue = 'empDesig'; // The valid value for 'trail'
  const userEmpDesigValue = req.params.empDesig; // The value provided by the user

  if (userEmpDesigValue !== validEmpDesigValue) {
    return res.json([]); // Return an empty array if 'trail' is not the expected value
  }

  next(); // Proceed to the route handler if the 'trail' value is correct
};
router.delete('/empDesig/:id', async (req, res) => {
  // console.log('Hi');
  try {
    const { id } = req.params;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Delete the record from the Client table
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM empDesig WHERE id = @id');

    res.send('Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send('Internal Server Error');
  }
});

// update empDesig
router.put('/empDesig/:id', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const { empId, desigId, fromDt } = req.body;
    // console.log(empId, desigId, fromDt);
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('empId', sql.Int, empId)
      .input('desigId', sql.Int, desigId)
      .input('fromDt', sql.Date, fromDt)
      .execute('putEmpDesig');

    res
      .status(201)
      .send(`empDesig data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating empDesig data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
