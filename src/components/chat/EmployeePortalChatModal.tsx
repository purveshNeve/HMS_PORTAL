"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useMessages } from "@/hooks/useMessages";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useConversations } from "@/hooks/useConversations";
import { playNotificationSound } from "@/lib/audio";

interface EmployeePortalChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatSkeleton() {
  return (
    <div className="flex-grow space-y-6 p-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex w-full ${
            i % 2 === 0 ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`w-[60%] sm:w-[45%] h-14 rounded-2xl ${
              i % 2 === 0
                ? "bg-indigo-100/50 dark:bg-indigo-950/20"
                : "bg-slate-100 dark:bg-zinc-800"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default function EmployeePortalChatModal({
  isOpen,
  onClose,
}: EmployeePortalChatModalProps) {
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    refresh: refreshConversations,
    updateConversationLastMessage,
    clearUnreadCount,
  } = useConversations();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [adminInfo] = useState<{ name: string; avatarUrl?: string | null }>({
    name: "HR Admin Support",
  });
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);

  const emitMessageReadRef = useRef<((id: string) => void) | null>(null);

  // Auto-select the conversation when conversations list is fetched
  useEffect(() => {
    if (conversations.length > 0) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations]);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    refresh: refreshMessages,
    sendMessage,
    markAsRead,
    setMessages,
  } = useMessages(selectedConvId);

  // Initialize Socket.IO connection
  const { sendSocketMessage, emitMessageRead, emitTyping, emitStopTyping, isConnected } = useChatSocket({
    onNewMessage: useCallback((payload: { conversationId: string; message: any }) => {
      const { conversationId, message } = payload;
      
      // Play chime for incoming Admin messages
      if (message.senderRole === "ADMIN") {
        playNotificationSound();
      }

      const newMsg = {
        id: message._id,
        senderRole: message.senderRole,
        message: message.message,
        createdAt: message.createdAt,
        isRead: message.isRead,
      };

      // 1. If this message is for current chat room
      if (selectedConvId && conversationId === selectedConvId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        clearUnreadCount(conversationId);
        emitMessageReadRef.current?.(conversationId);
      } else {
        // First message received from Admin - refresh conversation list to link conversationId
        refreshConversations();
      }
    }, [selectedConvId, setMessages, clearUnreadCount, refreshConversations]),

    onMessageRead: useCallback((payload: { conversationId: string }) => {
      if (selectedConvId && payload.conversationId === selectedConvId) {
        setMessages((prev) =>
          prev.map((m) => (m.senderRole === "EMPLOYEE" ? { ...m, isRead: true } : m))
        );
      }
    }, [selectedConvId, setMessages]),

    onUserOnline: useCallback((_payload: { userId: string }) => {
      setIsAdminOnline(true);
    }, []),

    onUserOffline: useCallback((_payload: { userId: string }) => {
      setIsAdminOnline(false);
    }, []),

    onUserTyping: useCallback((payload: { conversationId: string; userId: string; userName: string }) => {
      if (selectedConvId && payload.conversationId === selectedConvId) {
        setIsAdminTyping(true);

        // Safety backup timer to clear typing state if STOP_TYPING isn't received
        setTimeout(() => {
          setIsAdminTyping(false);
        }, 1500);
      }
    }, [selectedConvId]),

    onStopTyping: useCallback((payload: { conversationId: string; userId: string }) => {
      if (selectedConvId && payload.conversationId === selectedConvId) {
        setIsAdminTyping(false);
      }
    }, [selectedConvId]),
  });

  // Keep Ref updated to solve TDZ error
  useEffect(() => {
    emitMessageReadRef.current = emitMessageRead;
  }, [emitMessageRead]);

  // Read message trigger
  useEffect(() => {
    if (selectedConvId) {
      clearUnreadCount(selectedConvId);
      markAsRead();
      emitMessageReadRef.current?.(selectedConvId);
    }
  }, [selectedConvId, clearUnreadCount, markAsRead]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    try {
      const data = await sendMessage(messageText, "", "EMPLOYEE");

      if (data.conversation) {
        if (!selectedConvId) {
          setSelectedConvId(data.conversation._id);
          refreshConversations();
        } else {
          updateConversationLastMessage(
            data.conversation._id,
            data.message.message,
            data.message.createdAt
          );
        }

        sendSocketMessage({
          id: data.message._id,
          conversationId: data.conversation._id,
          receiverId: typeof data.message.receiverId === "string"
            ? data.message.receiverId
            : (data.message.receiverId as any)?._id ?? "",
          message: data.message.message,
          senderRole: "EMPLOYEE",
          createdAt: data.message.createdAt,
        });
      }
    } catch (err) {
      // Handled in state
    }
  }, [selectedConvId, sendMessage, refreshConversations, updateConversationLastMessage, sendSocketMessage]);

  const handleTypingEvent = useCallback(() => {
    if (selectedConvId) {
      emitTyping(selectedConvId, "Employee Support");
    }
  }, [selectedConvId, emitTyping]);

  const handleStopTypingEvent = useCallback(() => {
    if (selectedConvId) {
      emitStopTyping(selectedConvId);
    }
  }, [selectedConvId, emitStopTyping]);

  const activeUserOnlineStatus = isAdminOnline ? "Active now" : "Offline";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
          {/* Glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Chat Container Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="relative z-10 w-full sm:w-[480px] h-full sm:h-[95vh] sm:m-4 flex flex-col bg-white dark:bg-zinc-900 sm:rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <ChatHeader
              name={adminInfo.name}
              department="Human Resources"
              avatarUrl={adminInfo.avatarUrl}
              status={isConnected ? activeUserOnlineStatus : "Connecting..."}
              onBack={onClose}
            />

            {/* Chat Body */}
            {conversationsError || (messagesError && selectedConvId) ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-zinc-950/10">
                <AlertCircle className="h-10 w-10 text-rose-500 mb-3 animate-bounce" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Failed to load support chat
                </h4>
                <p className="text-xs text-slate-400 dark:text-zinc-550 mt-1 max-w-xs leading-normal">
                  {conversationsError || messagesError}
                </p>
                <button
                  onClick={() => {
                    refreshConversations();
                    if (selectedConvId) refreshMessages();
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-gray-900 dark:bg-zinc-800 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry Connection
                </button>
              </div>
            ) : (conversationsLoading || (messagesLoading && selectedConvId)) &&
              messages.length === 0 ? (
              <ChatSkeleton />
            ) : (
              <MessageList
                messages={messages}
                activeEmployeeName={adminInfo.name}
                viewerRole="EMPLOYEE"
              />
            )}

            {/* Typing Indicator Bar */}
            {isAdminTyping && (
              <div className="px-5 py-1 text-2xs text-slate-400 dark:text-zinc-500 italic bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-850 flex items-center gap-1.5 animate-pulse select-none">
                <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                {adminInfo.name} is typing...
              </div>
            )}

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={handleTypingEvent}
              onStopTyping={handleStopTypingEvent}
              placeholder="Type your query to HR Support..."
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
