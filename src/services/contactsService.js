const { Contact } = require('../models/contactModel');

const listContacts = async (id, filterOptions) => {
  const { skip, paginationLimit, favorite } = filterOptions;
  const findOptions = favorite ? { owner: id, favorite } : { owner: id };

  const contacts = await Contact.find(findOptions)
    .select({ __v: 0 })
    .skip(skip)
    .limit(paginationLimit);

  const total = await Contact.count(findOptions);

  return { total, contacts };
};

const getById = async id => {
  const contact = await Contact.findById(id);
  return contact;
};

const removeContact = async contactId => {
  const removedContact = await Contact.findByIdAndRemove(contactId);
  return removedContact;
};

const addContact = async ({ name, email, phone, owner }) => {
  const contact = new Contact({
    name,
    email,
    phone,
    owner,
  });

  await contact.save();
  return contact;
};

const updateContact = async (contactId, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { $set: body },
    { new: true }
  );
  return updatedContact;
};

const updateStatusContact = async (contactId, body) => {
  return await updateContact(contactId, body);
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
