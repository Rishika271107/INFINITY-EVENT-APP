const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// ─── HELPER: SEND OTP ──────────────────────────────────────
const sendOTP = async (email, username = "User") => {
  const otp = otpGenerator.generate(6, {
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
  await sendEmail(
    email,
    "OTP Verification - Infinity Grand Events",
    `Hello ${username}, your OTP is: ${otp}. Valid for 30 minutes.`,
    otp
  );

  console.log(`✅ EMAIL SENT to ${email}`);
  return { success: true };
};

// ─── REGISTER USER ─────────────────────────────────────────
exports.registerUser = async (req, res) => {
  console.log("DEBUG: REGISTER REQUEST BODY:", req.body);
  try {
    let { username, email, phone, password } = req.body;
    email = email.trim().toLowerCase();

    let user = await User.findOne({ email });

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

    // Generate and send OTP (Helper handles logs)
    await sendOTP(email, username);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for OTP."
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    // If it's an email error, provide a clearer message
    const errMsg = error?.message || "";
    const errorMessage = errMsg.includes("SMTP") || error.code 
      ? "Registration failed: Could not send OTP email. Please check your SMTP settings." 
      : errMsg || "An unknown error occurred.";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

// ─── LOGIN USER ────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  console.log("DEBUG: LOGIN REQUEST BODY:", req.body);
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Account not found. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Direct Login without OTP
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: "Login successful",
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
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN LOGIN ───────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  console.log("DEBUG: ADMIN LOGIN REQUEST BODY:", req.body);
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized. Admin access only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Direct Admin Login without OTP
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
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
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── VERIFY OTP ────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Check your email or console." });
    }

    if (user.otpExpiry < Date.now()) {
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
      return res.status(400).json({ message: "Invalid OTP. Check your email." });
    }

    if (user.otpExpiry < Date.now()) {
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