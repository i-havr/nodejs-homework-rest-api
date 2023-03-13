const express = require('express');

const router = express.Router();

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require('../../controllers/contactsController');

const {
  checkNewContactData,
  checkEditedContactData,
} = require('../../middlewares/contactsMiddlewares');

router.get('/', listContacts);

router.get('/:id', getById);

router.post('/', checkNewContactData, addContact);

router.delete('/:id', removeContact);

router.put('/:id', checkEditedContactData, updateContact);

module.exports = router;
