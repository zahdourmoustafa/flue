import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    try {
      // Get the session token from cookies
      const sessionToken = request.cookies.get(
        "better-auth.session_token"
      )?.value;

      if (!sessionToken) {
        // No session token, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Make a request to verify the session
      const sessionResponse = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!sessionResponse.ok) {
        // Session verification failed, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }

      const sessionData = await sessionResponse.json();

      if (!sessionData.user) {
        // No user in session, redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Session is valid, allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware authentication error:", error);
      // On error, redirect to home for safety
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // For non-dashboard routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
