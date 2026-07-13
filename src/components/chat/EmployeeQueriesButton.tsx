"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import EmployeeChatModal from "./EmployeeChatModal";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function EmployeeQueriesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial unread count on mount
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/chat/unread");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread || 0);
      }
    } catch (error) {
      console.error("Failed to fetch initial unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Sync unread count again when the modal is closed (in case messages were read)
  useEffect(() => {
    if (!isOpen) {
      fetchUnreadCount();
    }
  }, [isOpen]);

  // Connect chat socket as soon as the dashboard loads, and listen to real-time events
  useChatSocket({
    onNewMessage: (payload) => {
      // If modal is closed, increment the global unread count on the button badge
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    onUnreadCountUpdated: (payload: { unread: number }) => {
      setUnreadCount(payload.unread);
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        <MessageSquare className="h-4 w-4" />
        Employee Queries
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm border-2 border-white dark:border-zinc-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <EmployeeChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
