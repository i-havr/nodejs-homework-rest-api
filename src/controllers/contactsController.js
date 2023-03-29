const { AppError } = require('../helpers');

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../services/contactsService');

const listContactsController = async (req, res) => {
  const { page, limit, favorite } = req.query;

  const { id } = req.user;

  const paginationPage = +page || 1;
  let paginationLimit = +limit || 20;
  paginationLimit = paginationLimit > 20 ? 20 : paginationLimit;
  const skip = (paginationPage - 1) * paginationLimit;

  const filterOptions = favorite
    ? { skip, paginationLimit, favorite }
    : { skip, paginationLimit };

  const { total, contacts } = await listContacts(id, filterOptions);

  res
    .status(200)
    .json({ total, page: paginationPage, limit: paginationLimit, contacts });
};

const getByIdController = async (req, res, next) => {
  const { id } = req.params;

  const contact = await getById(id);

  return contact
    ? res.status(200).json(contact)
    : next(new AppError(404, 'Not found'));
};

const removeContactController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);

  return contact
    ? res.status(200).json({ message: 'contact deleted' })
    : next(new AppError(404, 'Not found'));
};

const addContactController = async (req, res) => {
  const newContactData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    owner: req.user,
  };
  const newContact = await addContact(newContactData);

  res.status(201).json(newContact);
};

const updateContactController = async (req, res) => {
  const { id } = req.params;
  const contact = await updateContact(id, req.body);

  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: 'Not found' });
};

const updateStatusContactController = async (req, res) => {
  const { id } = req.params;
  const contact = await updateStatusContact(id, req.body);

  return contact
    ? res.status(200).json(contact)
    : res.status(404).json({ message: 'Not found' });
};

module.exports = {
  listContactsController,
  getByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
};
