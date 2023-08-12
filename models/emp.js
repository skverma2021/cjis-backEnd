const Joi = require('joi');

function validateEmp(emp) {
  const schema = Joi.object({
    uId: Joi.number().min(100000000).max(999999999).required(),
    fName: Joi.string().min(3).max(50).required(),
    mName: Joi.string().min(3).max(50),
    sName: Joi.string().min(3).max(50),
    title: Joi.string().min(2).max(3),
    dob: Joi.date().less('2004-01-01').required(),
    gender: Joi.string().max(1).min(1).required(),
    addLine1: Joi.string().min(5).max(100).required(),
    cityId: Joi.number().min(1).max(2000),
    mobile: Joi.number().min(1000000000).max(9999999999).required(),
    eMailId: Joi.string().email().required(),
    passwd: Joi.string().min(6).max(9).required(),
  });
  return schema.validate({
    uId: emp.uId,
    fName: emp.fName,
    mName: emp.mName,
    sName: emp.sName,
    title: emp.title,
    dob: emp.dob,
    gender: emp.gender,
    addLine1: emp.addLine1,
    cityId: emp.cityId,
    mobile: emp.mobile,
    eMailId: emp.eMailId,
    passwd: emp.passwd,
  });
}

exports.validate = validateEmp;
