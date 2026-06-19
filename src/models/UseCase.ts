import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUseCase extends Document {
  patternId: Types.ObjectId;
  title: string;
  description: string;
  techExample: string;
  companyOrProduct?: string;
}

const UseCaseSchema = new Schema<IUseCase>(
  {
    patternId: { type: Schema.Types.ObjectId, ref: "Pattern", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    techExample: { type: String, default: "" },
    companyOrProduct: { type: String },
  },
  { timestamps: true }
);

export const UseCase: Model<IUseCase> =
  mongoose.models.UseCase || mongoose.model<IUseCase>("UseCase", UseCaseSchema);
