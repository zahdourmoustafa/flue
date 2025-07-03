import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe-server";
import Stripe from "stripe";

// This is the grace period (in days) before we consider a subscription expired.
const TRIAL_GRACE_PERIOD_DAYS = 3;

async function syncStripeSubscription(
  userId: string,
  stripeCustomerId: string
) {
  try {
    // Get all subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
      limit: 10,
    });

    // Find the most recent active or trialing subscription
    const activeSubscription = subscriptions.data.find((sub) =>
      ["active", "trialing"].includes(sub.status)
    );

    if (activeSubscription) {
      // Update the user record with the subscription info
      await db
        .update(user)
        .set({
          stripeSubscriptionId: activeSubscription.id,
          stripeCurrentPeriodEnd: new Date(
            (activeSubscription as any).current_period_end * 1000
          ),
          stripePriceId: activeSubscription.items.data[0]?.price.id || null,
        })
        .where(eq(user.id, userId));

      console.log(
        `Synced subscription for user ${userId}: ${activeSubscription.id}`
      );
      return true;
    } else {
      console.log(`No active subscription found for user ${userId}`);
      return false;
    }
  } catch (error) {
    console.error("Error syncing Stripe subscription:", error);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user has a Stripe customer ID but no subscription ID, try to sync
    if (userRecord.stripeCustomerId && !userRecord.stripeSubscriptionId) {
      console.log(
        `Attempting to sync subscription for user ${session.user.id}`
      );
      await syncStripeSubscription(
        session.user.id,
        userRecord.stripeCustomerId
      );

      // Refetch the user record after sync
      const updatedUserRecord = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
      });

      if (updatedUserRecord) {
        return NextResponse.json(getSubscriptionStatus(updatedUserRecord));
      }
    }

    return NextResponse.json(getSubscriptionStatus(userRecord));
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function getSubscriptionStatus(userRecord: any) {
  const { stripeSubscriptionId, stripeCurrentPeriodEnd } = userRecord;

  const hasSubscription = !!stripeSubscriptionId;

  if (!hasSubscription) {
    return {
      isActive: false,
      isTrial: false,
      trialEndDate: null,
      daysLeftInTrial: 0,
    };
  }

  const currentPeriodEnd = new Date(stripeCurrentPeriodEnd);
  const now = new Date();
  const isWithinPeriod = currentPeriodEnd.getTime() > now.getTime();

  // For paid subscriptions, we just check if it's within the current period
  // The subscription is active if it hasn't expired
  const isActive = isWithinPeriod;

  // A subscription is only a "trial" if it's a free trial
  // Since we're dealing with paid subscriptions here, isTrial should be false
  const isTrial = false;

  const daysLeft = isWithinPeriod
    ? Math.ceil(
        (currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return {
    isActive: isActive,
    isTrial: isTrial,
    trialEndDate: stripeCurrentPeriodEnd,
    daysLeftInTrial: daysLeft, // This will be 0 for paid subscriptions
  };
}

// Helper function to get days left in trial
function getTrialDaysLeft(trialEnd: string | Date) {
  if (!trialEnd) return 0;

  const trialEndDate = new Date(trialEnd);
  const now = new Date();
  const diffTime = trialEndDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
