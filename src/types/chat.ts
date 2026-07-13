import { Types } from "mongoose";

export interface IChatUser {
  _id: string;
  name: string;
  email: string;
  userId: string;
  role: "EMPLOYEE" | "MANAGER" | "ADMIN";
  profileImage?: string | null;
  department?: string;
}

export interface IConversation {
  _id: string;
  employeeId: string | IChatUser;
  adminId: string | IChatUser;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadForAdmin: number;
  unreadForEmployee: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  conversationId: string | IConversation;
  senderId: string | IChatUser;
  receiverId: string | IChatUser;
  senderRole: "EMPLOYEE" | "ADMIN";
  receiverRole: "EMPLOYEE" | "ADMIN";
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request Bodies
export interface ISendMessageRequest {
  message: string;
  receiverId?: string; // Optional for first message if conversationId is provided
  conversationId?: string; // Optional for first message
}

export interface IReadChatRequest {
  conversationId: string;
}

// Response Layouts
export interface IUnreadCountResponse {
  unread: number;
}
