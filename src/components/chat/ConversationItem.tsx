import React from "react";
import UnreadBadge from "./UnreadBadge";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string | Date;
  unreadCount: number;
  isSelected: boolean;
  onClick: () => void;
  avatarUrl?: string | null;
  department?: string;
  isOnline?: boolean;
}

const ConversationItem = React.memo(function ConversationItem({
  name,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isSelected,
  onClick,
  avatarUrl,
  department,
  isOnline = false,
}: ConversationItemProps) {
  // Helper to format the message time
  const formatTime = (timeInput?: string | Date) => {
    if (!timeInput) return "";
    const date = new Date(timeInput);
    const now = new Date();
    
    // Check if same day
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Otherwise show month and day
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Get initials for avatar fallback
  const getInitials = (userName: string) => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3.5 transition-all text-left border-b border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-800/30",
        isSelected && "bg-indigo-50/70 hover:bg-indigo-50/70 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/20"
      )}
    >
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {getInitials(name)}
          </div>
        )}
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 transition-colors duration-300",
            isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-650"
          )}
        />
      </div>

      {/* Info Section */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate">
            {name}
          </h4>
          <span className="text-2xs text-slate-400 dark:text-zinc-500 whitespace-nowrap">
            {formatTime(lastMessageTime)}
          </span>
        </div>
        
        {department && (
          <span className="text-3xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded uppercase tracking-wider block w-max mt-0.5">
            {department}
          </span>
        )}

        <p className={cn(
          "text-xs text-slate-500 dark:text-zinc-400 truncate mt-1 leading-snug",
          unreadCount > 0 && "font-semibold text-slate-800 dark:text-zinc-100"
        )}>
          {lastMessage || "No messages yet"}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="flex-shrink-0 self-center">
          <UnreadBadge count={unreadCount} />
        </div>
      )}
    </button>
  );
});

export default ConversationItem;
