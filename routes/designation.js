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
        'SELECT id,description,theDiscp,theHourlyRate,theGrade FROM designation order by theDiscp, theGrade'
      );
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
    const result = await pool
      .request()
      .query(
        `SELECT designation.id as theDesigId, concat('[',designation.description,'] ', '[',discipline.description,'] ' ,'[', grade.description ,'] ','[', grade.hourlyRate,']') as theDescription FROM designation INNER JOIN discipline ON designation.discpId = discipline.id INNER JOIN grade ON designation.gradeId = grade.id order by discipline.description,grade.description`
      );
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

router.get('/:empId/:trail', checkTrailParameter, async (req, res) => {
  const { empId, trail } = req.params;
  // if (trail !== 'trail') empId = 1;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('trail', sql.VarChar(5), trail)
      .query(
        `SELECT empDesig.id AS theId,designation.id as theDesigId,empDesig.empId AS theEmpId, discipline.description AS theDiscp, grade.description AS theGrade, grade.hourlyRate AS theHourlyRate, designation.description AS theDesig, CONVERT(VARCHAR(10), empDesig.fromDt, 111) as theFromDt
        FROM     empDesig INNER JOIN
                          designation ON empDesig.desigId = designation.id INNER JOIN
                          discipline ON designation.discpId = discipline.id INNER JOIN
                          grade ON designation.gradeId = grade.id
        WHERE  (empDesig.empId = @empId)
        ORDER BY theFromDt DESC`
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employee designations:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/:posting', async (req, res) => {
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
      .query(
        'INSERT INTO empDesig (empId, desigId, fromDt) VALUES (@empId, @desigId, @fromDt)'
      );

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
router.delete('/:id/:empDesig', checkEmpDesigParameter, async (req, res) => {
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
router.put('/:id/:empDesig', checkEmpDesigParameter, async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const { empId, desigId, fromDt } = req.body;
    console.log(empId, desigId, fromDt);
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('empId', sql.Int, empId)
      .input('desigId', sql.Int, desigId)
      .input('fromDt', sql.Date, fromDt)
      .query(
        'UPDATE empDesig SET empId = @empId, desigId = @desigId, fromDt = @fromDt WHERE id = @id'
      );

    res
      .status(201)
      .send(`empDesig data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating empDesig data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
