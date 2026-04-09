import express from "express";
import passport from "passport";
import { signup, login, logout, googleCallback } from "../controllers/auth.control.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const ensureGoogleOAuthConfigured = (req, res, next) => {
  if (typeof passport?._strategy !== "function" || !passport._strategy("google")) {
    return res.status(503).json({ data: "Google OAuth is not configured on the server" });
  }
  return next();
};

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 3,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.get(
  "/google",
  ensureGoogleOAuthConfigured,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  ensureGoogleOAuthConfigured,
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
  }),
  googleCallback
);

router.get("/google/failure", (_req, res) => {
  return res.status(401).json({ data: "Google login failed" });
});

export default router; 
