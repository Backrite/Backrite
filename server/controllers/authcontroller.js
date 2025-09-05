import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../config/emailService.js";
import userModel from "../models/User.js";
import pendingUserModel from "../models/pendingUser.js";

// @desc Register user (store in PendingUser)
// @route POST /api/auth/register
const registerAccount = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  // check if already registered
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // check if already pending
  const existingPending = await pendingUserModel.findOne({ email });
  if (existingPending) {
    return res.status(200).json({
      message: "OTP already sent. Please check your email or request a resend.",
      email,
    });
  }

  // --- OTP Generation Logic ---
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // save to PendingUser
  await pendingUserModel.create({
    username,
    email,
    password: hashedPassword,
    otp: hashedOtp,
    otpExpires,
  });

  // send OTP email (only once here)
  await sendOtpEmail(email, otp);

  return res.status(201).json({
    message: "OTP sent to your email for verification",
    email,
  });
});

// @desc Verify user's email with OTP (move from PendingUser → User)
// @route POST /api/auth/verify-otp
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const pending = await pendingUserModel.findOne({ email });
  if (!pending) {
    res.status(404);
    throw new Error("No pending registration found");
  }

  if (pending.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("OTP has expired. Please register again.");
  }

  const isOtpMatch = await bcrypt.compare(otp, pending.otp);
  if (!isOtpMatch) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  //  Create verified user
  const user = await userModel.create({
    username: pending.username,
    email: pending.email,
    password: pending.password, // already hashed
    isEmailVerified: true,
  });

  //  Remove from pending collection
  await pendingUserModel.deleteOne({ email });

  // generate JWT
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
    user: { id: user._id, username: user.username, email: user.email },
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
    throw new Error("Could not find user with this email");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

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
});

// @desc Get account
// @route GET /api/auth/account
// @access Private
const getAccount = asyncHandler(async (req, res) => {
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

  const pending = await pendingUserModel.findOne({ email });
  if (!pending) {
    res.status(404);
    throw new Error("No pending registration found");
  }

  // new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  pending.otp = hashedOtp;
  pending.otpExpires = otpExpires;
  await pending.save();

  await sendOtpEmail(email, otp);

  return res.status(200).json({ message: "A new OTP has been sent to your email." });
});

export { registerAccount, getAccount, loginAccount, verifyOtp, resendOtp };
