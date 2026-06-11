const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

const logAuthEvent = (payload) => {
  console.log({
    ...payload,
    timestamp: new Date().toISOString(),
  });
};

// ─── HELPER: SEND OTP ──────────────────────────────────────
const sendOTP = async (email, username = "User", providedOtp = null) => {
  const otp = providedOtp || otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
  const otpExpiry = Date.now() + 30 * 60 * 1000;

  console.log(`\n************************************`);
  console.log(`🔥 OTP FOR ${email}: ${otp}`);
  console.log(`************************************\n`);

  // Update DB with OTP
  await User.findOneAndUpdate(
    { email },
    { otp, otpExpiry },
    { new: true }
  );

  // Attempt Email Delivery
  try {
    await sendEmail(
      email,
      "OTP Verification - Infinity Grand Events",
      `Hello ${username}, your OTP is: ${otp}. Valid for 30 minutes.`,
      otp
    );

    console.log(`✅ EMAIL SENT to ${email}`);
    return { success: true, emailSent: true };
  } catch (error) {
    console.error("OTP EMAIL SEND FAILED:", error);
    return { success: true, emailSent: false, error };
  }
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
    let otp = null;

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists and is verified. Please login." });
      }
      // If user exists but not verified, update them and send new OTP
      console.log("User exists but not verified. Updating and resending OTP...");
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

    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    const otpExpiry = Date.now() + 30 * 60 * 1000;
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true }
    );
    console.log("OTP STORED:", email);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP is being delivered.",
      otpSent: true
    });

    console.log("BACKGROUND OTP SEND STARTED:", email);
    sendOTP(email, username, otp)
      .then(() => {
        console.log("BACKGROUND OTP SEND SUCCESS:", email);
      })
      .catch((error) => {
        console.error("BACKGROUND OTP SEND FAILED:", error);
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
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
    }

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






// ─── VERIFY OTP ────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      logAuthEvent({
        action: "OTP_FAILURE",
        email,
        reason: "invalid_otp",
      });
      return res.status(400).json({ message: "Invalid OTP. Check your email or console." });
    }

    if (user.otpExpiry < Date.now()) {
      logAuthEvent({
        action: "OTP_FAILURE",
        email,
        reason: "expired_otp",
      });
      return res.status(400).json({ message: "OTP Expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);
    console.log("✅ USER VERIFIED & JWT CREATED");

    res.status(200).json({
      success: true,
      message: "Verification successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── RESEND OTP ────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendOTP(email, user.username);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent."
    });
  } catch (error) {
    console.error("RESEND ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── FORGOT PASSWORD ───────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with that email address." });
    }

    await sendOTP(email, user.username);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for password reset."
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    const errMsg = error?.message || "";
    const errorMessage = errMsg.includes("SMTP") || error.code 
      ? "Could not send OTP email. Please try again later." 
      : errMsg || "An unknown error occurred.";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

// ─── RESET PASSWORD ────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      logAuthEvent({
        action: "OTP_FAILURE",
        email,
        reason: "invalid_otp",
      });
      return res.status(400).json({ message: "Invalid OTP. Check your email." });
    }

    if (user.otpExpiry < Date.now()) {
      logAuthEvent({
        action: "OTP_FAILURE",
        email,
        reason: "expired_otp",
      });
      return res.status(400).json({ message: "OTP Expired. Please request a new one." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login."
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

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
