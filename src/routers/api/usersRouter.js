const express = require('express');
const path = require('path');
const router = express.Router();

const { catchAsync } = require('../../helpers');

const {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
  uploadFilesController,
} = require('../../controllers/usersController');

const {
  checkRegisterData,
  checkLoginData,
  checkToken,
  checkSubscriptionUpdating,
  uploadFilesMiddleware,
} = require('../../middlewares/usersMiddlewares');

router.post(
  '/register',
  catchAsync(checkRegisterData),
  catchAsync(registerUserController)
);

router.post('/login', checkLoginData, catchAsync(loginUserController));

router.post(
  '/logout',
  catchAsync(checkToken),
  catchAsync(logoutUserController)
);

router.post(
  '/current',
  catchAsync(checkToken),
  catchAsync(currentUserController)
);

router.patch(
  '/',
  catchAsync(checkToken),
  checkSubscriptionUpdating,
  catchAsync(updateSubscriptionController)
);

router.patch(
  '/avatars',
  catchAsync(checkToken),
  uploadFilesMiddleware,
  catchAsync(uploadFilesController)
);

router.use('/download', express.static(path.resolve('./public/avatars')));

module.exports = router;
