const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} —`, err.message);
  // eg. [ERROR] GET /api/users — User not found


  const status  = err.statusCode || 500;
  const message = err.message    || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
  });
  /* eg.
    {
  "success": false,
  "message": "User not found"
    } */
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise
      .resolve(fn(req, res, next))
      .catch((error) => next(error));
  };
};

module.exports = { errorHandler, asyncHandler };