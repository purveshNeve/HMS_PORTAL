import mongoose, { Schema } from "mongoose";

const ResumeAnalysisSchema = new Schema(
  {
    fileName: { type: String, required: true },
    goal: { type: String, default: "" },
    parsedResume: { type: Schema.Types.Mixed, default: {} },
    analysis: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeAnalysis || mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
