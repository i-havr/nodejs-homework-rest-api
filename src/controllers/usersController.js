const fs = require('fs').promises;

const { LoginError, UnauthorizedError } = require('../helpers');

const { signToken } = require('../services/signToken');

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
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

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
  uploadFilesController,
};
