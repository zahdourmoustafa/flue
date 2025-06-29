import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constants for configuration
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PUBLIC_ROUTES = ["/", "/pricing"];
const SESSION_COOKIE_NAME = "better-auth.session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.url;

  // Add security headers to all responses
  const response = NextResponse.next();

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/auth") // Let better-auth handle its own routes
  ) {
    return response;
  }

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    try {
      // Get the session token from cookies
      const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

      if (!sessionToken) {
        // No session token, redirect to home
        return NextResponse.redirect(new URL("/", url));
      }

      // Verify session with better timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const sessionResponse = await fetch(
          new URL("/api/auth/get-session", url),
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
              "user-agent": request.headers.get("user-agent") || "",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!sessionResponse.ok) {
          // Session verification failed, redirect to home
          return NextResponse.redirect(new URL("/", url));
        }

        const sessionData = await sessionResponse.json();

        if (!sessionData?.user?.id) {
          // No valid user in session, redirect to home
          return NextResponse.redirect(new URL("/", url));
        }

        // Session is valid, allow access
        return response;
      } catch (fetchError) {
        clearTimeout(timeoutId);

        // If it's an abort error, log and redirect
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          console.error("Session verification timeout:", pathname);
        } else {
          console.error("Session verification error:", fetchError);
        }

        return NextResponse.redirect(new URL("/", url));
      }
    } catch (error) {
      console.error("Middleware authentication error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        pathname,
        timestamp: new Date().toISOString(),
      });

      // On any error, redirect to home for safety
      return NextResponse.redirect(new URL("/", url));
    }
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      // Quick check if session exists (don't verify fully to avoid performance hit)
      return NextResponse.redirect(new URL("/dashboard", url));
    }
  }

  // For all other routes, continue normally
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (better-auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
