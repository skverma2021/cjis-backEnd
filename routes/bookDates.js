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

// router.get('/:month/:year', async (req, res) => {
//   const { month, year } = req.params;

//   try {
//     // Connect to the database
//     await sql.connect(config);

//     // Call the stored procedure and pass the parameters
//     const result = await sql.query`EXEC GetDaysInMonth @InputMonth = ${parseInt(
//       month
//     )}, @InputYear = ${parseInt(year)}`;

//     // Extract the result from the recordset
//     const daysInMonth = result.recordset.map((record) => record.Date);

//     // Close the database connection
//     await sql.close();

//     // Return the result as JSON
//     res.json({ daysInMonth });
//   } catch (error) {
//     console.error('Error executing stored procedure:', error);
//     res.status(500).json({ error: 'Error executing stored procedure' });
//   }
// });

router.get('/:m/:y', async (req, res) => {
  try {
    const { m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookingDates');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching bookHeads:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
