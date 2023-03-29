const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routers/api/contactsRouter');
const usersRouter = require('./routers/api/usersRouter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.all('*', (_, res) => {
  res.status(404).json({
    message: 'Not Found!',
  });
});

app.use((err, _, res, __) => {
  const { status, message } = err;

  res.status(status || 500).json({ message });
});

module.exports = app;
