const { Types } = require('mongoose');

const { Contact } = require('../models/contactModel');

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

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError(400, 'missing fields'));
  } else if (error) {
    return next(new AppError(400, error.details[0].message));
  } else {
    req.body = value;
    next();
  }
};

exports.checkEditedStatus = (req, _, next) => {
  const { error, value } = validateEditedContact(req.body);

  if (Object.keys(req.body).length !== 1 || !req.body.favorite) {
    return next(new AppError(400, 'missing field favorite'));
  } else if (error) {
    return next(new AppError(400, error.details[0].message));
  } else {
    req.body = value;
    next();
  }
};

exports.checkContactId = async (req, _, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) return next(new AppError(404, 'Not found'));

  const contactExists = await Contact.exists({ _id: id });

  if (!contactExists) {
    return next(new AppError(404, 'Not found'));
  }

  next();
};
