const { compare } = require('bcrypt');

const { User } = require('../models/userModel');

const registerUser = async (email, password) => {
  const user = new User({ email, password });

  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user) {
    return (await compare(password, user.password)) ? user : null;
  }

  return user;
};

const logoutUser = async id => {
  const user = await User.findOne({ _id: id });

  return user;
};

const getCurrentUser = async id => {
  const user = await User.findOne({ _id: id });

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
