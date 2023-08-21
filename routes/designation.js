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

module.exports = router;
