const jwt = require('jsonwebtoken');

const signToken = id => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return token;
};

module.exports = { signToken };
