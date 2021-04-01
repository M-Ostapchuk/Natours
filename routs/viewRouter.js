const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

router.get(
  '/',
  authController.isUserLoggedIn,
  bookingController.createBookingCheckout,
  viewController.getOverview
);
router.get('/login', authController.isUserLoggedIn, viewController.userLogin);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyBookings
);

// router.post(
//   '/update-user-data',
//   authController.protect,
//   viewController.updateUserData
// );

router.get('/:tourName', authController.isUserLoggedIn, viewController.getTour);

module.exports = router;
