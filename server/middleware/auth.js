import "../config/env.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in as admin."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin access required."
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again."
    });
  }
};
