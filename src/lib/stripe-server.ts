import Stripe from "stripe";
import { STRIPE_CONFIG } from "./stripe-config";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Helper function to ensure product and price exist
export const ensureStripeProduct = async () => {
  try {
    // First, try to retrieve the price if it's not auto-create
    if (STRIPE_CONFIG.PREMIUM_PRICE_ID !== "auto-create") {
      try {
        const price = await stripe.prices.retrieve(
          STRIPE_CONFIG.PREMIUM_PRICE_ID
        );
        return price.id;
      } catch (error) {
        console.log("Price not found, will create new one");
      }
    }

    // Create product if it doesn't exist
    const products = await stripe.products.list({
      limit: 100,
    });

    let product = products.data.find(
      (p) => p.name === STRIPE_CONFIG.PREMIUM_PRODUCT_NAME
    );

    if (!product) {
      product = await stripe.products.create({
        name: STRIPE_CONFIG.PREMIUM_PRODUCT_NAME,
        description: STRIPE_CONFIG.PREMIUM_PRODUCT_DESCRIPTION,
      });
      console.log("Created Stripe product:", product.id);
    }

    // Create price if it doesn't exist
    const prices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    });

    let price = prices.data.find(
      (p) =>
        p.unit_amount === STRIPE_CONFIG.PREMIUM_PRICE &&
        p.currency === "usd" &&
        p.recurring?.interval === "month"
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: STRIPE_CONFIG.PREMIUM_PRICE,
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });
      console.log("Created Stripe price:", price.id);
      console.log(
        "🔥 IMPORTANT: Update your .env with STRIPE_PRICE_ID=" + price.id
      );
    }

    return price.id;
  } catch (error) {
    console.error("Error ensuring Stripe product:", error);
    throw error;
  }
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
