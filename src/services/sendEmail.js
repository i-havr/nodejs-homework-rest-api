require('dotenv').config();

const PORT = process.env.PORT || 3000;
const FROM = process.env.FROM;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, code) => {
  const msg = {
    to: email,
    from: FROM,
    subject: 'Thank you for registration!',
    text: `Please confirm your email address GET http://localhost:${PORT}/api/users/verify/${code}`,
    html: `Please <a href="http://localhost:${PORT}/api/users/verify/${code}">confirm</a> your email address`,
  };

  await sgMail.send(msg);
};

module.exports = { sendEmail };
