import type { GoalComment } from "@/lib/goals.types";

export type GoalCommentRole = "manager" | "employee";

export interface GoalCommentPayload {
  goalId: string;
  comment: GoalComment & { authorRole?: GoalCommentRole };
}

export interface GoalCommentSendPayload {
  goalId: string;
  text: string;
  author: string;
  authorRole: GoalCommentRole;
  userId: string;
}

export interface GoalCommentJoinPayload {
  goalId: string;
}

export const GOAL_COMMENTS_SOCKET_PATH = "/api/socketio";

export const GOAL_COMMENTS_EVENTS = {
  JOIN: "goalComment:join",
  LEAVE: "goalComment:leave",
  SEND: "goalComment:send",
  NEW: "goalComment:new",
  ERROR: "goalComment:error",
} as const;
