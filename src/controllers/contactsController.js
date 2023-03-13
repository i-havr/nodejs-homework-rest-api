const { AppError, catchAsync } = require('../helpers');

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require('../models/contacts');

exports.listContacts = catchAsync(async (_, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

exports.getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await getById(id);

  return contact
    ? res.status(200).json(contact)
    : next(new AppError(404, 'Not found'));
});

exports.removeContact = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);

  return contact
    ? res.status(200).json({ message: 'contact deleted' })
    : next(new AppError(404, 'Not found'));
});

exports.addContact = catchAsync(async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

exports.updateContact = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length > 0) {
    const contact = await updateContact(id, req.body);

    return contact
      ? res.status(200).json(contact)
      : res.status(404).json({ message: 'Not found' });
  } else {
    return res.status(400).json({ message: 'missing fields' });
  }
});
