import { useEffect, useState, useCallback, useRef } from "react";
import { getChatSocket, CHAT_EVENTS } from "@/lib/socket";

interface ChatSocketOptions {
  onNewMessage?: (message: any) => void;
  onConversationUpdated?: (conversation: any) => void;
  onUnreadCountUpdated?: (data: any) => void;
  onMessageRead?: (data: any) => void;
  onUserTyping?: (data: { conversationId: string; userId: string; userName: string }) => void;
  onStopTyping?: (data: { conversationId: string; userId: string }) => void;
  onUserOnline?: (data: { userId: string }) => void;
  onUserOffline?: (data: { userId: string }) => void;
}

export function useChatSocket(options: ChatSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const socket = getChatSocket();

  // Setup options ref to keep the listener callbacks always up-to-date without rebuilding the effect
  const optionsRef = useRef(options);
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const handleConnect = () => {
      console.log("🟢 Chat socket connected successfully!");
      setIsConnected(true);
      setIsReconnecting(false);
    };

    const handleDisconnect = () => {
      console.log("🔴 Chat socket disconnected!");
      setIsConnected(false);
    };

    const handleReconnectAttempt = () => {
      console.log("🔄 Reconnecting chat socket...");
      setIsReconnecting(true);
    };

    const handleNewMessage = (payload: any) => {
      optionsRef.current.onNewMessage?.(payload);
    };

    const handleConversationUpdated = (payload: any) => {
      optionsRef.current.onConversationUpdated?.(payload);
    };

    const handleUnreadCountUpdated = (payload: any) => {
      optionsRef.current.onUnreadCountUpdated?.(payload);
    };

    const handleMessageRead = (payload: any) => {
      optionsRef.current.onMessageRead?.(payload);
    };

    const handleUserTyping = (payload: any) => {
      optionsRef.current.onUserTyping?.(payload);
    };

    const handleStopTyping = (payload: any) => {
      optionsRef.current.onStopTyping?.(payload);
    };

    const handleUserOnline = (payload: any) => {
      optionsRef.current.onUserOnline?.(payload);
    };

    const handleUserOffline = (payload: any) => {
      optionsRef.current.onUserOffline?.(payload);
    };

    // Register status listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("reconnect", handleConnect);

    // Register custom chat event listeners
    socket.on(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(CHAT_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
    socket.on(CHAT_EVENTS.UNREAD_COUNT_UPDATED, handleUnreadCountUpdated);
    socket.on(CHAT_EVENTS.MESSAGE_READ, handleMessageRead);
    socket.on(CHAT_EVENTS.USER_TYPING, handleUserTyping);
    socket.on(CHAT_EVENTS.STOP_TYPING, handleStopTyping);
    socket.on(CHAT_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(CHAT_EVENTS.USER_OFFLINE, handleUserOffline);

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Clean up event listeners on unmount (keep socket connection alive)
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("reconnect", handleConnect);
      
      socket.off(CHAT_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(CHAT_EVENTS.CONVERSATION_UPDATED, handleConversationUpdated);
      socket.off(CHAT_EVENTS.UNREAD_COUNT_UPDATED, handleUnreadCountUpdated);
      socket.off(CHAT_EVENTS.MESSAGE_READ, handleMessageRead);
      socket.off(CHAT_EVENTS.USER_TYPING, handleUserTyping);
      socket.off(CHAT_EVENTS.STOP_TYPING, handleStopTyping);
      socket.off(CHAT_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(CHAT_EVENTS.USER_OFFLINE, handleUserOffline);
    };
  }, [socket]);

  // Send a message event via socket
  const sendSocketMessage = useCallback(
    (messagePayload: {
      id?: string;
      conversationId?: string;
      receiverId: string;
      message: string;
      senderRole: "ADMIN" | "EMPLOYEE";
      createdAt: string | Date;
    }) => {
      if (socket?.connected) {
        socket.emit(CHAT_EVENTS.SEND_MESSAGE, messagePayload);
      } else {
        console.warn("⚠️ Unable to emit SEND_MESSAGE: Socket not connected");
      }
    },
    [socket]
  );

  // Emit conversation read status
  const emitMessageRead = useCallback(
    (conversationId: string) => {
      if (socket?.connected) {
        socket.emit(CHAT_EVENTS.MESSAGE_READ, { conversationId });
      }
    },
    [socket]
  );

  // Emit typing indicator
  const emitTyping = useCallback(
    (conversationId: string, userName: string) => {
      if (socket?.connected) {
        socket.emit(CHAT_EVENTS.USER_TYPING, { conversationId, userName });
      }
    },
    [socket]
  );

  // Emit stop typing
  const emitStopTyping = useCallback(
    (conversationId: string) => {
      if (socket?.connected) {
        socket.emit(CHAT_EVENTS.STOP_TYPING, { conversationId });
      }
    },
    [socket]
  );

  return {
    isConnected,
    isReconnecting,
    sendSocketMessage,
    emitMessageRead,
    emitTyping,
    emitStopTyping,
    socket,
  };
}
