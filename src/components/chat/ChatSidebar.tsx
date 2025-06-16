import { useState } from "react";
import { ChannelList } from "stream-chat-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageCirclePlus, MoreVertical } from "lucide-react";

interface ChatSidebarProps {
  userId: string;
}

export const ChatSidebar = ({ userId }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filters = {
    members: { $in: [userId] },
    ...(searchQuery && { name: { $autocomplete: searchQuery } }),
  };

  const customChannelPreview = (props: any) => {
    const { channel, latestMessage, setActiveChannel, activeChannel } = props;
    const isActive = channel?.id === activeChannel?.id;

    return (
      <div
        onClick={() => setActiveChannel(channel)}
        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
          isActive ? "bg-green-50 border-r-4 border-green-500" : ""
        }`}
      >
        <Avatar className="w-12 h-12 mr-3">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              channel?.data?.name || "Chat"
            )}&background=25D366&color=fff&size=128`}
          />
          <AvatarFallback className="bg-green-500 text-white">
            {(channel?.data?.name || "C").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 truncate">
              {channel?.data?.name || "Chat"}
            </h4>
            <span className="text-xs text-gray-500">
              {latestMessage?.created_at &&
                new Date(latestMessage.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate">
            {latestMessage?.text || "No messages yet"}
          </p>
        </div>

        {channel?.state?.unreadCount > 0 && (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ml-2">
            <span className="text-xs text-white font-semibold">
              {channel.state.unreadCount}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#075E54] text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Flue Chat</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <MessageCirclePlus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-green-100 mt-1">AI Powered Conversations</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-100 border-none focus:bg-white"
          />
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto">
        <ChannelList
          filters={filters}
          sort={{ last_message_at: -1 }}
          options={{
            subscribe: true,
            watch: true,
            state: true,
          }}
          Preview={customChannelPreview}
          showChannelSearch={false}
        />
      </div>
    </div>
  );
};
