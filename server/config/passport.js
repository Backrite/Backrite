import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import userModel from "../models/User.js";

dotenv.config();

const configuredProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
};

const callbackBaseUrl = process.env.OAUTH_CALLBACK_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const getProfileEmail = (profile) => profile.emails?.find((email) => email.value)?.value;

const getProfileName = (profile, fallbackEmail) => (
  profile.displayName
  || profile.username
  || fallbackEmail?.split("@")[0]
  || `${profile.provider}-${profile.id}`
);

const findOrCreateOAuthUser = async ({ provider, providerId, email, username }) => {
  if (!email) {
    throw new Error(`${provider} did not provide a verified email address`);
  }

  const providerQuery = {
    authProviders: {
      $elemMatch: {
        provider,
        providerId,
      },
    },
  };

  const existingProviderUser = await userModel.findOne(providerQuery);
  if (existingProviderUser) {
    return existingProviderUser;
  }

  const existingEmailUser = await userModel.findOne({ email });
  if (existingEmailUser) {
    existingEmailUser.authProviders.push({ provider, providerId });
    existingEmailUser.isEmailVerified = true;
    if (!existingEmailUser.username) {
      existingEmailUser.username = username;
    }
    await existingEmailUser.save();
    return existingEmailUser;
  }

  return userModel.create({
    username,
    email,
    isEmailVerified: true,
    authProviders: [{ provider, providerId }],
  });
};

if (configuredProviders.google) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${callbackBaseUrl}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = getProfileEmail(profile);
        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email,
          username: getProfileName(profile, email),
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ));
}

if (configuredProviders.github) {
  passport.use(new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${callbackBaseUrl}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = getProfileEmail(profile);
        const user = await findOrCreateOAuthUser({
          provider: "github",
          providerId: profile.id,
          email,
          username: getProfileName(profile, email),
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ));
}

const isOAuthProviderConfigured = (provider) => configuredProviders[provider] === true;

export { isOAuthProviderConfigured };
