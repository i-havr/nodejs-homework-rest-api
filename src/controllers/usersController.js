const { LoginError, UnauthorizedError } = require('../helpers');

const { signToken } = require('../services/signToken');

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require('../services/usersService');

const registerUserController = async (req, res) => {
  const { email, password } = req.body;

  const newUser = await registerUser(email, password);
  res.status(201).json({
    user: newUser,
  });
};

const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  if (user) {
    const { _id, email, subscription } = user;

    const token = signToken(_id);

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

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
};
