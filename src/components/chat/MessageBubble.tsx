import React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  senderRole: "EMPLOYEE" | "ADMIN";
  viewerRole: "EMPLOYEE" | "ADMIN";
  message: string;
  createdAt: string | Date;
  isRead?: boolean;
}

const MessageBubble = React.memo(function MessageBubble({
  senderRole,
  viewerRole,
  message,
  createdAt,
  isRead = true,
}: MessageBubbleProps) {
  // A message is outgoing if the viewer sent it
  const isOutgoing = senderRole === viewerRole;

  const formatMessageTime = (timeInput: string | Date) => {
    const date = new Date(timeInput);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={cn(
        "flex w-full mb-3.5",
        isOutgoing ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] sm:max-w-[70%] px-4 py-2.5 shadow-sm transition-all relative",
          isOutgoing
            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
            : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl rounded-tl-sm"
        )}
      >
        {/* Message Text */}
        <p className="text-xs leading-relaxed whitespace-pre-wrap break-words pr-2">
          {message}
        </p>

        {/* Footer info inside the bubble */}
        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] select-none opacity-80 float-right">
          <span
            className={cn(
              isOutgoing ? "text-indigo-200" : "text-slate-400 dark:text-zinc-500"
            )}
          >
            {formatMessageTime(createdAt)}
          </span>
          {isOutgoing && (
            <span className="inline-block">
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-emerald-300" />
              ) : (
                <Check className="h-3 w-3 text-indigo-300" />
              )}
            </span>
          )}
        </div>
        {/* Simple clearfix for floating time */}
        <div className="clear-both" />
      </div>
    </div>
  );
});

export default MessageBubble;
