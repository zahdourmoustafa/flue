"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavigationContext } from "@/contexts";
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
} from "lucide-react";

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
  const router = useRouter();
  const { navigateWithConfirmation } = useNavigationContext();

  const handleNavigation = (href: string) => {
    if (navigateWithConfirmation) {
      navigateWithConfirmation(href);
    } else {
      router.push(href);
    }
  };

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
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
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

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Account */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleNavigation("/dashboard/account")}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
            pathname === "/dashboard/account"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
}
