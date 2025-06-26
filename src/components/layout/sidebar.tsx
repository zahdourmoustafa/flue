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
  Users,
  Camera,
  User,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

const learningModes = [
  { name: "Chat", href: "/dashboard/chat", icon: MessageCircle },
  { name: "Dialogue Mode", href: "/dashboard/dialogue", icon: Mic },
  { name: "Sentence Mode", href: "/dashboard/sentence-mode", icon: Play },
  { name: "Call Mode", href: "/dashboard/video-call", icon: Video },
  { name: "Roleplays", href: "/dashboard/roleplays", icon: Users },
  { name: "Characters", href: "/dashboard/characters", icon: User },
  { name: "Debates", href: "/dashboard/debates", icon: MessageCircle },
  { name: "Photo Mode", href: "/dashboard/photo", icon: Camera },
];

export function Sidebar() {
  const pathname = usePathname();

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
            {learningModes.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
