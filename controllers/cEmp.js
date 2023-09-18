const sql = require('mssql');
const bcrypt = require('bcrypt');

// const config = {
//   server: 'VERMARNCDBG',
//   database: 'CJIS',
//   user: 'apiUserLogin',
//   password: 'theApiUser',
//   trustServerCertificate: true,
// };
const isOK = async (clearPass, hashPass) => {
  try {
    // const hash = await bcrypt.hash(clearPass, 10);
    const match = await bcrypt.compare(clearPass, hashPass);
    return match;
  } catch (error) {}

  //   console.log(hash, match);
};

const config = require('../db/mssqlDb');

// @Desc:   fetch all Employees
// @Route:  GET localhost:3000/api/emps/
// @Access: Private
exports.getAllEmps = async (req, res, next) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('getEmps');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
};

// @Desc:   insert one employee record
// @Route:  POST localhost:3000/api/emps/
// @Access: Private
exports.addOneEmp = async (req, res, next) => {
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
};

// @Desc:   update an employee's details
// @Route:  PUT localhost:3000/api/emps/:id
// @Access: Private
exports.updateEmp = async (req, res, next) => {
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
};

// @Desc:   delete one Employee
// @Route:  DELETE localhost:3000/api/emps/:id
// @Access: Private
exports.delOneEmp = async (req, res, next) => {
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
};

// @Desc:   fetch one Employee
// @Route:  GET localhost:3000/api/emps/:id
// @Access: Private
exports.getOneEmp = async (req, res, next) => {
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
};

// @Desc:   authenticate one Employee
// @Route:  GET localhost:3000/api/emps/:theEMailId/:thePass
// @Access: Public
// exports.authEmp = async (req, res, next) => {
//   try {
//     const { theEMailId, thePass } = req.params;
//     const pool = await sql.connect(config);
//     const result = await pool
//       .request()
//       .input('theEMailId', sql.VarChar(150), theEMailId)
//       .input('thePass', sql.VarChar(150), thePass)
//       .query('SELECT passwd FROM emp where eMailId = @theEMailId');
//     if (result.recordset.length == 0) {
//       console.log('theResult', result.recordset);
//       res.json([]);
//     } else {
//       console.log(result.recordset);
//       const match = bcrypt.compare(
//         result.recordset[0].passwd,
//         toHash(result.recordset[0].passwd)
//       );
//       if (match) {
//         res.json([{ found: true }]);
//       } else {
//         res.json([]);
//       }
//     }
//     // res.json(result.recordset);
//     // console.log(thePass);
//   } catch (err) {
//     console.error('Error fetching employees:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// @save for now  [and passwd = @thePass]
exports.authEmp = async (req, res, next) => {
  try {
    const { theEMailId, thePass } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('theEMailId', sql.VarChar(150), theEMailId)
      .input('thePass', sql.VarChar(150), thePass)
      .query('SELECT * FROM emp where eMailId = @theEMailId');

    if (result.recordset.length == 0) {
      res.json([]);
      return;
    }
    const empFound = await isOK(thePass, result.recordset[0].passwd);
    // console.log(await isOK(thePass, result.recordset[0].passwd));
    // console.log(thePass, result.recordset[0].passwd);
    if (empFound) {
      res.json(result.recordset);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal Server Error');
  }
};
