import { useState, useEffect, useCallback } from "react";
import { IMessage } from "@/types/chat";

export interface MessageUI {
  id: string;
  senderRole: "EMPLOYEE" | "ADMIN";
  message: string;
  createdAt: string | Date;
  isRead: boolean;
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<MessageUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/chat/messages/${id}`);
      const text = await response.text();
      
      if (!response.ok) {
        let errMessage = `Error ${response.status}: Failed to fetch messages`;
        try {
          const errData = text ? JSON.parse(text) : null;
          if (errData?.message) {
            errMessage = errData.message;
          }
        } catch (_) {}
        setError(errMessage);
        return;
      }
      
      const data: IMessage[] = text ? JSON.parse(text) : [];
      
      const mapped: MessageUI[] = data.map((msg) => ({
        id: msg._id,
        senderRole: msg.senderRole,
        message: msg.message,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      }));

      setMessages(mapped);
    } catch (err: any) {
      console.error("fetchMessages error:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages whenever conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    } else {
      setMessages([]);
      setError(null);
    }
  }, [conversationId, fetchMessages]);

  // Send a message via POST /api/chat/messages
  const sendMessage = useCallback(
    async (messageText: string, _unusedReceiverId: string, senderRole: "EMPLOYEE" | "ADMIN" = "ADMIN") => {
      setError(null);

      const tempId = `optimistic-${Date.now()}`;
      const optimisticMsg: MessageUI = {
        id: tempId,
        senderRole,
        message: messageText,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            conversationId: conversationId || undefined,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to send message`);
        }

        const data: { conversation: any; message: IMessage } = await response.json();

        const savedMsg: MessageUI = {
          id: data.message._id,
          senderRole: data.message.senderRole,
          message: data.message.message,
          createdAt: data.message.createdAt,
          isRead: data.message.isRead,
        };

        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? savedMsg : msg))
        );

        return data;
      } catch (err: any) {
        console.error("sendMessage error:", err);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setError(err.message || "Failed to send message");
        throw err;
      }
    },
    [conversationId]
  );

  // Mark all messages in this conversation as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return null;
    try {
      const response = await fetch("/api/chat/read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to mark conversation as read");
      }

      const updatedConversation = await response.json();
      return updatedConversation;
    } catch (err) {
      console.error("markAsRead error:", err);
      return null;
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    refresh: () => conversationId && fetchMessages(conversationId),
    sendMessage,
    markAsRead,
    setMessages,
  };
}
