const Joi = require('joi');

// Validate new contact's data.

exports.validateNewContact = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).email().required(),
    phone: Joi.string().min(5).max(18).required(),
  });
  return schema.validate(data);
};

// Validate new contact's data.

exports.validateEditedContact = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().min(5).max(255).email(),
    phone: Joi.string().min(5).max(18),
  });
  return schema.validate(data);
};
