"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import ConversationSidebar from "./ConversationSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useChatSocket } from "@/hooks/useChatSocket";
import { playNotificationSound } from "@/lib/audio";

interface EmployeeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-zinc-850" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-1/3" />
              <div className="h-2.5 bg-slate-100 dark:bg-zinc-850 rounded w-10" />
            </div>
            <div className="h-3 bg-slate-100 dark:bg-zinc-850 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex w-full animate-pulse ${
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

export default function EmployeeChatModal({ isOpen, onClose }: EmployeeChatModalProps) {
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    refresh: refreshConversations,
    clearUnreadCount,
    updateConversationLastMessage,
    setConversations,
  } = useConversations();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId) || null;
  }, [conversations, selectedConvId]);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    refresh: refreshMessages,
    sendMessage,
    markAsRead,
    setMessages,
  } = useMessages(selectedConvId);

  const emitMessageReadRef = useRef<((id: string) => void) | null>(null);

  // Initialize socket for real-time messages and status sync
  const { sendSocketMessage, emitMessageRead, emitTyping, emitStopTyping, isConnected } = useChatSocket({
    onNewMessage: useCallback((payload: { conversationId: string; message: any }) => {
      const { conversationId, message } = payload;
      
      // Play synthesized notification sound for incoming messages only
      if (message.senderRole !== "ADMIN") {
        playNotificationSound();
      }

      const newMsg = {
        id: message._id,
        senderRole: message.senderRole,
        message: message.message,
        createdAt: message.createdAt,
        isRead: message.isRead,
      };

      // 1. If received message belongs to active conversation, append immediately
      if (conversationId === selectedConvId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        clearUnreadCount(conversationId);
        emitMessageReadRef.current?.(conversationId);
      } else {
        // 2. Otherwise increment unread count for sidebar conversation preview
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: c.unreadCount + 1 } : c
          )
        );
      }

      // 3. Move the updated conversation to the top of the sidebar list
      setConversations((prev) => {
        const targetIdx = prev.findIndex((c) => c.id === conversationId);
        if (targetIdx === -1) {
          refreshConversations();
          return prev;
        }

        const updated = [...prev];
        updated[targetIdx] = {
          ...updated[targetIdx],
          lastMessage: message.message,
          lastMessageTime: message.createdAt,
        };

        const [moved] = updated.splice(targetIdx, 1);
        return [moved, ...updated];
      });
    }, [selectedConvId, setMessages, setConversations, clearUnreadCount, refreshConversations]),

    onMessageRead: useCallback((payload: { conversationId: string }) => {
      // Reflect read status for sent messages when other participant reads
      if (payload.conversationId === selectedConvId) {
        setMessages((prev) =>
          prev.map((m) => (m.senderRole === "ADMIN" ? { ...m, isRead: true } : m))
        );
      }
    }, [selectedConvId, setMessages]),

    onConversationUpdated: useCallback(() => {
      refreshConversations();
    }, [refreshConversations]),

    onUserOnline: useCallback((payload: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.add(payload.userId);
        return next;
      });
    }, []),

    onUserOffline: useCallback((payload: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(payload.userId);
        return next;
      });
    }, []),

    onUserTyping: useCallback((payload: { conversationId: string; userId: string; userName: string }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [payload.conversationId]: payload.userName,
      }));

      // Backup safety timer to remove typing status if STOP_TYPING fails to fire
      const safetyTimeout = setTimeout(() => {
        setTypingUsers((prev) => {
          if (prev[payload.conversationId] === payload.userName) {
            const copy = { ...prev };
            delete copy[payload.conversationId];
            return copy;
          }
          return prev;
        });
      }, 1500);
    }, []),

    onStopTyping: useCallback((payload: { conversationId: string; userId: string }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[payload.conversationId];
        return copy;
      });
    }, []),
  });

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Keep the ref in sync with latest handler instance
  useEffect(() => {
    emitMessageReadRef.current = emitMessageRead;
  }, [emitMessageRead]);

  // Read status synchronization on selecting/opening a chat
  useEffect(() => {
    if (selectedConvId) {
      clearUnreadCount(selectedConvId);
      markAsRead();
      emitMessageReadRef.current?.(selectedConvId);
    }
  }, [selectedConvId, clearUnreadCount, markAsRead]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    // selectedConvId is guaranteed when the MessageInput is visible
    if (!selectedConvId) return;

    try {
      const data = await sendMessage(messageText, "", "ADMIN");

      // Update local conversation list immediately (if we have the conversation object)
      if (activeConversation) {
        updateConversationLastMessage(
          activeConversation.id,
          data.message.message,
          data.message.createdAt
        );
      }

      // Emit SEND_MESSAGE over socket for instant backend broadcast
      sendSocketMessage({
        id: data.message._id,
        conversationId: data.conversation?._id || selectedConvId,
        receiverId: activeConversation?.employeeId || "",
        message: data.message.message,
        senderRole: "ADMIN",
        createdAt: data.message.createdAt,
      });
    } catch (err) {
      // Handled in hook
    }
  }, [selectedConvId, activeConversation, sendMessage, updateConversationLastMessage, sendSocketMessage]);

  const handleTypingEvent = useCallback(() => {
    if (selectedConvId) {
      emitTyping(selectedConvId, "Admin Support");
    }
  }, [selectedConvId, emitTyping]);

  const handleStopTypingEvent = useCallback(() => {
    if (selectedConvId) {
      emitStopTyping(selectedConvId);
    }
  }, [selectedConvId, emitStopTyping]);

  const activeUserOnlineStatus = activeConversation && onlineUserIds.has(activeConversation.employeeId)
    ? "Active now"
    : "Offline";

  const handleBackToList = useCallback(() => setSelectedConvId(null), []);

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
            className="relative z-10 w-full md:w-[850px] lg:w-[950px] h-full md:h-[95vh] md:m-4 flex flex-col bg-slate-50 dark:bg-zinc-950 md:rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-2xl overflow-hidden"
          >
            {/* Modal General Header */}
            <div className="hidden md:flex items-center justify-between px-5 py-3.5 bg-slate-100/60 dark:bg-zinc-900/60 border-b border-slate-200/50 dark:border-zinc-850">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  Employee Support Center
                  <span className="text-[10px] text-slate-400 lowercase font-normal">
                    ({isConnected ? "online" : "offline"})
                  </span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-850 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Close support center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar (Conversations List) */}
              <div
                className={`w-full md:w-[300px] lg:w-[340px] flex-shrink-0 h-full border-r border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col ${
                  selectedConvId ? "hidden md:flex" : "flex"
                }`}
              >
                {conversationsError ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="h-8 w-8 text-rose-500 mb-2 animate-bounce" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-zinc-350">
                      Failed to load conversations
                    </p>
                    <p className="text-3xs text-slate-400 dark:text-zinc-550 mt-1 max-w-[200px]">
                      {conversationsError}
                    </p>
                    <button
                      onClick={refreshConversations}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium bg-slate-900 dark:bg-zinc-800 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </button>
                  </div>
                ) : conversationsLoading && conversations.length === 0 ? (
                  <SidebarSkeleton />
                ) : (
                  <ConversationSidebar
                    conversations={conversations}
                    selectedConversationId={selectedConvId}
                    onSelectConversation={setSelectedConvId}
                    onlineUserIds={onlineUserIds}
                  />
                )}
              </div>

              {/* Right Chat Window */}
              <div
                className={`flex-1 min-w-0 h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden ${
                  !selectedConvId ? "hidden md:flex" : "flex"
                }`}
              >
                {!selectedConvId ? (
                  /* Empty state when no conversation is selected (Desktop only) */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-zinc-950/10">
                    <div className="h-16 w-16 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500 mb-5 shadow-sm">
                      <MessageSquare className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">
                      Select a Conversation
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
                      Choose an employee query from the list on the left to start viewing message histories and reply.
                    </p>
                  </div>
                ) : activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <ChatHeader
                      name={activeConversation.employeeName}
                      department={activeConversation.department}
                      avatarUrl={activeConversation.avatarUrl}
                      status={activeUserOnlineStatus}
                      onBack={handleBackToList}
                    />

                    {/* Messages Container */}
                    {messagesError ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/20 dark:bg-zinc-950/10">
                        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                          Error Loading Messages
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-xs leading-normal">
                          {messagesError}
                        </p>
                        <button
                          onClick={refreshMessages}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-gray-900 dark:bg-zinc-800 text-white rounded-xl hover:opacity-90 transition-opacity"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry Load
                        </button>
                      </div>
                    ) : messagesLoading && messages.length === 0 ? (
                      <ChatSkeleton />
                    ) : (
                      <MessageList
                        messages={messages}
                        activeEmployeeName={activeConversation.employeeName}
                        viewerRole="ADMIN"
                      />
                    )}

                    {/* Typing Indicator Bar */}
                    {typingUsers[activeConversation.id] && (
                      <div className="px-5 py-1 text-2xs text-slate-400 dark:text-zinc-500 italic bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-850 flex items-center gap-1.5 animate-pulse select-none">
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        {typingUsers[activeConversation.id]} is typing...
                      </div>
                    )}

                    {/* Input */}
                    <MessageInput
                      onSendMessage={handleSendMessage}
                      onTyping={handleTypingEvent}
                      onStopTyping={handleStopTypingEvent}
                    />
                  </>
                ) : (
                  /* selectedConvId is set but activeConversation not found yet — show loading */
                  <div className="flex-1 flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-zinc-700 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/3" />
                        <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded w-1/5" />
                      </div>
                    </div>
                    <ChatSkeleton />
                    <MessageInput
                      onSendMessage={handleSendMessage}
                      onTyping={handleTypingEvent}
                      onStopTyping={handleStopTypingEvent}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
