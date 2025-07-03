import { db } from "@/db";
import { user } from "@/db/schema";
import { stripe } from "@/lib/stripe-server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Add helper types to include fields missing in the Stripe typings we have installed.
// These extend the official Stripe types with the properties we need.
export type StripeSubscriptionEx = Stripe.Subscription & {
  current_period_end: number;
};

export type StripeInvoiceEx = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
};

// Helper function to get userId from subscription or customer
async function getUserIdFromSubscription(
  subscriptionId: string
): Promise<string | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // First try subscription metadata
    if (subscription.metadata?.userId) {
      return subscription.metadata.userId;
    }

    // Fallback to customer metadata
    if (subscription.customer) {
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted && customer.metadata?.userId) {
        return customer.metadata.userId;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting userId from subscription:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log(`Processing webhook event: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session completed:", session.id);

      let userId = session.metadata?.userId;

      // If no userId in session metadata, try to get it from the subscription
      if (!userId && session.subscription) {
        const userIdFromSub = await getUserIdFromSubscription(
          session.subscription as string
        );
        userId = userIdFromSub || undefined;
      }

      if (!userId) {
        console.error(
          "No userId found in checkout session metadata or subscription"
        );
        return new Response("Webhook Error: No userId found", {
          status: 400,
        });
      }

      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as unknown as StripeSubscriptionEx;

      console.log(
        `Updating user ${userId} with subscription ${subscription.id}`
      );

      await db
        .update(user)
        .set({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        })
        .where(eq(user.id, userId));

      console.log(`Successfully updated user ${userId} subscription status`);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as StripeInvoiceEx;
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : (invoice.subscription as StripeSubscriptionEx)?.id;

      if (!subscriptionId) {
        console.error("No subscriptionId found in invoice");
        return new Response("Webhook Error: No subscriptionId on invoice", {
          status: 400,
        });
      }

      const userId = await getUserIdFromSubscription(subscriptionId);

      if (!userId) {
        console.error(`No userId found for subscription ${subscriptionId}`);
        return new Response("Webhook Error: No userId found for subscription", {
          status: 400,
        });
      }

      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId
      )) as unknown as StripeSubscriptionEx;

      console.log(
        `Updating user ${userId} payment succeeded for subscription ${subscriptionId}`
      );

      await db
        .update(user)
        .set({
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        })
        .where(eq(user.id, userId));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromSubscription(subscription.id);

      if (!userId) {
        console.error(
          `No userId found for deleted subscription ${subscription.id}`
        );
        return new Response("Webhook Error: No userId found for subscription", {
          status: 400,
        });
      }

      console.log(`Deleting subscription for user ${userId}`);

      await db
        .update(user)
        .set({
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        })
        .where(eq(user.id, userId));
      break;
    }

    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
