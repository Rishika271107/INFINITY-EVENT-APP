const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const adminEmail = "admin@infinity.com";

async function unblockAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MONGO_URI environment variable.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");

    const result = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          isBlocked: false,
          failedLoginAttempts: 0,
          lockUntil: null,
          isVerified: true,
          role: "admin",
        },
      },
      { new: true }
    ).select("email role isBlocked failedLoginAttempts lockUntil isVerified");

    if (!result) {
      console.log("Admin account not found");
      process.exitCode = 1;
      return;
    }

    console.log({
      action: "ADMIN_RECOVERY",
      email: adminEmail,
      timestamp: new Date().toISOString(),
    });
    console.log("Admin account successfully restored");
    console.log({
      email: result.email,
      role: result.role,
      isBlocked: result.isBlocked,
      failedLoginAttempts: result.failedLoginAttempts,
      lockUntil: result.lockUntil,
      isVerified: result.isVerified,
    });
  } catch (error) {
    console.error("UNBLOCK ADMIN ERROR:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

unblockAdmin();
