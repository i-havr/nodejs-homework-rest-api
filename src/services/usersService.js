const { compare } = require('bcrypt');
const uuid = require('uuid').v4;

const { sendEmail } = require('./sendEmail');

const { User } = require('../models/userModel');

const registerUser = async (email, password) => {
  const user = new User({ email, password });

  const code = uuid();
  user.verificationToken = code;

  await user.save();

  try {
    await sendEmail(email, code);
  } catch (error) {
    console.log(error);
  }

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, verify: true });

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

const updateSubscription = async (id, body) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  );

  return updatedUser;
};

const verifyUserByToken = async verificationToken => {
  const user = await User.findOne({ verificationToken });

  return user;
};

const resendEmailConfirmation = async email => {
  const user = await User.findOne({ email });

  if (user) {
    const { verify, verificationToken } = user;
    !verify && (await sendEmail(email, verificationToken));
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  verifyUserByToken,
  resendEmailConfirmation,
};
