import asyncHandler from "express-async-handler";
import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from '../config/emailService.js'; // Make sure to create this email service file

//@desc Register user
//@route POST /api/auth/register
const registerAccount = asyncHandler(async (req, res) => {
  console.log("Incoming body:", req.body);  
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // --- OTP Generation Logic ---
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // valid 10 mins

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // --- Create user ---
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    emailOtp: hashedOtp,
    emailOtpExpires: otpExpires,
    isEmailVerified: false,   // 🔑 Important!
  });

  if (user) {
    // Send OTP email
    await sendOtpEmail(user.email, otp);

    // ✅ Send email in response so frontend can use it
    return res.status(201).json({
      message: "Registration successful! An OTP has been sent to your email for verification.",
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// @desc Verify user's email with OTP
// @route POST /api/auth/verify-otp
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if OTP is still valid (not expired)
  if (user.emailOtpExpires < Date.now()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Compare the provided OTP with the stored hashed OTP
  const isOtpMatch = await bcrypt.compare(otp, user.emailOtp);
  if (!isOtpMatch) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Mark user as verified and clear OTP fields
  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  await user.save();

  // Now that the user is verified, create a JWT token and log them in
  const token = jwt.sign(
    {
      user: {
        name: user.username,
        email: user.email,
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2d" }
  );

  return res.status(200).json({
    message: "Email verified successfully!",
    token,
    user: { id: user._id, username: user.username, email: user.email }
  });
});


// @desc Login account
// @route POST /api/auth/login
const loginAccount = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // --- ADD THIS VERIFICATION CHECK ---
  if (!user.isEmailVerified) {
    res.status(403); // 403 Forbidden
    throw new Error("Please verify your email before logging in.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        user: {
          name: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    return res.status(200).json({ token, user });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});


// @desc Get account
// @route GET /api/auth/account
// @access Private
const getAccount = asyncHandler(async (req, res) => {
  // req.user is set in validateToken middleware
  const user = await userModel.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc Resend OTP
// @route POST /api/auth/resend-otp
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email already verified");
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.emailOtp = hashedOtp;
  user.emailOtpExpires = otpExpires;
  await user.save();

  // Send OTP again
  await sendOtpEmail(user.email, otp);

  return res.status(200).json({
    message: "A new OTP has been sent to your email."
  });
});

export { registerAccount, getAccount, loginAccount, verifyOtp, resendOtp };