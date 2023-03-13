const {
  AppError,
  validateNewContact,
  validateEditedContact,
} = require('../helpers');

exports.checkNewContactData = (req, _, next) => {
  const { error, value } = validateNewContact(req.body);

  const { name, email, phone } = req.body;

  if (!name) {
    return next(new AppError(400, 'missing required name field'));
  } else if (!email) {
    return next(new AppError(400, 'missing required email field'));
  } else if (!phone) {
    return next(new AppError(400, 'missing required phone field'));
  } else if (error) {
    return next(new AppError(400, error.details[0].message));
  } else {
    req.body = value;
    next();
  }
};

exports.checkEditedContactData = (req, _, next) => {
  const { error, value } = validateEditedContact(req.body);

  if (error) {
    return next(new AppError(400, error.details[0].message));
  } else {
    req.body = value;
    next();
  }
};
