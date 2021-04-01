import axios from 'axios';
import { showAlert } from './alert.js';

const stripe = Stripe('pk_test_5RStTWVlGBc4ajEqN8UhsV4300UtmJmKmB');

export const bookTour = async (tourId) => {
  // 1) Get check out session from API
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.sessionServer.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
