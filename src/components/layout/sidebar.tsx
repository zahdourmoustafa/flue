"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Compass,
  TrendingUp,
  MessageCircle,
  Mic,
  Video,
  Play,
  User,
  Zap,
  Phone,
  Crown,
  Clock,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/dashboard/explore", icon: Compass },
  { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
];

const learningModes = [
  { name: "Chat", href: "/dashboard/chat", icon: MessageCircle },
  { name: "Dialogue Mode", href: "/dashboard/dialogue", icon: Mic },
  { name: "Sentence Mode", href: "/dashboard/sentence-mode", icon: Play },
  { name: "Video Call", href: "/dashboard/videocall", icon: Video },
  { name: "Call Mode", href: "/dashboard/call-mode", icon: Phone },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    isPremium,
    isTrialing,
    trialDaysLeft,
    startSubscription,
    isCreatingCheckout,
    requiresPremium,
  } = useSubscription();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 fluentzy-gradient rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Fluentzy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8">
        {/* Main Navigation */}
        <div>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning Modes */}
        <div>
          <ul className="space-y-1">
            {learningModes.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const needsPremium = requiresPremium(
                item.href.split("/").pop() || ""
              );
              const hasAccess = isPremium || isTrialing || !needsPremium;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {needsPremium && !hasAccess && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Premium Trial Banner */}
        {!isPremium && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            {isTrialing ? (
              <div className="text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-amber-900 mb-1">
                  {trialDaysLeft} days left in trial
                </div>
                <div className="text-xs text-amber-700 mb-3">
                  Upgrade to keep premium features
                </div>
                <Button
                  onClick={startSubscription}
                  disabled={isCreatingCheckout}
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                >
                  {isCreatingCheckout ? "Loading..." : "Upgrade"}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Crown className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-amber-900 mb-1">
                  Try Premium Free
                </div>
                <div className="text-xs text-amber-700 mb-3">
                  3 days free trial • $10/month
                </div>
                <Button
                  onClick={startSubscription}
                  disabled={isCreatingCheckout}
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs"
                >
                  {isCreatingCheckout ? "Loading..." : "Start Free Trial"}
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Account */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/dashboard/account"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/dashboard/account"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
}
