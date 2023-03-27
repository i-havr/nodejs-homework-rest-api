const Joi = require('joi');

const subEnum = require('../constants/subscriptions');

exports.validateNewContact = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).email().required(),
    phone: Joi.string().min(5).max(18).required(),
    favorite: Joi.bool(),
  });
  return schema.validate(data);
};

exports.validateEditedContact = data => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().min(5).max(255).email(),
    phone: Joi.string().min(5).max(18),
    favorite: Joi.bool(),
  });
  return schema.validate(data);
};

exports.validateUserData = data => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });
  return schema.validate(data);
};

exports.validateSubscriptionUpdateData = data => {
  const schema = Joi.object({
    subscription: Joi.string()
      .valid(...Object.values(subEnum))
      .required(),
  });
  return schema.validate(data);
};
