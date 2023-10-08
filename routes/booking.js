// const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');

router.get('/:empId/:dtId/:m/:y', async (req, res) => {
  try {
    const { empId, dtId, m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('dtId', sql.BigInt, dtId)
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookingsNew2');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Save for now
// router.get('/:empId/:dtId', async (req, res) => {
//   try {
//     const { empId, dtId } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input('empId', sql.Int, empId)
//       .input('dtId', sql.BigInt, dtId)
//       .execute('getBookings');

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
