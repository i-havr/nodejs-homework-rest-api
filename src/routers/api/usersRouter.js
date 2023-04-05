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
  verifyUserByTokenController,
  resendEmailConfirmationController,
} = require('../../controllers/usersController');

const {
  checkRegisterData,
  checkLoginData,
  checkToken,
  checkSubscriptionUpdating,
  uploadFilesMiddleware,
  checkResendingEmailConfirmationData,
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

router.get(
  '/verify/:verificationToken',
  catchAsync(verifyUserByTokenController)
);

router.post(
  '/verify',
  checkResendingEmailConfirmationData,
  catchAsync(resendEmailConfirmationController)
);

module.exports = router;
