import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

const createToken = (user) => jwt.sign(
  {
    user: {
      name: user.username,
      email: user.email,
      id: user._id,
    },
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "2d" },
);

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  authProviders: user.authProviders,
});

const redirectWithToken = (res, token, user) => {
  const successUrl = process.env.OAUTH_SUCCESS_REDIRECT_URL;

  if (!successUrl) {
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  }

  const redirectUrl = new URL(successUrl);
  redirectUrl.searchParams.set("token", token);
  redirectUrl.searchParams.set("userId", user._id.toString());
  return res.redirect(redirectUrl.toString());
};

const unsupportedCredentialAuth = asyncHandler(async (_req, res) => {
  res.status(410).json({
    message: "Password login and signup are disabled. Use Google or GitHub OAuth.",
    providers: {
      google: "/api/auth/google",
      github: "/api/auth/github",
    },
  });
});

const handleOAuthCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("OAuth authentication failed");
  }

  const token = createToken(req.user);
  return redirectWithToken(res, token, req.user);
});

const oauthFailure = asyncHandler(async (_req, res) => {
  const failureUrl = process.env.OAUTH_FAILURE_REDIRECT_URL;

  if (failureUrl) {
    return res.redirect(failureUrl);
  }

  return res.status(401).json({ message: "OAuth authentication failed" });
});

const getAccount = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(sanitizeUser(user));
});

export {
  getAccount,
  handleOAuthCallback,
  oauthFailure,
  unsupportedCredentialAuth,
};
