import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    openaiApiKey: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    databaseUrl: !!process.env.DATABASE_URL,
    betterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    environment: process.env.NODE_ENV,
  };

  const allChecksPass = Object.values(checks).every((check) =>
    typeof check === "boolean" ? check : true
  );

  return NextResponse.json(
    {
      status: allChecksPass ? "healthy" : "degraded",
      checks,
    },
    {
      status: allChecksPass ? 200 : 503,
    }
  );
}
