import express from "express";
import { signup, login, logout } from "../controllers/auth.control.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

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

export default router;
