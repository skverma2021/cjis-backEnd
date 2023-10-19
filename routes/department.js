const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getDepartments');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching department:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/short', async (req, res) => {
  // const { mode } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`getDepartmentsShort`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching departments:', err);
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

router.get('/empdeptt/:empId', async (req, res) => {
  const { empId } = req.params;
  // if (trail !== 'trail') empId = 1;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      // .input('trail', sql.VarChar(5), trail)
      .execute(`getEmpDepttTrail`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employee transfers:', err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/empdeptt', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, depttId, fromDt } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('depttId', sql.Int, depttId)
      .input('fromDt', sql.Date, fromDt)
      .execute('postEmpDeptt');

    // res;
    res
      .status(201)
      .send(`empDeptt data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting empDeptt data:', err);
    res.status(500).send('Internal Server Error');
  }
});

const checkEmpDepttParameter = (req, res, next) => {
  const validEmpDepttValue = 'empDeptt'; // The valid value for 'trail'
  const userEmpDepttValue = req.params.empDeptt; // The value provided by the user

  if (userEmpDepttValue !== validEmpDepttValue) {
    return res.json([]); // Return an empty array if 'trail' is not the expected value
  }

  next(); // Proceed to the route handler if the 'trail' value is correct
};
router.delete('/empdeptt/:id', async (req, res) => {
  // console.log('Hi');
  try {
    const { id } = req.params;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Delete the record from the Client table
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM empDeptt WHERE id = @id');

    res.send('Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/empdeptt/:id', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const { empId, depttId, fromDt } = req.body;
    // console.log(empId, depttId, fromDt);
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('empId', sql.Int, empId)
      .input('depttId', sql.Int, depttId)
      .input('fromDt', sql.Date, fromDt)
      .execute('putEmpDeptt');

    res
      .status(201)
      .send(`empDeptt data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating empDeptt data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
