const { LoginError, UnauthorizedError } = require('../helpers');

const { signToken } = require('../services/signToken');

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
} = require('../services/usersService');

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

    user.save();

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

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
};
