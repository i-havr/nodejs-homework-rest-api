const mongoose = require('mongoose');

const subEnum = require('../constants/subscriptions');

const { hash } = require('bcrypt');

const crypto = require('crypto');

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
  token: {
    type: String,
    default: '',
  },
  avatarURL: String,
});

userSchema.pre('save', async function () {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpeg?d=robohash`;

    this.password = await hash(this.password, 10);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
