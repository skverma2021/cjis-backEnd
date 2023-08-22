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
      .query('SELECT id,name, location FROM deptt order by id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching department:', err);
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
        `SELECT id as depttId, name as depttName FROM deptt ORDER BY name`
      );
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
        `SELECT empDeptt.id AS theId,empDeptt.empId AS theEmpId, deptt.name AS theDeptt, CONVERT(VARCHAR(10), empDeptt.fromDt, 111) AS theFromDt
        FROM     empDeptt INNER JOIN
                          deptt ON empDeptt.depttId = deptt.id
        WHERE  (empDeptt.empId = @empId)
        ORDER BY theFromDt DESC`
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employee transfers:', err);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/:transfer', async (req, res) => {
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
      .query(
        'INSERT INTO empDeptt (empId, depttId, fromDt) VALUES (@empId, @depttId, @fromDt)'
      );

    // res;
    res
      .status(201)
      .send(`empDeptt data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting empDeptt data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
