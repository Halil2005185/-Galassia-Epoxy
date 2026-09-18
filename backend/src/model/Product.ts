import mongoose, { Schema, Document, Model } from "mongoose";
import joi from "joi";
import Joi from "joi";
export interface ILocalizedText {
  ar: string;
  en: string;
  tr: string;
}

interface validateProductSchema {
  name: ILocalizedText;
  description: ILocalizedText;
  slug: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateProductSchema {
  name: ILocalizedText;
  description: ILocalizedText;
  slug: string;
  images: string[];
  category: mongoose.Types.ObjectId;
}

export interface IProduct extends Document {
  name: ILocalizedText;
  description: ILocalizedText;
  slug: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const localizedTextSchema = {
  ar: { type: String, required: true, trim: true },
  en: { type: String, required: true, trim: true },
  tr: { type: String, required: true, trim: true },
};

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: localizedTextSchema,
      required: true,
    },
    description: {
      type: localizedTextSchema,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase, alphanumeric, and hyphen-separated.",
      ],
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length >= 1 && v.length <= 5;
        },
        message: "A product must have between 1 and 5 images.",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);


  // Validation function for product schema using Joi
export function productValidationSchema(obj: validateProductSchema) {
  const Schema = Joi.object({
    name: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
      tr: Joi.string().required(),
    }).required(),
    description: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
      tr: Joi.string().required(),
    }).required(),
    slug: Joi.string()
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
      .messages({
        "string.pattern.base":
          "Slug must be lowercase, alphanumeric, and hyphen-separated.",
      }),
    images: Joi.array().items(Joi.string()).min(1).max(5).required(),
    category: Joi.string().length(24).hex().required(),
  });
  return Schema.validate(obj, { abortEarly: false });
}


export function UpdateProductValidationSchema(obj: Partial<UpdateProductSchema>) {
  const Schema = Joi.object({
    name: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
      tr: Joi.string().required(),
    }).required(),
    description: Joi.object({
      ar: Joi.string().required(),
      en: Joi.string().required(),
      tr: Joi.string().required(),
    }).required(),
    slug: Joi.string()
      .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
      .messages({
        "string.pattern.base":
          "Slug must be lowercase, alphanumeric, and hyphen-separated.",
      }),
    images: Joi.array().items(Joi.string()).min(1).max(5).required(),
    category: Joi.string().length(24).hex().required(),
  });
  return Schema.validate(obj, { abortEarly: false });
}


export default Product; 
