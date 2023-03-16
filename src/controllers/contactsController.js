const { AppError, catchAsync } = require('../helpers');

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../services/contactsService');

exports.listContactsController = catchAsync(async (_, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

exports.getByIdController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contact = await getById(id);

  return contact
    ? res.status(200).json(contact)
    : next(new AppError(404, 'Not found'));
});

exports.removeContactController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);

  return contact
    ? res.status(200).json({ message: 'contact deleted' })
    : next(new AppError(404, 'Not found'));
});

exports.addContactController = catchAsync(async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

exports.updateContactController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contact = await updateContact(id, req.body);

  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: 'Not found' });
});

exports.updateStatusContactController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const contact = await updateStatusContact(id, req.body);

  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: 'Not found' });
});
