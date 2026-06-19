import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ApproachType = "brute" | "better" | "optimal";

export interface ISolution extends Document {
  questionId: Types.ObjectId;
  approach: ApproachType;
  title: string;
  explanation: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  order: number;
}

const SolutionSchema = new Schema<ISolution>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    approach: {
      type: String,
      enum: ["brute", "better", "optimal"],
      required: true,
    },
    title: { type: String, required: true },
    explanation: { type: String, default: "" },
    code: { type: String, default: "" },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Solution: Model<ISolution> =
  mongoose.models.Solution || mongoose.model<ISolution>("Solution", SolutionSchema);
