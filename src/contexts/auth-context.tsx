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

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserData>) => void;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key for localStorage
  const CACHE_KEY = "fluentzy_user_session";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Load from cache if available and not expired
  const loadFromCache = (): UserData | null => {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn("Failed to load session from cache:", error);
    }
    return null;
  };

  // Save to cache
  const saveToCache = (userData: UserData) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: userData,
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
  };

  const fetchUser = async (useCache = true) => {
    try {
      setError(null);

      // Try cache first if enabled
      if (useCache) {
        const cachedUser = loadFromCache();
        if (cachedUser) {
          setUser(cachedUser);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const session = await authClient.getSession();
      if (session.data?.user) {
        const userData = session.data.user as UserData;
        setUser(userData);
        saveToCache(userData);
      } else {
        setUser(null);
        clearCache();
      }
    } catch (err) {
      console.error("Error fetching user session:", err);
      setError("Failed to load user session");
      setUser(null);
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
      saveToCache(updatedUser);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
