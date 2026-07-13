import mongoose from "mongoose";

const UpcomingEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: "🎉",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    participants: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UpcomingEvents || mongoose.model("UpcomingEvents", UpcomingEventSchema);
