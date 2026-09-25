import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  // Incremented on logout (and mismatched on any refresh token issued
  // before that point) so every outstanding refresh token can be
  // invalidated in one step without a separate token-storage collection.
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function (this: IAdmin, candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

// Validation function for login
export function loginValidationSchema(obj: { email: string; password: string }) {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().required(),
  });

  return schema.validate(obj);
}

export default Admin;
