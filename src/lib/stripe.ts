import { loadStripe, Stripe as StripeJS } from "@stripe/stripe-js";

// Client-side Stripe instance
let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Helper function to check if user has active subscription
export const hasActiveSubscription = (subscription: any) => {
  if (!subscription) return false;

  const validStatuses = ["active", "trialing"];
  return validStatuses.includes(subscription.status);
};

// Helper function to check if user is in trial
export const isInTrial = (subscription: any) => {
  if (!subscription) return false;

  return (
    subscription.status === "trialing" &&
    subscription.trialEnd &&
    new Date(subscription.trialEnd) > new Date()
  );
};

// Helper function to get days left in trial
export const getTrialDaysLeft = (subscription: any) => {
  if (!subscription || !subscription.trialEnd) return 0;

  const trialEnd = new Date(subscription.trialEnd);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};
