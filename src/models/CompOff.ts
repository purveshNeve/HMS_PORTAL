import mongoose from "mongoose";

const CompOffSchema = new mongoose.Schema(
  {
    compOffId: {
      type: String,
      required: true,
      unique: true,
    },
    compOffRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompOffRequest",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    workType: {
      type: String,
      enum: [
        "Weekend Deployment Support",
        "Critical Release Weekend Work",
        "Holiday On-call Duty",
        "Production Support",
        "Emergency Maintenance",
        "Other",
      ],
      required: true,
    },
    days: {
      type: Number,
      required: true,
      default: 0,
    },
    reason: {
      type: String,
      default: "",
    },
    earnedOn: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Used", "Expired"],
      default: "Available",
    },
    usedDays: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "compoffs" }
);

export default mongoose.models.CompOff ||
  mongoose.model("CompOff", CompOffSchema);
