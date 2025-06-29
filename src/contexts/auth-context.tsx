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

  // Cache key for localStorage
  const CACHE_KEY = "fluentzy_user_session";
  const STATS_CACHE_KEY = "fluentzy_user_stats";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Load from cache if available and not expired
  const loadFromCache = (): {
    user: UserData | null;
    stats: UserStats | null;
  } => {
    if (typeof window === "undefined") return { user: null, stats: null };

    try {
      const cachedUser = localStorage.getItem(CACHE_KEY);
      const cachedStats = localStorage.getItem(STATS_CACHE_KEY);

      if (cachedUser && cachedStats) {
        const { data: userData, timestamp: userTimestamp } =
          JSON.parse(cachedUser);
        const { data: statsData, timestamp: statsTimestamp } =
          JSON.parse(cachedStats);

        if (
          Date.now() - userTimestamp < CACHE_DURATION &&
          Date.now() - statsTimestamp < CACHE_DURATION
        ) {
          return { user: userData, stats: statsData };
        } else {
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(STATS_CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn("Failed to load session from cache:", error);
    }
    return { user: null, stats: null };
  };

  // Save to cache
  const saveToCache = (userData: UserData, statsData: UserStats) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: userData,
          timestamp: Date.now(),
        })
      );
      localStorage.setItem(
        STATS_CACHE_KEY,
        JSON.stringify({
          data: statsData,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Failed to save session to cache:", error);
    }
  };

  // Clear cache
  const clearCache = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(STATS_CACHE_KEY);
  };

  const fetchUser = async (useCache = true) => {
    try {
      setError(null);

      // Try cache first if enabled
      if (useCache) {
        const { user: cachedUser, stats: cachedStats } = loadFromCache();
        if (cachedUser && cachedStats) {
          setUser(cachedUser);
          setStats(cachedStats);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const session = await authClient.getSession();
      if (session.data?.user) {
        const userData = session.data.user as UserData;
        setUser(userData);

        // Fetch stats
        const statsResponse = await fetch("/api/user/stats");
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

        saveToCache(userData, statsData);
      } else {
        setUser(null);
        setStats(null);
        clearCache();
      }
    } catch (err) {
      console.error("Error fetching user session:", err);
      setError("Failed to load user session");
      setUser(null);
      setStats(null);
      clearCache();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser(false); // Force refresh, skip cache
  };

  const updateUser = (updates: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      if (stats) {
        saveToCache(updatedUser, stats);
      }
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    if (stats) {
      const updatedStats = { ...stats, ...updates };
      setStats(updatedStats);
      if (user) {
        saveToCache(user, updatedStats);
      }
    }
  };

  // Clear session completely
  const clearSession = async () => {
    try {
      // Clear local storage
      clearCache();

      // Clear auth client session
      await authClient.signOut();

      // Reset state
      setUser(null);
      setStats(null);
      setError(null);
      setLoading(false);

      // Clear any other browser storage
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        // Clear any auth cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  useEffect(() => {
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
