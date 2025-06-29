import { createAuthClient } from "better-auth/client";

// Automatically detect the correct base URL for the environment
const getClientBaseURL = () => {
  // Check if we're in the browser
  if (typeof window !== "undefined") {
    // In production (browser), use current origin
    if (window.location.hostname !== "localhost") {
      return window.location.origin;
    }
    // In development (browser), use localhost
    return "http://localhost:3000";
  }

  // Server-side: check environment
  if (
    process.env.NETLIFY ||
    process.env.VERCEL ||
    process.env.NODE_ENV === "production"
  ) {
    return process.env.NEXTAUTH_URL || "https://fluentzy.netlify.app";
  }

  // Development server-side
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
});

// Helper function to completely clear session and browser data
export const clearAllSessionData = async () => {
  try {
    // Sign out from auth client
    await authClient.signOut();

    if (typeof window !== "undefined") {
      // Clear all localStorage
      localStorage.clear();

      // Clear all sessionStorage
      sessionStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    }
  } catch (error) {
    console.error("Error clearing session data:", error);
  }
};

// Helper function to get current session info for debugging
export const getSessionDebugInfo = async () => {
  try {
    const session = await authClient.getSession();
    return {
      hasSession: !!session.data,
      user: session.data?.user || null,
      error: session.error || null,
      baseURL: getClientBaseURL(),
    };
  } catch (error) {
    return {
      hasSession: false,
      user: null,
      error: error,
      baseURL: getClientBaseURL(),
    };
  }
};

export { authClient as default };
