import { useState, useEffect, useCallback } from "react";
import { IConversation, IChatUser } from "@/types/chat";

export interface ConversationUI {
  id: string; // conversationId
  employeeName: string;
  department?: string;
  lastMessage?: string;
  lastMessageTime?: string | Date;
  unreadCount: number;
  avatarUrl?: string | null;
  status: string; // Mocked active status
  employeeId: string; // Employee's User _id
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/chat/conversation");
      const text = await response.text();
      if (!response.ok) {
        let errMessage = `Error ${response.status}: Failed to fetch conversations`;
        try {
          const errData = text ? JSON.parse(text) : null;
          if (errData?.message) {
            errMessage = errData.message;
          }
        } catch (_) { }
        setError(errMessage);
        return;
      }
      const data: IConversation[] = text ? JSON.parse(text) : [];
      // Map API responses to UI format
      const mapped: ConversationUI[] = data.map((conv) => {
        const employee = conv.employeeId as IChatUser;
        return {
          id: conv._id,
          employeeName: employee?.name || "Unknown Employee",
          department: employee?.department || "",
          lastMessage: conv.lastMessage || "",
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.unreadForAdmin, // Since this hook is used by Admin
          avatarUrl: employee?.profileImage || null,
          status: "Active now", // default mock active status
          employeeId: employee?._id || "",
        };
      });
      setConversations(mapped);
    } catch (err: any) {
      console.error("fetchConversations error:", err);
      setError(err.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Locally clear unread count for a conversation (optimistic or on PATCH read success)
  const clearUnreadCount = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Update conversation last message details locally
  const updateConversationLastMessage = useCallback(
    (conversationId: string, message: string, time: string | Date = new Date()) => {
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conversationId
            ? {
              ...c,
              lastMessage: message,
              lastMessageTime: time,
            }
            : c
        );
        // Sort conversations by latest activity (lastMessageTime desc)
        return [...updated].sort((a, b) => {
          const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return bTime - aTime;
        });
      });
    },
    []
  );

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
    clearUnreadCount,
    updateConversationLastMessage,
    setConversations,
  };
}
