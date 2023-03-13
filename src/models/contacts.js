const fs = require('fs/promises');

const { createNextId, updateContactsProperties } = require('../helpers');

const listContacts = async () => {
  const contacts = JSON.parse(await fs.readFile('src/models/contacts.json'));
  return contacts;
};

const getById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id === contactId);
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id === contactId);

  if (contact) {
    const newContacts = contacts.filter(contact => contact.id !== contactId);

    await fs.writeFile('src/models/contacts.json', JSON.stringify(newContacts));
  }
  return contact;
};

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts();

  const newContact = {
    id: createNextId(contacts),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await fs.writeFile('src/models/contacts.json', JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id === contactId);

  if (contact) {
    updateContactsProperties(contact, body);
    await fs.writeFile('src/models/contacts.json', JSON.stringify(contacts));
  }
  return contact;
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
