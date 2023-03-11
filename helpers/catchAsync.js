//  Express request handler wrapper.
//  Catch errors.

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(err => next(err));
};

module.exports = catchAsync;
