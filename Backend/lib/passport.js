import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.models.js";

export function configurePassport() {
  if (passport._communityGoogleConfigured) return passport;

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:8000/api/auth/google/callback";

  if (!clientID || !clientSecret) {
    // Allow server to run without Google OAuth env configured.
    // Routes will fail fast if called without proper credentials.
    passport._communityGoogleConfigured = false;
    return passport;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile?.emails?.[0]?.value?.toLowerCase() || null;
          const googleId = profile?.id || null;
          const fullName =
            profile?.displayName ||
            [profile?.name?.givenName, profile?.name?.familyName]
              .filter(Boolean)
              .join(" ") ||
            "Google User";
          const profilePicUrl = profile?.photos?.[0]?.value || null;

          if (!googleId) return done(new Error("Google profile missing id"));
          if (!email) return done(new Error("Google profile missing email"));

          let user =
            (await User.findOne({ googleId })) || (await User.findOne({ email }));

          if (!user) {
            user = await User.create({
              fullName,
              email,
              password: null,
              profilePicUrl,
              googleId,
            });
          } else {
            let changed = false;
            if (!user.googleId) {
              user.googleId = googleId;
              changed = true;
            }
            if (!user.profilePicUrl && profilePicUrl) {
              user.profilePicUrl = profilePicUrl;
              changed = true;
            }
            if (!user.fullName && fullName) {
              user.fullName = fullName;
              changed = true;
            }
            if (changed) await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user?._id?.toString?.() ?? null);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      if (!id) return done(null, false);
      const user = await User.findById(id).select("-password");
      return done(null, user || false);
    } catch (err) {
      return done(err);
    }
  });

  passport._communityGoogleConfigured = true;
  return passport;
}

