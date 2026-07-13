import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    holidayId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
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

export default mongoose.models.Holidays || mongoose.model("Holidays", HolidaySchema);
