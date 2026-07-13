import { Types } from "mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { dbConnect } from "@/lib/db";

export class ChatService {
  /**
   * Find or create a conversation for an employee.
   * There is exactly one conversation per employee (with the single system admin).
   */
  static async findOrCreateConversation(employeeId: string) {
    await dbConnect();

    let conversation = await Conversation.findOne({
      employeeId: new Types.ObjectId(employeeId),
    });

    if (!conversation) {
      try {
        conversation = await Conversation.create({
          employeeId: new Types.ObjectId(employeeId),
          unreadForAdmin: 0,
          unreadForEmployee: 0,
        });
      } catch (error: any) {
        // Handle race conditions
        if (error.code === 11000) {
          conversation = await Conversation.findOne({
            employeeId: new Types.ObjectId(employeeId),
          });
        } else {
          throw error;
        }
      }
    }

    return conversation;
  }

  /**
   * Send a message from an employee to the admin (or admin to employee).
   * Admin has no userId in DB — only the employeeId is stored in the conversation.
   */
  static async sendMessage(
    senderId: string,
    senderRole: "EMPLOYEE" | "ADMIN",
    employeeId: string, // Always required — identifies which employee conversation
    messageText: string,
    receiverId?: string  // Optional: employee's userId when admin is sending
  ) {
    await dbConnect();

    const conversation = await this.findOrCreateConversation(employeeId);

    const messageDoc: any = {
      conversationId: conversation._id,
      senderRole,
      message: messageText,
      isRead: false,
    };

    if (senderRole === "EMPLOYEE") {
      messageDoc.senderId = new Types.ObjectId(senderId);
      messageDoc.receiverRole = "ADMIN";
      // No receiverId stored for admin (not in DB)
    } else {
      // Admin sending — store the employee as receiverId
      messageDoc.receiverRole = "EMPLOYEE";
      if (employeeId && Types.ObjectId.isValid(employeeId)) {
        messageDoc.receiverId = new Types.ObjectId(employeeId);
      }
    }

    const message = await Message.create(messageDoc);

    const updateField = senderRole === "EMPLOYEE" ? "unreadForAdmin" : "unreadForEmployee";

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversation._id,
      {
        $set: {
          lastMessage: messageText,
          lastMessageTime: new Date(),
        },
        $inc: {
          [updateField]: 1,
        },
      },
      { new: true }
    )
      .populate("employeeId", "name email userId profileImage department")
      .lean();

    return {
      conversation: updatedConversation,
      message: message.toObject(),
    };
  }

  /**
   * Send a message to an existing conversation by conversationId.
   */
  static async sendMessageToConversation(
    conversationId: string,
    senderRole: "EMPLOYEE" | "ADMIN",
    messageText: string,
    senderId?: string  // Employee's userId (if sender is EMPLOYEE)
  ) {
    await dbConnect();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // If employee is sending, verify they belong to this conversation
    if (senderRole === "EMPLOYEE" && senderId) {
      if (conversation.employeeId.toString() !== senderId) {
        throw new Error("Sender is not a participant in this conversation");
      }
    }

    const messageDoc: any = {
      conversationId: conversation._id,
      senderRole,
      message: messageText,
      isRead: false,
    };

    if (senderRole === "EMPLOYEE" && senderId) {
      messageDoc.senderId = new Types.ObjectId(senderId);
      messageDoc.receiverRole = "ADMIN";
      // No receiverId stored for admin (not in DB)
    } else {
      // Admin sending — receiverId is the employee
      messageDoc.receiverRole = "EMPLOYEE";
      messageDoc.receiverId = conversation.employeeId;
    }

    const message = await Message.create(messageDoc);

    const updateField = senderRole === "EMPLOYEE" ? "unreadForAdmin" : "unreadForEmployee";

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversation._id,
      {
        $set: {
          lastMessage: messageText,
          lastMessageTime: new Date(),
        },
        $inc: {
          [updateField]: 1,
        },
      },
      { new: true }
    )
      .populate("employeeId", "name email userId profileImage department")
      .lean();

    return {
      conversation: updatedConversation,
      message: message.toObject(),
    };
  }

  /**
   * Get ALL conversations (admin sees all; employee sees only their own).
   */
  static async getConversationsForUser(userId: string, role: "EMPLOYEE" | "ADMIN") {
    await dbConnect();

    const query =
      role === "ADMIN"
        ? {} // Admin sees ALL conversations
        : { employeeId: new Types.ObjectId(userId) };

    const conversations = await Conversation.find(query)
      .populate("employeeId", "name email userId profileImage department")
      .sort({ lastMessageTime: -1 })
      .lean();

    return conversations;
  }

  /**
   * Get all messages for a specific conversation.
   */
  static async getMessages(conversationId: string) {
    await dbConnect();

    const messages = await Message.find({
      conversationId: new Types.ObjectId(conversationId),
    })
      .sort({ createdAt: 1 })
      .lean();

    return messages;
  }

  /**
   * Mark messages as read in a conversation for a specific role.
   */
  static async markConversationAsRead(conversationId: string, role: "EMPLOYEE" | "ADMIN") {
    await dbConnect();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return null;
    }

    if (role === "ADMIN") {
      await Message.updateMany(
        {
          conversationId: conversation._id,
          senderRole: "EMPLOYEE",
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      const updated = await Conversation.findByIdAndUpdate(
        conversation._id,
        { $set: { unreadForAdmin: 0 } },
        { new: true }
      )
        .populate("employeeId", "name email userId profileImage department")
        .lean();

      return updated;
    } else {
      await Message.updateMany(
        {
          conversationId: conversation._id,
          senderRole: "ADMIN",
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      const updated = await Conversation.findByIdAndUpdate(
        conversation._id,
        { $set: { unreadForEmployee: 0 } },
        { new: true }
      )
        .populate("employeeId", "name email userId profileImage department")
        .lean();

      return updated;
    }
  }

  /**
   * Get total unread count.
   * Admin: sum of ALL conversations' unreadForAdmin.
   * Employee: their own conversation's unreadForEmployee.
   */
  static async getUnreadCount(userId: string, role: "EMPLOYEE" | "ADMIN") {
    await dbConnect();

    if (role === "ADMIN") {
      const result = await Conversation.aggregate([
        { $group: { _id: null, total: { $sum: "$unreadForAdmin" } } },
      ]);
      return result[0]?.total || 0;
    } else {
      const conversation = await Conversation.findOne({
        employeeId: new Types.ObjectId(userId),
      }).lean();
      return conversation?.unreadForEmployee || 0;
    }
  }
}
