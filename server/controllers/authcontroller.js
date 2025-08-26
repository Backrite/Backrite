import asyncHandler from "express-async-handler";
import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//@desc Register user
//@route POST /api/auth/register
const registerAccount = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    res.status(400);
    throw new Error("Please fill username the fields");
  }
  if (!email) {
    res.status(400);
    throw new Error("Please fill email the fields");
  }
  if (!password) {
    res.status(400);
    throw new Error("Please fill password the fields");
  }
  const emailExists = await userModel.findOne({ email });
  const usernameExists = await userModel.findOne({ username });

  if (usernameExists || emailExists) {
    res.status(400);
    throw new Error("User already exits");
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    // let token = jwt.sign(
    //   { email, id: user._id },
    //   process.env.ACCESS_TOKEN_SECRET
    // );
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
    throw new Error("invlid user");
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

export { registerAccount, getAccount, loginAccount };
