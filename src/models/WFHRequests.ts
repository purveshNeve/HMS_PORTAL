import mongoose from "mongoose";

const WorkFromHomeSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    managerId: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    notifyManager: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const WFHRequests =
  mongoose.models.WFHRequests ||
  mongoose.model("WFHRequests", WorkFromHomeSchema);

export default WFHRequests;