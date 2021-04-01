const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utiles/catchAsync');
const AppError = require('../utiles/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingsModel');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with this name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My bookings',
    tours,
  });
});

exports.userLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Loggin page',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Welcome to your page',
    user: req.user,
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );

  res.status(200).render('account', {
    title: 'Welcome to your page',
    user: updatedUser,
  });
});
