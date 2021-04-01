const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
