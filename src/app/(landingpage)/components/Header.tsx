"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export const Header = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignIn = () => {
    if (user) {
      // User is already authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, go to sign-in page
      router.push("/sign-in");
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // User is already authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, go to sign-up page
      router.push("/sign-up");
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Fluentzy</span>
          </div>



          <div className="flex items-center space-x-4">
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 rounded-full px-6 py-2 font-medium"
              onClick={handleGetStarted}
              disabled={loading}
            >
              {user ? "Dashboard" : "Get started"}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
