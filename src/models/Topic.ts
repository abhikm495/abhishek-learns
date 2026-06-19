import mongoose, { Schema, Document, Model } from "mongoose";

export type BlockType =
  | "heading"
  | "paragraph"
  | "code"
  | "youtube"
  | "link"
  | "callout"
  | "bullets"
  | "divider";

export interface IBlock {
  type: BlockType;
  text?: string;
  level?: number;
  code?: string;
  language?: string;
  url?: string;
  title?: string;
  description?: string;
  items?: string[];
  variant?: string;
}

export interface ITopic extends Document {
  track: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  order: number;
  blocks: IBlock[];
}

const BlockSchema = new Schema<IBlock>(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph", "code", "youtube", "link", "callout", "bullets", "divider"],
      required: true,
    },
    text: { type: String },
    level: { type: Number },
    code: { type: String },
    language: { type: String },
    url: { type: String },
    title: { type: String },
    description: { type: String },
    items: [{ type: String }],
    variant: { type: String },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    track: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    blocks: { type: [BlockSchema], default: [] },
  },
  { timestamps: true }
);

TopicSchema.index({ track: 1, slug: 1 }, { unique: true });

export const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
