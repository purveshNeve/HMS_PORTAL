import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ChatService } from "@/services/chat.service";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Determine if this is the admin (no session / role = ADMIN)
    const isAdmin = !session?.user || session.user.role?.toUpperCase() === "ADMIN";

    const body = await req.json().catch(() => ({}));
    const { message, conversationId, employeeId } = body;

    // Validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ message: "Message content cannot be empty" }, { status: 400 });
    }

    if (isAdmin) {
      // Admin is sending — must provide either conversationId or employeeId
      if (!conversationId && !employeeId) {
        return NextResponse.json(
          { message: "conversationId or employeeId is required" },
          { status: 400 }
        );
      }

      let result;

      if (conversationId) {
        if (!Types.ObjectId.isValid(conversationId)) {
          return NextResponse.json({ message: "Invalid conversationId" }, { status: 400 });
        }
        result = await ChatService.sendMessageToConversation(
          conversationId,
          "ADMIN",
          message.trim()
        );
      } else {
        if (!Types.ObjectId.isValid(employeeId)) {
          return NextResponse.json({ message: "Invalid employeeId" }, { status: 400 });
        }
        result = await ChatService.sendMessage(
          "", // Admin has no DB senderId
          "ADMIN",
          employeeId,
          message.trim(),
          employeeId // receiverId = employee
        );
      }

      return NextResponse.json(result, { status: 201 });
    }

    // Employee sending — must be authenticated
    const senderId = session?.user?.id;
    if (!senderId || !Types.ObjectId.isValid(senderId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // conversationId is optional — if absent, the employee starts a new conversation with admin

    let result;

    if (conversationId) {
      if (!Types.ObjectId.isValid(conversationId)) {
        return NextResponse.json({ message: "Invalid conversationId" }, { status: 400 });
      }
      try {
        result = await ChatService.sendMessageToConversation(
          conversationId,
          "EMPLOYEE",
          message.trim(),
          senderId
        );
      } catch (err: any) {
        if (err.message === "Conversation not found") {
          return NextResponse.json({ message: err.message }, { status: 404 });
        }
        if (err.message === "Sender is not a participant in this conversation") {
          return NextResponse.json({ message: err.message }, { status: 403 });
        }
        throw err;
      }
    } else {
      // employeeId === senderId when employee starts a conversation
      result = await ChatService.sendMessage(
        senderId,
        "EMPLOYEE",
        senderId, // employeeId is themselves
        message.trim()
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/messages error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
