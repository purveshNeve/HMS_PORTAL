import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await auth();

    // Admin has no authentication — they see all conversations
    const isAdmin = !session?.user || session.user.role?.toUpperCase() === "ADMIN";

    if (isAdmin) {
      const conversations = await ChatService.getConversationsForUser("", "ADMIN");
      return NextResponse.json(conversations, { status: 200 });
    }

    // Employee — must be authenticated
    const userId = session?.user?.id;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const conversations = await ChatService.getConversationsForUser(userId, "EMPLOYEE");
    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("GET /api/chat/conversation error:", error);
    return NextResponse.json({ message: "Failed to fetch conversations" }, { status: 500 });
  }
}
