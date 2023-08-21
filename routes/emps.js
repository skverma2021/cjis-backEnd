const { validate } = require('../models/emp');
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
        'SELECT emp.id, emp.id as id1, emp.id as id2, emp.id as id3, emp.empFullName, CONVERT(VARCHAR(10), emp.dob, 111) as theDob, day(emp.dob) as theDay,month(emp.dob) as theMonth,year(emp.dob) as theYear, emp.addLine1, emp.mobile, emp.eMailId, cities.cityName AS theCity, deptt.name AS theDeptt, designation.description AS theDesig FROM     emp INNER JOIN cities ON emp.cityId = cities.id INNER JOIN deptt ON emp.curDeptt = deptt.id INNER JOIN designation ON emp.curDesig = designation.id'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route to insert employee data
router.post('/', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const {
      uId,
      fName,
      mName,
      sName,
      title,
      dob,
      gender,
      addLine1,
      cityId,
      mobile,
      eMailId,
      passwd,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert employee data into the Employees table
    await pool
      .request()
      .input('uId', sql.BigInt, uId)
      .input('fName', sql.VarChar(50), fName)
      .input('mName', sql.VarChar(50), mName)
      .input('sName', sql.VarChar(50), sName)
      .input('title', sql.NChar(3), title)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NChar(1), gender)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('cityId', sql.Int, cityId)
      .input('mobile', sql.BigInt, mobile)
      .input('eMailId', sql.VarChar(150), eMailId)
      .input('passwd', sql.VarChar(150), passwd)

      .query(
        'INSERT INTO emp (uId,fName,mName,sName,title,dob,gender,addLine1,cityId,mobile,eMailId,passwd) VALUES (@uId,@fName,@mName,@sName,@title,@dob,@gender,@addLine1,@cityId,@mobile,@eMailId,@passwd)'
      );

    // res;
    res
      .status(201)
      .send(`Employee data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting employee data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT route to update employee data
router.put('/:id', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    // console.log(id);
    const {
      uId,
      fName,
      mName,
      sName,
      title,
      dob,
      gender,
      addLine1,
      cityId,
      mobile,
      eMailId,
      passwd,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Update employee data in the Employees table
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('uId', sql.BigInt, uId)
      .input('fName', sql.VarChar(50), fName)
      .input('mName', sql.VarChar(50), mName)
      .input('sName', sql.VarChar(50), sName)
      .input('title', sql.NChar(3), title)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NChar(1), gender)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('cityId', sql.Int, cityId)
      .input('mobile', sql.BigInt, mobile)
      .input('eMailId', sql.VarChar(150), eMailId)
      .input('passwd', sql.VarChar(150), passwd)
      .query(
        'UPDATE emp SET uId = @uId, fName = @fName, mName = @mName, sName = @sName, title = @title, dob = @dob, gender = @gender,addLine1 = @addLine1, cityId = @cityId, mobile = @mobile, eMailId = @eMailId,passwd = @passwd WHERE id = @id'
      );

    res.send(`Employee data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating employee data:', err);
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
      .input('id', sql.Int, id)
      .query('DELETE FROM emp WHERE Id = @Id');

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
      .input('id', sql.Int, id)
      .query('SELECT * FROM emp where id = @id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/:theEMailId/:thePass', async (req, res) => {
  try {
    const { theEMailId, thePass } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('theEMailId', sql.VarChar(150), theEMailId)
      .input('thePass', sql.VarChar(150), thePass)
      .query(
        'SELECT * FROM emp where eMailId = @theEMailId and passwd = @thePass'
      );
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
