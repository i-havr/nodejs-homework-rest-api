const jwt = require('jsonwebtoken');

const { User } = require('../models/userModel');

const {
  AppError,
  UnauthorizedError,
  EmailConflictError,
  validateUserData,
} = require('../helpers');

const checkRegisterData = async (req, _, next) => {
  const { error, value } = validateUserData(req.body);

  const { email, password } = req.body;

  if (!email) {
    return next(new AppError(400, 'missing required [email] field'));
  } else if (!password) {
    return next(new AppError(400, 'missing required [password] field'));
  } else if (error) {
    return next(
      new AppError(400, error.details[0].context.key + ' field is not valid')
    );
  } else if (await User.exists({ email })) {
    return next(new EmailConflictError());
  } else {
    req.body = value;
    next();
  }
};

const checkLoginData = async (req, _, next) => {
  const { error, value } = validateUserData(req.body);

  const { email, password } = req.body;

  if (!email) {
    return next(new AppError(400, 'missing required [email] field'));
  } else if (!password) {
    return next(new AppError(400, 'missing required [password] field'));
  } else if (error) {
    return next(
      new AppError(400, error.details[0].context.key + ' field is not valid')
    );
  } else {
    req.body = value;
    next();
  }
};

const checkToken = async (req, _, next) => {
  const [tokenType, token] = req.headers.authorization?.split(' ');

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    if (userData) {
      const { id } = userData;

      const user = await User.findById(id);

      req.user = user;
      next();
    } else {
      return next(new UnauthorizedError());
    }
  } catch (error) {
    return next(new UnauthorizedError());
  }
};

module.exports = { checkRegisterData, checkLoginData, checkToken };
