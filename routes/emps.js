const express = require('express');
const router = express.Router();

const {
  getAllEmps,
  getOneEmp,
  addOneEmp,
  updateEmp,
  delOneEmp,
  authEmp,
} = require('../controllers/cEmp');

router.route('/').get(getAllEmps).post(addOneEmp);
router.route('/:id').get(getOneEmp).put(updateEmp).delete(delOneEmp);
router.route('/:theEMailId/:thePass').get(authEmp);

module.exports = router;
