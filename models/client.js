const Joi = require('joi');
// id	int
// shortName	nchar(10)
// longName	varchar(100)
// website	varchar(100)
// contactName	varchar(50)
// contactEMail	nvarchar(100)
// contactMobile	bigint
// addLine1	varchar(100)
// street	varchar(50)
// cityId	int

function validateClient(client) {
  const schema = Joi.object({
    shortName: Joi.string().min(3).max(10).required(),
    longName: Joi.string().min(10).max(100).required(),
    website: Joi.string().min(10).max(100).required(),
    contactName: Joi.string().min(10).max(50).required(),
    contactEMail: Joi.string().min(10).max(100).required(),
    contactMobile: Joi.number().min(1000000000).max(9999999999).required(),
    addLine1: Joi.string().min(5).max(100).required(),
    street: Joi.string().min(10).max(50).required(),
    cityId: Joi.number().min(1).max(2000),
  });

  return schema.validate({
    shortName: client.shortName,
    longName: client.longName,
    website: client.website,
    contactName: client.contactName,
    contactEMail: client.contactEMail,
    contactMobile: client.contactMobile,
    addLine1: client.addLine1,
    street: client.street,
    cityId: client.cityId,
  });
}

exports.validate = validateClient;
