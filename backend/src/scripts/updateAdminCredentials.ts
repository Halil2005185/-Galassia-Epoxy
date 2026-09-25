// Changes the single admin account's email/password to whatever is
// currently set in ADMIN_EMAIL / ADMIN_PASSWORD, instead of creating a
// second account (there is no multi-admin support by design).
// Run with: npm run update:admin
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../model/Admin.js";

async function updateAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to update the admin account."
    );
    process.exit(1);
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne({});

  if (!existing) {
    await Admin.create({ email: normalizedEmail, passwordHash });
    console.log(`No admin account existed yet — created one for ${normalizedEmail}.`);
    await mongoose.disconnect();
    return;
  }

  existing.email = normalizedEmail;
  existing.passwordHash = passwordHash;
  // Invalidates any refresh token issued before this change.
  existing.tokenVersion += 1;
  await existing.save();

  console.log(`Admin credentials updated. New login email: ${normalizedEmail}.`);
  await mongoose.disconnect();
}

updateAdminCredentials().catch((err) => {
  console.error("Failed to update admin credentials:", err);
  process.exit(1);
});
