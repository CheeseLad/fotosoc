import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY;

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export default getStripe;
