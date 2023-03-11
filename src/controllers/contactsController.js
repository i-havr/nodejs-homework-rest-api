const fs = require('fs').promises;

const {
  AppError,
  catchAsync,
  updateContactsProperties,
  createNextId,
} = require('../helpers');

const listContacts = catchAsync(async (_, res) => {
  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));
  res.status(200).json(contacts);
});

const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));
  const contact = contacts.find(contact => contact.id === id);
  return contact
    ? res.status(200).json(contact)
    : next(new AppError(404, 'Not found'));
});

const removeContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));

  const contact = contacts.find(contact => contact.id === id);

  if (contact) {
    const newContacts = contacts.filter(contact => contact.id !== id);

    await fs.writeFile('src/models/contacts.json', JSON.stringify(newContacts));

    res.status(200).json({ message: 'contact deleted' });
  } else {
    next(new AppError(404, 'Not found'));
  }
});

const addContact = catchAsync(async (req, res) => {
  const { name, email, phone } = req.body;

  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));

  const newContact = {
    id: createNextId(contacts),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile('src/models/contacts.json', JSON.stringify(contacts));

  res.status(201).json(newContact);
});

const updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;

  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));
  const contact = contacts.find(contact => contact.id === id);

  if (!contact) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'missing fields' });
  } else {
    updateContactsProperties(contact, req.body);
    res.status(200).json(contact);

    await fs.writeFile('src/models/contacts.json', JSON.stringify(contacts));
  }
});

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
