const express = require('express');
const tourRouter = require('./routs/tourRouter');
const userRouter = require('./routs/userRouter');
const reviewRouter = require('./routs/reviewRouter');
const bookingRouter = require('./routs/bookingRouter');
const morgan = require('morgan');
const AppError = require('./utiles/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const viewRouter = require('./routs/viewRouter');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': [
        "'self'",
        'https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js',
        'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        'blob: *',
      ],
      'connect-src': ['*.mapbox.com', '*'],
      'frame-src': ['https://js.stripe.com/v3/'],
    },
  })
);

// Data sanitization against NoSLQ data injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'maxGroupSize',
      'ratingsAvarage',
      'ratingsQuantity',
    ],
  })
);

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try it again in an hour',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api', limiter);

// ROUTES
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The forest hiker',
//     user: 'Maxim Ostapchuk'
//   });
// });

app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't fint ${req.originalUrl} on this server!`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  next(new AppError(`Can't fint ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
