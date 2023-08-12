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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().input('id', sql.Int, id).query(`
      SELECT
          emp.id AS theEmpId,
          emp.empFullName AS theName,
          designation.description AS theDesig,
          grade.description AS theGrade,
          deptt.name AS theDeptt,
          discipline.description AS theDiscp,
          grade.hourlyRate AS theHrRate,
          curWorkPlans = (SELECT COUNT(workPlan.id) AS numberWorkPlans FROM     emp INNER JOIN workPlan ON emp.curDeptt = workPlan.depttId WHERE  (emp.id = @id))
      FROM     deptt INNER JOIN
                        emp ON deptt.id = emp.curDeptt INNER JOIN
                        discipline INNER JOIN
                        designation ON discipline.id = designation.discpId ON emp.curDesig = designation.id INNER JOIN
                        grade ON designation.gradeId = grade.id
      WHERE  (emp.id = @id)
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching empDetails:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
