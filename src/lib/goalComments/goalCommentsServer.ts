import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { dbConnect } from "@/lib/db";
import GoalModel from "@/models/Goal";
import {
  GOAL_COMMENTS_EVENTS,
  GOAL_COMMENTS_SOCKET_PATH,
  type GoalCommentJoinPayload,
  type GoalCommentSendPayload,
} from "./goalComments.types";

let io: Server | null = null;

function goalRoom(goalId: string) {
  return `goal:${goalId}`;
}

async function persistComment(payload: GoalCommentSendPayload) {
  await dbConnect();

  const goal = await GoalModel.findById(payload.goalId);
  if (!goal) {
    throw new Error("Goal not found");
  }

  const isEmployee =
    payload.authorRole === "employee" && goal.assignedTo === payload.userId;
  const isManager =
    payload.authorRole === "manager" && goal.createdBy === payload.userId;

  if (!isEmployee && !isManager) {
    throw new Error("Not authorized to comment on this goal");
  }

  const comment = {
    id: Date.now().toString(),
    author: payload.author,
    authorRole: payload.authorRole,
    text: payload.text.trim(),
    date: new Date().toISOString().split("T")[0],
  };

  goal.comments.push(comment);
  await goal.save();

  return comment;
}

function registerGoalCommentHandlers(socket: Socket) {
  socket.on(GOAL_COMMENTS_EVENTS.JOIN, ({ goalId }: GoalCommentJoinPayload) => {
    if (!goalId) return;
    socket.join(goalRoom(goalId));
  });

  socket.on(GOAL_COMMENTS_EVENTS.LEAVE, ({ goalId }: GoalCommentJoinPayload) => {
    if (!goalId) return;
    socket.leave(goalRoom(goalId));
  });

  socket.on(
    GOAL_COMMENTS_EVENTS.SEND,
    async (payload: GoalCommentSendPayload, ack?: (result: unknown) => void) => {
      try {
        if (!payload?.goalId || !payload.text?.trim()) {
          throw new Error("goalId and text are required");
        }

        const comment = await persistComment(payload);

        io?.to(goalRoom(payload.goalId)).emit(GOAL_COMMENTS_EVENTS.NEW, {
          goalId: payload.goalId,
          comment,
        });

        ack?.({ ok: true, comment });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send comment";
        socket.emit(GOAL_COMMENTS_EVENTS.ERROR, { message });
        ack?.({ ok: false, message });
      }
    }
  );
}

export function initializeGoalCommentsServer(httpServer: HttpServer) {
  if (io) return io;

  io = new Server(httpServer, {
    path: GOAL_COMMENTS_SOCKET_PATH,
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    registerGoalCommentHandlers(socket);
  });

  console.log("[goalComments] WebSocket server ready at", GOAL_COMMENTS_SOCKET_PATH);
  return io;
}

export function getGoalCommentsIo() {
  return io;
}
