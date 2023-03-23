const express = require('express');

const router = express.Router();

const { catchAsync } = require('../../helpers');

const {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
} = require('../../controllers/usersController');

const {
  checkRegisterData,
  checkLoginData,
  checkToken,
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

module.exports = router;
