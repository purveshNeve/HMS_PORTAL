import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();

    const isAdmin = !session?.user || session.user.role?.toUpperCase() === "ADMIN";

    const { conversationId } = await params;
    if (!conversationId || !Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json({ message: "Invalid conversation ID" }, { status: 400 });
    }

    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
    }

    if (!isAdmin) {
      // Employee must own this conversation
      const userId = session?.user?.id;
      if (!userId || !Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (conversation.employeeId.toString() !== userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    const messages = await ChatService.getMessages(conversationId);
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("GET /api/chat/messages/[conversationId] error:", error);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}
