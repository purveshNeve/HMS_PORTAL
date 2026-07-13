import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    const isAdmin = !session?.user || session.user.role?.toUpperCase() === "ADMIN";

    const body = await req.json().catch(() => ({}));
    const { conversationId } = body;

    if (!conversationId || !Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json({ message: "Invalid or missing conversationId" }, { status: 400 });
    }

    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
    }

    if (isAdmin) {
      // Admin can mark any conversation as read
      const updated = await ChatService.markConversationAsRead(conversationId, "ADMIN");
      return NextResponse.json(updated, { status: 200 });
    }

    // Employee — must be authenticated and own the conversation
    const userId = session?.user?.id;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (conversation.employeeId.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await ChatService.markConversationAsRead(conversationId, "EMPLOYEE");
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/chat/read error:", error);
    return NextResponse.json({ message: "Failed to mark messages as read" }, { status: 500 });
  }
}
