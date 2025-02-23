export const isProduction = process.env.NODE_ENV === 'production';

export const STRIPE_PUBLISHABLE_KEY = isProduction
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD
  : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;

export const STRIPE_SECRET_KEY = isProduction
  ? process.env.STRIPE_SECRET_KEY_PROD
  : process.env.STRIPE_SECRET_KEY_TEST;

  {/*
  console.log("Loading Stripe Config...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("STRIPE_PRICE_MONTHLY_TEST:", process.env.STRIPE_PRICE_MONTHLY_TEST);
  console.log("STRIPE_PRICE_MONTHLY_PROD:", process.env.STRIPE_PRICE_MONTHLY_PROD);
  console.log("STRIPE_PRICE_ANNUALLY_TEST:", process.env.STRIPE_PRICE_ANNUALLY_TEST);
  console.log("STRIPE_PRICE_ANNUALLY_PROD:", process.env.STRIPE_PRICE_ANNUALLY_PROD);
  */}

  export const PRICING_PLANS = {
  monthly: {
    id: isProduction
      ? process.env.STRIPE_PRICE_MONTHLY_PROD
      : process.env.STRIPE_PRICE_MONTHLY_TEST,
    price: 29.99, // Can Change prices if needed from prod to test
    name: 'Monthly',
    interval: 'monthly', // Added for plan identification
    description: 'Billed monthly. Cancel anytime.',
    features: [
      'Unlimited AI consultations',
      '24/7 availability',
      'Research-backed answers',
      'Cancel anytime'
    ] // 🟢 Added features array
    },
  annually: {
    id: isProduction
      ? process.env.STRIPE_PRICE_ANNUALLY_PROD
      : process.env.STRIPE_PRICE_ANNUALLY_TEST,
    price: 23.99, // Can Change prices if needed from prod to test
    name: 'Annual',
    interval: 'annually', // Added for plan identification
    description: 'Billed annually. Best value!.',
    features: [
      'All Monthly features',
      'Priority support',
      'Exclusive content',
      'Personalized insights'
    ], // 🟢 Added features array
    badge: 'Best Value',
    savings: 'Save 20%'
  }
};
