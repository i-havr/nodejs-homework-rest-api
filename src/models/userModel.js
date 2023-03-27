const mongoose = require('mongoose');

const subEnum = require('../constants/subscriptions');

const { hash } = require('bcrypt');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  subscription: {
    type: String,
    enum: Object.values(subEnum),
    default: subEnum.STARTER,
  },
  token: String,
});

userSchema.pre('save', async function () {
  if (this.isNew) {
    this.password = await hash(this.password, 10);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
