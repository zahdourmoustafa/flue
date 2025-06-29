import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hasActiveSubscription,
  isInTrial,
  getTrialDaysLeft,
} from "@/lib/stripe-server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    // Get user's subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    const userSubscription = subscription[0] || null;

    // Determine subscription status
    const isActive = hasActiveSubscription(userSubscription);
    const inTrial = isInTrial(userSubscription);
    const trialDaysLeft = getTrialDaysLeft(userSubscription);

    return NextResponse.json({
      hasSubscription: !!userSubscription,
      isActive,
      inTrial,
      trialDaysLeft,
      status: userSubscription?.status || "none",
      currentPeriodEnd: userSubscription?.currentPeriodEnd,
      cancelAtPeriodEnd: userSubscription?.cancelAtPeriodEnd || false,
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
