const Joi = require('joi');
// id	int
// description	varchar(50)
// clientId	int
// ordDateStart	date
// ordDateEnd	date
// ordValue	money

function validateJob(job) {
  const schema = Joi.object({
    description: Joi.string().min(3).max(50).required(),
    clientId: Joi.number().min(1).max(2000),
    ordDateStart: Joi.date().required(),
    ordDateEnd: Joi.date(),
    ordValue: Joi.number().required(),
  });

  return schema.validate({
    description: job.description,
    clientId: job.clientId,
    ordDateStart: job.ordDateStart,
    ordDateEnd: job.ordDateEnd,
    ordValue: job.ordValue,
  });
}

exports.validate = validateJob;
