"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { GoalComment } from "@/lib/goals.types";
import {
  GOAL_COMMENTS_EVENTS,
  GOAL_COMMENTS_SOCKET_PATH,
  type GoalCommentPayload,
  type GoalCommentRole,
} from "./goalComments.types";

function getSocketUrl() {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
}

export function displayCommentAuthor(
  comment: GoalComment & { authorRole?: GoalCommentRole },
  viewerRole: GoalCommentRole
) {
  if (comment.authorRole === viewerRole) return "You";
  if (comment.authorRole === "manager") return "Manager";
  if (comment.authorRole === "employee") return "Employee";
  return comment.author;
}

class GoalCommentsClient {
  private socket: Socket | null = null;
  private listeners = new Set<(payload: GoalCommentPayload) => void>();

  connect() {
    if (this.socket?.connected) return this.socket;

    if (!this.socket) {
      this.socket = io(getSocketUrl(), {
        path: GOAL_COMMENTS_SOCKET_PATH,
        autoConnect: false,
        transports: ["websocket", "polling"],
      });

      this.socket.on(GOAL_COMMENTS_EVENTS.NEW, (payload: GoalCommentPayload) => {
        this.listeners.forEach((listener) => listener(payload));
      });
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  joinGoal(goalId: string) {
    this.connect().emit(GOAL_COMMENTS_EVENTS.JOIN, { goalId });
  }

  leaveGoal(goalId: string) {
    this.socket?.emit(GOAL_COMMENTS_EVENTS.LEAVE, { goalId });
  }

  onComment(listener: (payload: GoalCommentPayload) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async sendComment(params: {
    goalId: string;
    text: string;
    author: string;
    authorRole: GoalCommentRole;
    userId: string;
  }): Promise<GoalComment & { authorRole?: GoalCommentRole }> {
    const socket = this.connect();

    if (socket.connected) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket timeout"));
        }, 10000);

        socket.emit(
          GOAL_COMMENTS_EVENTS.SEND,
          params,
          (response: { ok: boolean; comment?: GoalComment; message?: string }) => {
            clearTimeout(timeout);
            if (response?.ok && response.comment) {
              resolve(response.comment);
            } else {
              reject(new Error(response?.message || "Failed to send comment"));
            }
          }
        );
      });
    }

    return sendCommentViaHttp(params.goalId, params.text);
  }
}

let clientInstance: GoalCommentsClient | null = null;

export function getGoalCommentsClient() {
  if (!clientInstance) {
    clientInstance = new GoalCommentsClient();
  }
  return clientInstance;
}

async function sendCommentViaHttp(goalId: string, text: string) {
  const res = await fetch(`/api/goals/${goalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "addComment", text }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to send comment");
  }

  return data.comment as GoalComment & { authorRole?: GoalCommentRole };
}

export function useGoalComments(options: {
  goalId: string | null;
  open: boolean;
  initialComments: GoalComment[];
  userRole: GoalCommentRole;
  userId: string;
  userName: string;
  onCommentAdded?: (comment: GoalComment & { authorRole?: GoalCommentRole }) => void;
}) {
  const {
    goalId,
    open,
    initialComments,
    userRole,
    userId,
    userName,
    onCommentAdded,
  } = options;

  const [comments, setComments] = useState(initialComments);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const onCommentAddedRef = useRef(onCommentAdded);
  onCommentAddedRef.current = onCommentAdded;

  useEffect(() => {
    setComments(initialComments);
  }, [goalId, initialComments]);

  useEffect(() => {
    if (!open || !goalId) return;

    const client = getGoalCommentsClient();
    client.connect();
    client.joinGoal(goalId);

    const socket = client.connect();
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    setConnected(socket.connected);

    const unsubscribe = client.onComment((payload) => {
      if (payload.goalId !== goalId) return;

      setComments((prev) => {
        if (prev.some((c) => c.id === payload.comment.id)) return prev;
        return [...prev, payload.comment];
      });
      onCommentAddedRef.current?.(payload.comment);
    });

    return () => {
      client.leaveGoal(goalId);
      unsubscribe();
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [open, goalId]);

  const sendComment = useCallback(
    async (text: string) => {
      if (!goalId || !text.trim()) return;

      setSending(true);
      try {
        const client = getGoalCommentsClient();
        const wasConnected = client.isConnected();
        const comment = await client.sendComment({
          goalId,
          text: text.trim(),
          author: userName,
          authorRole: userRole,
          userId,
        });

        // HTTP fallback has no broadcast — update local state here
        if (!wasConnected) {
          setComments((prev) => {
            if (prev.some((c) => c.id === comment.id)) return prev;
            return [...prev, comment];
          });
          onCommentAddedRef.current?.(comment);
        }
      } finally {
        setSending(false);
      }
    },
    [goalId, userId, userName, userRole]
  );
  return { comments, sendComment, connected, sending };
}
