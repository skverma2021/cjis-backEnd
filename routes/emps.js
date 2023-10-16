const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configJwt = require('config');
const auth = require('../middleware/auth');

const isOK = async (clearPass, hashPass) => {
  try {
    // const hash = await bcrypt.hash(clearPass, 10);
    const match = await bcrypt.compare(clearPass, hashPass);
    return match;
  } catch (error) {}

  //   console.log(hash, match);
};

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('getEmps');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/summDG', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabDepttGradeEmpCount');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/summDA', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabdepttEmpAgeGroup');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
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

    const hashPass = await bcrypt.hash(passwd, 10);
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
      .input('passwd', sql.VarChar(150), hashPass)

      .execute('postEmp');

    // res;
    res
      .status(201)
      .send(`Employee data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error inserting employee data:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  // const token = req.header('Authorization');
  // if (!token) {
  //   return res.status(401).json({ msg: 'No token provided' });
  // }
  // const tokenValue = token.replace('Bearer ', '');
  // const decoded = jwt.verify(tokenValue, configJwt.get('jwtPrivateKey'));
  // if (!decoded) {
  //   return res.status(400).send('Invalid Token');
  // }
  console.log(req.user, req.elapsedTime, 'sec');
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
    const hashPass = await bcrypt.hash(passwd, 10);

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
      .input('passwd', sql.VarChar(150), hashPass)
      .query(
        'UPDATE emp SET uId = @uId, fName = @fName, mName = @mName, sName = @sName, title = @title, dob = @dob, gender = @gender,addLine1 = @addLine1, cityId = @cityId, mobile = @mobile, eMailId = @eMailId,passwd = @passwd WHERE id = @id'
      );

    res.send(`Employee data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.error('Error updating employee data:', err);
    res.status(500).send('Internal Server Error');
  }
});

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
      .input('thePass', sql.VarChar(150), thePass).query(`SELECT emp.id AS eID, 
                    emp.empFullName AS eName, 
                    emp.curDesig as eDesigID,
                    designation.description AS eDesig, 
                    grade.description AS eGrade, 
                    emp.curDeptt as eDepttID,
                    deptt.name AS eDeptt, 
                    emp.passwd AS ePass
              FROM     emp INNER JOIN
                    deptt ON emp.curDeptt = deptt.id INNER JOIN
                    grade INNER JOIN
                    designation ON grade.id = designation.gradeId ON emp.curDesig = designation.id
              WHERE  (emp.eMailId = @theEMailId)`);

    if (result.recordset.length == 0) {
      res.json([]);
      return;
    }
    const empFound = await isOK(thePass, result.recordset[0].ePass);
    // console.log(await isOK(thePass, result.recordset[0].passwd));
    // console.log(thePass, result.recordset[0].passwd);
    if (empFound) {
      const eRec = result.recordset[0];
      delete eRec.ePass;
      // new
      // const payload = {
      //   sub: eRec,
      //   iat: Math.floor(Date.now() / 1000),
      //   exp: Math.floor(Date.now() / 1000) + 60,
      // };

      // old
      const token = jwt.sign(eRec, configJwt.get('jwtPrivateKey'));
      // const token = jwt.sign(payload, configJwt.get('jwtPrivateKey'));

      res.json([{ msg: 'authenticated successfuly', token: token }]);
      // res.json(result.recordset);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
