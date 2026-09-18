import mongoose from "mongoose";

export interface ILocalizedText {
  ar: string;
  en: string;
  tr: string;
}

export interface ICategory extends mongoose.Document {
  name: ILocalizedText;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const localizedTextSchema = {
  ar: { type: String, required: true, trim: true },
  en: { type: String, required: true, trim: true },
  tr: { type: String, required: true, trim: true },
};


const categorySchema = new mongoose.Schema<ICategory>({
 name : {
    type: localizedTextSchema,
    required: true,
 },
 slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated."],
 },
},{ timestamps: true });


export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);