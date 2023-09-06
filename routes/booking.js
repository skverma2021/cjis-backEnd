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

router.get('/:empId/:dtId', async (req, res) => {
  try {
    const { empId, dtId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('dtId', sql.BigInt, dtId)
      .execute('getBookings');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).send('Internal Server Error');
  }
});

// router.get('/:empId/:dtId', async (req, res) => {
//   try {
//     const { empId, dtId } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input('empId', sql.Int, empId)
//       .input('dtId', sql.BigInt, dtId).query(`
//       SELECT A.id as theWpId,
//         theBooking = isnull((select C.booking
//                 from bookings C
//                 where ((C.workPlanId = A.id) and (C.dateId = @dtId))), ''),
//         toUpd = (select count(*)
//           from bookings C
//           where ((C.workPlanId = A.id) and (C.dateId = @dtId)))
//       FROM     workPlan A INNER JOIN emp B ON A.depttId = B.curDeptt
//       WHERE  (B.id = @empId)
//       order by theWpId
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching booking:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// POST route to insert booking data
router.post('/', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, workPlanId, dateId, booking } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert booking data into the bookings table
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('workPlanId', sql.Int, workPlanId)
      .input('dateId', sql.BigInt, dateId)
      .input('booking', sql.Float, booking)
      .execute('postBookings');

    // res;
    res
      .status(201)
      .send(`Booking data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting booking data:', err);
    res.status(500).send('Internal Server Error');
  }
});
// PUT route to insert booking data
router.put('/', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, workPlanId, dateId, booking } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert booking data into the bookings table
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('workPlanId', sql.Int, workPlanId)
      .input('dateId', sql.BigInt, dateId)
      .input('booking', sql.Float, booking)
      .execute('putBookings');

    res;
    res.send(`Booking data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating booking data:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
