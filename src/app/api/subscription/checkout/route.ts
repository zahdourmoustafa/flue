import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { stripe, ensureStripeProduct } from "@/lib/stripe-server";
import { eq } from "drizzle-orm";
import { user as usersTable } from "@/db/schema";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const userRecord = await db.query.user.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!userRecord) {
      return new Response("User not found", { status: 404 });
    }

    // Check if user already has a subscription
    if (userRecord.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "User already has a subscription" },
        { status: 400 }
      );
    }

    let stripeCustomerId = userRecord.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: {
          userId: userId,
        },
      });
      stripeCustomerId = customer.id;

      await db
        .update(usersTable)
        .set({ stripeCustomerId: stripeCustomerId })
        .where(eq(usersTable.id, userId));
    }

    const priceId = await ensureStripeProduct();

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          userId: userId,
        },
      },
      metadata: {
        userId: userId,
      },
      success_url: absoluteUrl("dashboard"),
      cancel_url: absoluteUrl("dashboard"),
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
