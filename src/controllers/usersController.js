const fs = require('fs').promises;

const { AppError, LoginError, UnauthorizedError } = require('../helpers');

const { signToken } = require('../services/signToken');

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  verifyUserByToken,
  resendEmailConfirmation,
} = require('../services/usersService');

const ImageService = require('../services/imageService');

const registerUserController = async (req, res) => {
  const { email, password } = req.body;

  const { subscription } = await registerUser(email, password);

  res.status(201).json({
    user: { email, subscription },
  });
};

const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  if (user) {
    const { _id, email, subscription } = user;

    const token = signToken(_id);

    user.token = token;

    await user.save();

    return res.status(200).json({
      token,
      user: { email, subscription },
    });
  } else {
    return next(new LoginError());
  }
};

const logoutUserController = async (req, res, next) => {
  const { _id } = req.user;

  const user = await logoutUser(_id);

  if (user) {
    user.token = undefined;
    user.save();
    return res.status(204).send();
  } else {
    return next(new UnauthorizedError());
  }
};

const currentUserController = async (req, res, next) => {
  const { _id } = req.user;

  const user = await getCurrentUser(_id);

  if (user) {
    const { email, subscription } = user;

    return res.status(200).json({
      email,
      subscription,
    });
  } else {
    return next(new UnauthorizedError());
  }
};

const updateSubscriptionController = async (req, res, next) => {
  const { _id } = req.user;

  const user = await updateSubscription(_id, req.body);

  if (user) {
    const { email, subscription } = user;

    return res.status(200).json({
      email,
      subscription,
    });
  } else {
    return next(new UnauthorizedError());
  }
};

const uploadFilesController = async (req, res) => {
  const { file, user } = req;

  if (file) {
    user.avatarURL = (
      await ImageService.save(file, 'avatars', user.id)
    ).replace(/\\/g, '/');

    await user.save();

    fs.unlink(file.path);
  }

  return res.status(200).json({
    avatarURL: user.avatarURL,
  });
};

const verifyUserByTokenController = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await verifyUserByToken(verificationToken);

  if (user) {
    user.verify = true;
    user.verificationToken = null;

    await user.save();

    return res.status(200).json({
      message: 'Verification successful',
    });
  } else {
    return next(new AppError(404, 'User not found'));
  }
};

const resendEmailConfirmationController = async (req, res, next) => {
  const { email } = req.body;

  const user = await resendEmailConfirmation(email);

  if (user) {
    const { verify } = user;

    if (verify) {
      return next(new AppError(400, 'Verification has already been passed'));
    }

    user.verify = true;
    user.verificationToken = null;

    await user.save();

    return res.status(200).json({
      message: 'Verification email sent',
    });
  } else {
    return next(new AppError(404, 'User not found'));
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
  uploadFilesController,
  verifyUserByTokenController,
  resendEmailConfirmationController,
};
