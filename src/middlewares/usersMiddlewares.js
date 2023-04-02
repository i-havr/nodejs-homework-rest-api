const jwt = require('jsonwebtoken');

const ImageService = require('../services/imageService');

const { User } = require('../models/userModel');

const {
  AppError,
  UnauthorizedError,
  EmailConflictError,
  validateUserData,
  validateSubscriptionUpdateData,
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

  if (!token || tokenType !== 'Bearer') {
    return next(new UnauthorizedError());
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    if (userData) {
      const { id } = userData;

      const user = await User.findById(id).select({
        __v: 0,
        token: 0,
        password: 0,
      });

      req.user = user;
      next();
    } else {
      req.token = null;
      return next(new UnauthorizedError());
    }
  } catch (error) {
    return next(new UnauthorizedError());
  }
};

const checkSubscriptionUpdating = (req, _, next) => {
  const { error, value } = validateSubscriptionUpdateData(req.body);

  if (error) {
    return next(
      new AppError(400, error.details[0].context.key + ' data is not valid')
    );
  } else {
    req.body = value;
    next();
  }
};

const uploadFilesMiddleware = ImageService.upload('avatar');

module.exports = {
  checkRegisterData,
  checkLoginData,
  checkToken,
  checkSubscriptionUpdating,
  uploadFilesMiddleware,
};
