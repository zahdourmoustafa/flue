import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Automatically detect the correct base URL for the environment
const getBaseURL = () => {
  // Check for explicit URL first
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // Production check - if we're on Netlify or have NETLIFY environment
  if (
    process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.NODE_ENV === "production"
  ) {
    // For production, use the deployment URL
    return process.env.NEXTAUTH_URL || "https://fluentzy.netlify.app";
  }

  // For development, always use localhost
  return "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-secret-key-change-in-production",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${getBaseURL()}/api/auth/callback/google`,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      console.log("Password reset for:", user.email, "URL:", url);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      preferredLanguage: {
        type: "string",
        required: false,
      },
      translationLanguage: {
        type: "string",
        required: false,
      },
      learningLanguage: {
        type: "string",
        required: false,
      },
      languageLevel: {
        type: "string",
        required: false,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://fluentzy.netlify.app",
    "https://accounts.google.com",
    process.env.NEXTAUTH_URL || "",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),
});
