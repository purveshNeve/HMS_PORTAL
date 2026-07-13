import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One conversation per employee with the system admin
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadForAdmin: {
      type: Number,
      default: 0,
    },
    unreadForEmployee: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as any).Conversation;
}

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
