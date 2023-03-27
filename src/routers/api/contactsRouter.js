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
  checkAuthAccess,
} = require('../../middlewares/contactsMiddlewares');

const { checkToken } = require('../../middlewares/usersMiddlewares');

router.use(checkToken);

router.get('/', catchAsync(listContactsController));

router.get(
  '/:id',
  catchAsync(checkContactId),
  catchAsync(checkAuthAccess),
  catchAsync(getByIdController)
);

router.post('/', checkNewContactData, catchAsync(addContactController));

router.delete(
  '/:id',
  catchAsync(checkContactId),
  catchAsync(checkAuthAccess),
  catchAsync(removeContactController)
);

router.put(
  '/:id',
  checkEditedContactData,
  catchAsync(checkContactId),
  catchAsync(checkAuthAccess),
  catchAsync(updateContactController)
);

router.patch(
  '/:id/favorite',
  checkEditedStatus,
  catchAsync(checkContactId),
  catchAsync(checkAuthAccess),
  catchAsync(updateStatusContactController)
);

module.exports = router;
