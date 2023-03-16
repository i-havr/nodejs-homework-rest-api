const express = require('express');

const router = express.Router();

const { catchAsync } = require('../../helpers');

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
  checkContactId,
} = require('../../middlewares/contactsMiddlewares');

router.get('/', catchAsync(listContactsController));

router.get('/:id', catchAsync(checkContactId), catchAsync(getByIdController));

router.post('/', checkNewContactData, catchAsync(addContactController));

router.delete(
  '/:id',
  catchAsync(checkContactId),
  catchAsync(removeContactController)
);

router.put(
  '/:id',
  checkEditedContactData,
  catchAsync(checkContactId),
  catchAsync(updateContactController)
);

router.patch(
  '/:id/favorite',
  checkEditedStatus,
  catchAsync(checkContactId),
  catchAsync(updateStatusContactController)
);

module.exports = router;
