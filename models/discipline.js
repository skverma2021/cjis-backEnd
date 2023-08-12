const Joi = require('joi');

function validateDiscp(discp) {
  const schema = Joi.object({
    // id: Joi.number().min(1).max(10).required(),
    description: Joi.string().min(3).max(50).required(),
  });
  return schema.validate({
    // id: discp.id,
    description: discp.description,
  });
}

exports.validate = validateDiscp;
