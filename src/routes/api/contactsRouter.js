const express = require('express');

const router = express.Router();

const {
  listContactsController,
  getByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
} = require('../../controllers/contactsController');

const {
  checkNewContactData,
  checkEditedContactData,
  checkEditedStatus,
} = require('../../middlewares/contactsMiddlewares');

router.get('/', listContactsController);

router.get('/:id', getByIdController);

router.post('/', checkNewContactData, addContactController);

router.delete('/:id', removeContactController);

router.put('/:id', checkEditedContactData, updateContactController);

router.patch('/:id/favorite', checkEditedStatus, updateStatusContactController);

module.exports = router;
