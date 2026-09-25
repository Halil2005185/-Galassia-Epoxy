// One-time setup script — there is no registration endpoint by design
// (single admin account), so this is how that one account gets created.
// Run with: npm run seed:admin
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../model/Admin.js";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to seed the admin account."
    );
    process.exit(1);
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    console.log(`Admin account for ${normalizedEmail} already exists. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email: normalizedEmail, passwordHash });

  console.log(`Admin account created for ${normalizedEmail}.`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin account:", err);
  process.exit(1);
});
