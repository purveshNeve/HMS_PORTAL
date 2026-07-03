import mongoose from "mongoose";

const PayrollRecordSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    month: {
      // "YYYY-MM"
      type: String,
      required: true,
    },
    grossSalary: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 0 },
    lopDeduction: { type: Number, default: 0 },
    lopDays: { type: Number, default: 0 },
    totalLeaveDays: { type: Number, default: 0 },
    totalWFHDays: { type: Number, default: 0 },
    workingDays: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["PENDING", "SUBMITTED", "PROCESSED", "PAID"],
      default: "PENDING",
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    creditedDate: {
      type: Date,
      default: null,
    },
    submittedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound unique index: one record per employee per month
PayrollRecordSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.models.PayrollRecord ||
  mongoose.model("PayrollRecord", PayrollRecordSchema);
