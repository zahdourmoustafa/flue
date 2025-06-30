"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

interface UserData {
  id: string;
  name: string;
  email: string;
  preferredLanguage?: string;
  translationLanguage?: string;
  learningLanguage?: string;
  languageLevel?: string;
  image?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserStats {
  currentLevel: number;
  nextLevel: number;
  minutesLeft: number;
  progressPercentage: number;
  totalMinutes: number;
  achievements: number;
  streakDays: number;
  lessonsCompleted: number;
}

interface AuthContextType {
  user: UserData | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserData>) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SECURITY FIX: Completely disable localStorage caching to prevent session mixing
  // Always fetch fresh data from server to ensure correct user data

  // Clear all auth-related storage completely
  const clearAllStorage = () => {
    if (typeof window === "undefined") return;

    try {
      console.log("Clearing ALL auth storage and cookies");

      // Clear ALL localStorage (not just specific items)
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear ALL cookies (including better-auth cookies)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name) {
          // Clear for all possible domains and paths
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      });

      // Force clear better-auth specific cookies
      const authCookieNames = [
        "better-auth",
        "auth-token",
        "session",
        "auth_session",
        "next-auth",
        "session-token",
      ];
      authCookieNames.forEach((cookieName) => {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      });

      console.log("All storage and cookies cleared");
    } catch (error) {
      console.warn("Failed to clear storage:", error);
    }
  };

  const fetchUser = async () => {
    try {
      setError(null);
      setLoading(true);

      // SECURITY FIX: Always fetch fresh session from server - no caching
      console.log("Fetching fresh user session...");
      const session = await authClient.getSession();

      if (session.data?.user) {
        const userData = session.data.user as UserData;
        console.log("User session found:", {
          id: userData.id,
          email: userData.email,
        });

        // CRITICAL: Check if this is an unexpected session during signup flow
        const isSignupFlow = window.location.pathname.includes("sign-up");
        if (isSignupFlow) {
          console.warn("⚠️ UNEXPECTED SESSION during signup - force clearing!");
          await authClient.signOut();
          clearAllStorage();

          // Re-check after clearing
          const cleanSession = await authClient.getSession();
          if (cleanSession.data?.user) {
            console.error(
              "🚨 SESSION PERSISTS after clearing - forcing page reload"
            );
            window.location.reload();
            return;
          }

          setUser(null);
          setStats(null);
          return;
        }

        setUser(userData);

        // Fetch stats - always fresh from server
        try {
          const statsResponse = await fetch("/api/user/stats");
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStats(statsData);
          } else {
            console.warn("Failed to fetch user stats, using defaults");
            setStats(null);
          }
        } catch (statsError) {
          console.warn("Error fetching user stats:", statsError);
          setStats(null);
        }
      } else {
        console.log("No user session found, clearing state");
        setUser(null);
        setStats(null);
        clearAllStorage(); // Clear any stale data
      }
    } catch (err) {
      console.error("Error fetching user session:", err);
      setError("Failed to load user session");
      setUser(null);
      setStats(null);
      clearAllStorage(); // Clear any stale data on error
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser(); // Always fetch fresh data
  };

  const updateUser = (updates: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // No caching - data will be fresh on next load
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    if (stats) {
      const updatedStats = { ...stats, ...updates };
      setStats(updatedStats);
      // No caching - data will be fresh on next load
    }
  };

  // Clear session completely
  const clearSession = async () => {
    try {
      console.log("Clearing user session completely");

      // Clear auth client session first
      await authClient.signOut();

      // Clear all storage
      clearAllStorage();

      // Reset state
      setUser(null);
      setStats(null);
      setError(null);
      setLoading(false);

      console.log("Session cleared successfully");
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  useEffect(() => {
    // NUCLEAR SECURITY FIX: Don't load any session during signup/signin to prevent mixing
    const isAuthFlow = typeof window !== "undefined" && 
      (window.location.pathname.includes('sign-up') || 
       window.location.pathname.includes('sign-in'));
    
    if (isAuthFlow) {
      console.log("🛡️ BLOCKING auth loading during auth flow to prevent session mixing");
      setUser(null);
      setStats(null);
      setLoading(false);
      clearAllStorage(); // Clear any stale data
      return;
    }
    
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    stats,
    loading,
    error,
    refreshUser,
    updateUser,
    updateStats,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
