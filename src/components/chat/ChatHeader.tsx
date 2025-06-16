import { useChatContext } from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  onBack?: () => void;
}

export const ChatHeader = ({ onBack }: ChatHeaderProps) => {
  const { channel } = useChatContext();

  const channelName = channel?.data?.name || "Chat";
  const memberCount = channel?.state?.members
    ? Object.keys(channel.state.members).length
    : 0;

  return (
    <div className="flex items-center justify-between p-3 bg-[#075E54] text-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <Avatar className="w-10 h-10">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              channelName
            )}&background=25D366&color=fff&size=128`}
          />
          <AvatarFallback className="bg-green-500 text-white">
            {channelName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold text-white">{channelName}</h3>
          <p className="text-sm text-green-100">
            {memberCount > 1 ? `${memberCount} members` : "Online"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-2"
        >
          <Phone className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 p-2"
        >
          <Video className="w-5 h-5" />
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
  );
};
