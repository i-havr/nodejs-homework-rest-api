const { Contact } = require('../models/contactModel');

const listContacts = async () => {
  console.log(Contact);
  const contacts = await Contact.find();
  return contacts;
};

const getById = async contactId => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const removeContact = async contactId => {
  const removedContact = await Contact.findByIdAndRemove(contactId);
  return removedContact;
};

const addContact = async ({ name, email, phone }) => {
  const contact = new Contact({
    name,
    email,
    phone,
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
