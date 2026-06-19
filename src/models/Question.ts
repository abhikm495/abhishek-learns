import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestionLink {
  platform: string;
  url: string;
  externalId?: string;
}

export interface IQuestion extends Document {
  patternId: Types.ObjectId;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  links: IQuestionLink[];
  tags: string[];
  order: number;
  completed: boolean;
}

const QuestionLinkSchema = new Schema<IQuestionLink>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    externalId: { type: String },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    patternId: { type: Schema.Types.ObjectId, ref: "Pattern", required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    links: [QuestionLinkSchema],
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

QuestionSchema.index({ patternId: 1, slug: 1 }, { unique: true });

export const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
