import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPattern extends Document {
  categoryId: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  whenToUse: string[];
  order: number;
}

const PatternSchema = new Schema<IPattern>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    whenToUse: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PatternSchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export const Pattern: Model<IPattern> =
  mongoose.models.Pattern || mongoose.model<IPattern>("Pattern", PatternSchema);
