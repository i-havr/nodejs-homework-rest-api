const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contactsRouter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.all('*', (_, res) => {
  res.status(404).json({
    msg: 'Not Found!',
  });
});

app.use((err, _, res, __) => {
  const { status } = err;

  res.status(status || 500).json({ message: err.message });
});

module.exports = app;