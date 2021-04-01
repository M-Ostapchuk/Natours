const AppError = require('../utiles/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDublicateFields = (err) => {
  const message = `Dublicate field value: ${err.keyValue.name}. Please use enother value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired. Please log in again', 401);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Rendered website
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProduction = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    //a) Operational errors
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //b) Programming errors and other errors
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
  // B) Rendered Website
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //a) Operational errors
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      //b) Programming errors and other errors
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
  return res;
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err.name, process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) {
      error = handleDublicateFields(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (err.name == 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }

    sendErrorProduction(error, req, res);
  }
};
