import { io, Socket } from "socket.io-client";

// Chat event constants matching client-server requirements
export const CHAT_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  NEW_MESSAGE: "chat:new_message",
  SEND_MESSAGE: "chat:send_message",
  MESSAGE_READ: "chat:message_read",
  CONVERSATION_UPDATED: "chat:conversation_updated",
  UNREAD_COUNT_UPDATED: "chat:unread_count_updated",
  USER_TYPING: "chat:user_typing",
  STOP_TYPING: "chat:stop_typing",
  USER_ONLINE: "chat:user_online",
  USER_OFFLINE: "chat:user_offline",
} as const;

const SOCKET_PATH = "/api/socketio";

function getSocketUrl() {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
}

let socketInstance: Socket | null = null;

export function getChatSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socketInstance) {
    console.log("🔌 Initializing singleton chat socket connection...");
    socketInstance = io(getSocketUrl(), {
      path: SOCKET_PATH,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      addTrailingSlash: false,
    });
  }

  return socketInstance;
}
