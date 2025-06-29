# Stripe Subscription Setup Guide

## Overview

This guide walks you through setting up Stripe subscriptions for your Fluentzy app with a $10/month premium plan and 3-day free trial.

## Prerequisites

- Stripe account (https://stripe.com)
- Environment variables already set:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## 1. Create Stripe Product and Price

### Via Stripe Dashboard:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Fill in:
   - **Name**: Fluentzy Premium
   - **Description**: Access all premium learning modes and features
   - **Pricing model**: Recurring
   - **Price**: $10.00 USD
   - **Billing period**: Monthly
4. Save the product
5. Copy the **Price ID** (starts with `price_`)

### Via Stripe CLI (Alternative):

```bash
stripe products create \
  --name="Fluentzy Premium" \
  --description="Access all premium learning modes and features"

stripe prices create \
  --product=prod_XXXXX \
  --unit-amount=1000 \
  --currency=usd \
  --recurring[interval]=month
```

## 2. Update Configuration

Update `src/lib/stripe.ts` with your actual Price ID:

```typescript
export const STRIPE_CONFIG = {
  PREMIUM_PRICE_ID: "price_YOUR_ACTUAL_PRICE_ID_HERE", // Replace with your actual price ID
  // ... rest remains the same
};
```

## 3. Set Up Webhook Endpoint

### Create Webhook:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL**: `https://yourdomain.com/api/subscription/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Save the webhook
6. Copy the **Signing Secret** (starts with `whsec_`)

### Add Webhook Secret to Environment:

Add to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

## 4. Test the Integration

### Test Payments (Development):

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

### Test the Flow:

1. Start your development server: `npm run dev`
2. Navigate to `/dashboard`
3. Try to access a premium feature (Dialogue, Sentence Mode, Video Call, Call Mode)
4. You should see the premium upgrade prompt
5. Click "Start Free Trial"
6. Complete the checkout process
7. Verify subscription status updates

## 5. Premium Features

The following features are protected by subscription:

- **Dialogue Mode** (`/dashboard/dialogue`)
- **Sentence Mode** (`/dashboard/sentence-mode`)
- **Video Call** (`/dashboard/videocall`)
- **Call Mode** (`/dashboard/call-mode`)

**Free features:**

- **Chat Mode** (`/dashboard/chat`)
- **Dashboard** and **Progress** pages

## 6. Production Deployment

### Environment Variables:

Ensure these are set in production:

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook URL:

Update your webhook endpoint URL to your production domain:

```
https://yourdomain.com/api/subscription/webhook
```

## 7. Key Features Implemented

### 🎯 Subscription Management

- ✅ 3-day free trial
- ✅ $10/month subscription
- ✅ Automatic recurring billing
- ✅ Subscription status tracking

### 🔒 Access Control

- ✅ Premium badges on restricted features
- ✅ Subscription guards protecting routes
- ✅ Graceful upgrade prompts

### 🎨 UI Components

- ✅ Premium trial banner in sidebar
- ✅ Subscription status indicators
- ✅ Upgrade buttons and CTAs
- ✅ Premium badges on learning mode cards

### 🔧 API Endpoints

- ✅ `/api/subscription/checkout` - Create checkout session
- ✅ `/api/subscription/webhook` - Handle Stripe events
- ✅ `/api/subscription/status` - Get user subscription status

## 8. Troubleshooting

### Common Issues:

**Webhook not receiving events:**

- Check webhook URL is correct
- Verify endpoint is publicly accessible
- Check webhook signing secret

**Checkout not redirecting:**

- Verify success/cancel URLs are correct
- Check browser console for errors

**Premium features not unlocking:**

- Check subscription status in database
- Verify webhook is processing subscription updates
- Check user authentication

### Database Schema:

The subscription data is stored in the `subscriptions` table with the following key fields:

- `status`: Subscription status (active, trialing, canceled, etc.)
- `trial_end`: When trial expires
- `current_period_end`: When current billing period ends
- `stripe_subscription_id`: Stripe subscription reference

## 9. Monitoring

Monitor your subscriptions via:

- **Stripe Dashboard**: Real-time subscription metrics
- **Database**: Local subscription status
- **Application Logs**: Webhook processing logs

---

🎉 **You're all set!** Your Stripe subscription system is now fully integrated with premium feature gating, trial management, and automatic billing.
