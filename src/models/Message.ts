import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional: admin has no DB user record
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional: admin has no DB user record
    },
    senderRole: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN"],
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index on conversationId for fast retrieval of message history
MessageSchema.index({ conversationId: 1 });

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as any).Message;
}

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
