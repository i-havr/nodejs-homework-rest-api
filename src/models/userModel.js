const mongoose = require('mongoose');

const { hash } = require('bcrypt');

const { AppError } = require('../helpers');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
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
