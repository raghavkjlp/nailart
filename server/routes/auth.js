import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { requireAdmin } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "games_of_gloss_secret_atelier_jwt_2026_luxury_atelier";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

/**
 * Admin Login Endpoint
 * POST /api/admin/login
 * Body: { username, password }
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  // Verify credentials provided by user
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: "admin"
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Admin authentication successful",
      token,
      user: {
        username: ADMIN_USERNAME,
        role: "admin"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin username or password"
  });
});

/**
 * Verify Current Admin Session
 * GET /api/admin/verify
 */
router.get("/verify", requireAdmin, (req, res) => {
  res.json({
    success: true,
    user: req.admin
  });
});

/**
 * Admin Logout
 * POST /api/admin/logout
 */
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

export default router;
