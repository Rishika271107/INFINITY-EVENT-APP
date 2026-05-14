const User = require("../models/User");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");



// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const otpExpiry = Date.now() + 30 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    await sendEmail(
      email,
      "OTP Verification",
      `Your OTP is ${otp}`
    );

    res.status(201).json({
      success: true,
      message: "User Registered. OTP sent to email"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired"
      });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// LOGIN USER
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your account first"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};