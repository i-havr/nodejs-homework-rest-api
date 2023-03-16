const catchAsync = controller => (req, res, next) => {
  controller(req, res, next).catch(err => next(err));
};

module.exports = catchAsync;

// Another way of recording

// const catchAsync = controller => {
//   return (req, res, next) => {
//     controller(req, res).catch(next);
//   };
// };
