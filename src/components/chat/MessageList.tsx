import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { MessageSquareOff } from "lucide-react";

interface Message {
  id: string;
  senderRole: "EMPLOYEE" | "ADMIN";
  message: string;
  createdAt: string | Date;
  isRead?: boolean;
}

interface MessageListProps {
  messages: Message[];
  activeEmployeeName: string;
  viewerRole: "ADMIN" | "EMPLOYEE";
}

export default function MessageList({
  messages,
  activeEmployeeName,
  viewerRole,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Smart Auto-Scroll to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lastMessage = messages[messages.length - 1];
    const isOutgoing = lastMessage?.senderRole === viewerRole;

    // Check if user is near the bottom (150px threshold)
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    // Always scroll on the first message, if the user is already near bottom, or if they sent the message
    if (isNearBottom || isOutgoing || messages.length <= 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewerRole]);

  // Helper to format date headers
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-zinc-950/20">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 mb-4 animate-bounce">
          <MessageSquareOff className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          No Messages Yet
        </h4>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-xs leading-normal">
          Start the conversation by sending a query message to {activeEmployeeName}.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50/50 dark:bg-zinc-950/20 scrollbar-thin"
    >
      {messages.map((msg, index) => {
        const messageDate = new Date(msg.createdAt).toDateString();
        const prevMessageDate =
          index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
        const showDateHeader = messageDate !== prevMessageDate;

        return (
          <div key={msg.id}>
            {/* Date Separator */}
            {showDateHeader && (
              <div className="flex justify-center my-4">
                <span className="bg-slate-200/60 dark:bg-zinc-800/80 text-[10px] font-semibold text-slate-500 dark:text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider select-none shadow-sm">
                  {formatDateHeader(messageDate)}
                </span>
              </div>
            )}

            {/* Bubble */}
            <MessageBubble
              senderRole={msg.senderRole}
              viewerRole={viewerRole}
              message={msg.message}
              createdAt={msg.createdAt}
              isRead={msg.isRead}
            />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
