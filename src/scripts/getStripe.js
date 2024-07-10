import { loadStripe } from '@stripe/stripe-js';

// const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePublicKey = window._env_.REACT_APP_STRIPE_PUBLISHABLE_KEY;

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export default getStripe;
