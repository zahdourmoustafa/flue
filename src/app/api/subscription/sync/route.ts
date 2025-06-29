import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { stripe } from "@/lib/stripe-server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    // Get user's subscription record
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    if (userSubscription.length === 0) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = userSubscription[0];

    // Get latest data from Stripe
    const stripeCustomer = await stripe.customers.retrieve(
      subscription.stripeCustomerId
    );

    if (stripeCustomer.deleted) {
      return NextResponse.json(
        { error: "Customer not found in Stripe" },
        { status: 404 }
      );
    }

    // Get customer's subscriptions from Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: subscription.stripeCustomerId,
      status: "all",
      limit: 10,
    });

    if (stripeSubscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found in Stripe" },
        { status: 404 }
      );
    }

    // Get the most recent subscription
    const latestSubscription = stripeSubscriptions.data[0];

    // Update our database with Stripe data
    await db
      .update(subscriptions)
      .set({
        stripeSubscriptionId: latestSubscription.id,
        stripePriceId: latestSubscription.items.data[0].price.id,
        status: latestSubscription.status as any,
        currentPeriodStart: new Date(
          latestSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          latestSubscription.current_period_end * 1000
        ),
        canceledAt: latestSubscription.canceled_at
          ? new Date(latestSubscription.canceled_at * 1000)
          : null,
        cancelAtPeriodEnd: latestSubscription.cancel_at_period_end,
        trialStart: latestSubscription.trial_start
          ? new Date(latestSubscription.trial_start * 1000)
          : null,
        trialEnd: latestSubscription.trial_end
          ? new Date(latestSubscription.trial_end * 1000)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, user.id));

    return NextResponse.json({
      message: "Subscription synced successfully",
      status: latestSubscription.status,
      trialEnd: latestSubscription.trial_end
        ? new Date(latestSubscription.trial_end * 1000)
        : null,
      currentPeriodEnd: new Date(latestSubscription.current_period_end * 1000),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync subscription" },
      { status: 500 }
    );
  }
}
