"use client";

import { ArrowLeft, Volume2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function ChatHeader() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  const handleVolumeToggle = () => {
    // TODO: Implement global audio toggle
    console.log("Toggle audio");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      {/* Left Side - Back Button and Emma Profile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/emma-avatar.svg" alt="Emma" />
              <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600">
                EM
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 text-lg">Emma</h2>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleVolumeToggle}
          className="hover:bg-gray-100"
        >
          <Volume2 className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Clear conversation</DropdownMenuItem>
            <DropdownMenuItem>Download transcript</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
