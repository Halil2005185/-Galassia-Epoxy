import mongoose, { Model } from "mongoose";import Joi from "joi";
export interface ILocalizedText {
  ar: string;
  en: string;
  tr: string;
}

export interface ICategory {
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


export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

// Validation function for category
export function categoryValidationSchema(obj: ICategory) {
  const schema = Joi.object({
    name: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
      tr: Joi.string().required(),
    }).required(),
    slug: Joi.string().required().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  });

  return schema.validate(obj);
}

// Validation function for updating category
export function updateCategoryValidationSchema(obj: Partial<ICategory>) {
  const schema = Joi.object({
    name: Joi.object({
      ar: Joi.string(),
      en: Joi.string(),
      tr: Joi.string(),
    }),
    slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  });
  return schema.validate(obj);
}
