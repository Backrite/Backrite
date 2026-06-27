import express from "express";
import passport from "passport";
import {
  getAccount,
  handleOAuthCallback,
  oauthFailure,
  unsupportedCredentialAuth,
} from "../controllers/authcontroller.js";
import { isOAuthProviderConfigured } from "../config/passport.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

const requireConfiguredProvider = (provider) => (req, res, next) => {
  if (!isOAuthProviderConfigured(provider)) {
    return res.status(503).json({
      message: `${provider} OAuth is not configured on this server`,
    });
  }

  return next();
};

router.post("/register", unsupportedCredentialAuth);
router.post("/login", unsupportedCredentialAuth);
router.post("/verify-otp", unsupportedCredentialAuth);
router.post("/resend-otp", unsupportedCredentialAuth);

router.get(
  "/google",
  requireConfiguredProvider("google"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  requireConfiguredProvider("google"),
  passport.authenticate("google", {
    failureRedirect: "/api/auth/oauth-failure",
    session: false,
  }),
  handleOAuthCallback,
);

router.get(
  "/github",
  requireConfiguredProvider("github"),
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get(
  "/github/callback",
  requireConfiguredProvider("github"),
  passport.authenticate("github", {
    failureRedirect: "/api/auth/oauth-failure",
    session: false,
  }),
  handleOAuthCallback,
);

router.get("/oauth-failure", oauthFailure);
router.get("/account", validateToken, getAccount);

export default router;
