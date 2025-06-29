import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { stripe } from "@/lib/stripe-server";
import { STRIPE_CONFIG } from "@/lib/stripe-config";
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

    // Check if user already has a subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        { error: "User already has a subscription" },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
    let stripeCustomerId = "";

    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create checkout session with trial
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: STRIPE_CONFIG.PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: STRIPE_CONFIG.TRIAL_DAYS,
        metadata: {
          userId: user.id,
        },
      },
      success_url: `${req.nextUrl.origin}/dashboard?subscription=success`,
      cancel_url: `${req.nextUrl.origin}/dashboard?subscription=canceled`,
      allow_promotion_codes: true,
    });

    // Create subscription record in database
    await db.insert(subscriptions).values({
      id: crypto.randomUUID(),
      userId: user.id,
      stripeCustomerId,
      status: "incomplete",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
