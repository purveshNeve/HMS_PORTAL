import { useState, useMemo } from "react";
import { Search, MessageSquare } from "lucide-react";
import ConversationItem from "./ConversationItem";

interface ConversationSidebarProps {
  conversations: Array<{
    id: string;
    employeeName: string;
    department?: string;
    lastMessage?: string;
    lastMessageTime?: string | Date;
    unreadCount: number;
    avatarUrl?: string | null;
    employeeId: string;
  }>;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onlineUserIds?: Set<string>;
}

export default function ConversationSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onlineUserIds = new Set(),
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return conversations;
    return conversations.filter((c) => {
      return (
        c.employeeName.toLowerCase().includes(query) ||
        (c.department && c.department.toLowerCase().includes(query))
      );
    });
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-slate-100 dark:border-zinc-800">
      {/* Header / Title */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          Inbox Queries
        </h3>
        <p className="text-2xs text-slate-400 dark:text-zinc-500 mt-0.5">
          Chat with employees requesting assistance
        </p>
      </div>

      {/* Search Input */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 dark:placeholder-zinc-500 transition-all text-slate-800 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c) => (
            <ConversationItem
              key={c.id}
              name={c.employeeName}
              lastMessage={c.lastMessage}
              lastMessageTime={c.lastMessageTime}
              unreadCount={c.unreadCount}
              isSelected={c.id === selectedConversationId}
              onClick={() => onSelectConversation(c.id)}
              avatarUrl={c.avatarUrl}
              department={c.department}
              isOnline={onlineUserIds.has(c.employeeId)}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
