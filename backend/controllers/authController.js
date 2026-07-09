const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");
const logAuthEvent = (payload) => {
  console.log({
    ...payload,
    timestamp: new Date().toISOString(),
  });
};



// ─── REGISTER USER ─────────────────────────────────────────
exports.registerUser = async (req, res) => {
  console.log("REGISTER REQUEST:", req.body);
  try {
    let { username, email, phone, password } = req.body;
    
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists and is verified. Please login." });
      }
      // If user exists but not verified, update them
      console.log("User exists but not verified. Updating...");
      const hashedPassword = await bcrypt.hash(password, 10);
      user.username = username;
      user.phone = phone;
      user.password = hashedPassword;
      await user.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        email,
        phone,
        password: hashedPassword
      });
      console.log("NEW USER CREATED:", email);
    }

    // Auto‑verify user
    user.isVerified = true;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in."
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    const errMsg = error?.message || "";
    const status = error?.name === "ValidationError" ? 400 : 500;
    const errorMessage = errMsg || "Registration failed. Please try again.";
    res.status(status).json({ success: false, message: errorMessage });
  }
};

// ─── LOGIN USER ────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      user.isBlocked = false;
      await user.save();
      logAuthEvent({
        action: "LOCK_RESET",
        email: user.email,
        role: user.role,
      });
    }

    // Phase 1: Block check
    if (user.isBlocked && !(user.lockUntil && user.lockUntil < Date.now())) {
      return res.status(403).json({ success: false, message: "Account is blocked. Contact support." });
    }

    // Phase 2: Temporary lock check
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ success: false, message: "Account temporarily locked. Try again later." });
    }

    // Phase 3: Verification check


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.isBlocked = true;
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        logAuthEvent({
          action: "ACCOUNT_LOCKED",
          email: user.email,
          role: user.role,
          failedLoginAttempts: user.failedLoginAttempts,
          lockUntil: user.lockUntil,
        });
      } else {
        logAuthEvent({
          action: "LOGIN_FAILED",
          email: user.email,
          role: user.role,
          failedLoginAttempts: user.failedLoginAttempts,
        });
      }
      await user.save();
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // Successful login: reset counters and update lastLogin
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.isBlocked = false;
    if (user.role === "admin") {
      user.isVerified = true;
    }
    user.lastLogin = new Date();
    await user.save();
    logAuthEvent({
      action: "LOGIN_SUCCESS",
      email: user.email,
      role: user.role,
    });

    // Generate JWT with user ID
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Duplicate loginUser implementation removed






// ─── GET USER PROFILE ──────────────────────────────────────
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE USER PROFILE ───────────────────────────────────
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.phone = req.body.phone || user.phone;
      
      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
