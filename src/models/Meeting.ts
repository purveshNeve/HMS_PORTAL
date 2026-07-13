import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    attendees: {
      type: [String],
      default: [],
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

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
