# Fluentzy - AI Language Learning Platform

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Better Auth (Required)
BETTER_AUTH_SECRET="your_random_secret_key_here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (Optional - Google sign-in will be disabled if not provided)
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up your environment variables in `.env.local`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication Routes

- Sign In: `/sign-in`
- Sign Up: `/sign-up`
- Dashboard: `/dashboard` (requires authentication)

## Troubleshooting

If sign-in isn't redirecting to dashboard:

1. Check browser console for errors
2. Ensure `.env.local` has all required variables
3. Restart the dev server after adding environment variables
