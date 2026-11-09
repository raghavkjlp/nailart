import express from "express";
import SpinWheelLead from "../models/SpinWheelLead.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Email and Phone validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

/**
 * Public: Check if email has already spun the wheel
 * GET /api/spin-leads/check?email=...
 */
router.get("/check", async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to check eligibility."
      });
    }

    const existingLead = await SpinWheelLead.findOne({ email });
    if (existingLead) {
      return res.json({
        success: true,
        alreadySpun: true,
        message: "You have already spun the wheel!",
        result: existingLead.result,
        leadId: existingLead._id
      });
    }

    return res.json({
      success: true,
      alreadySpun: false,
      message: "Eligible to spin the wheel."
    });
  } catch (error) {
    console.error("Check spin eligibility error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify spin eligibility."
    });
  }
});

/**
 * Public: Submit visitor contact info and claim spin
 * POST /api/spin-leads
 */
router.post("/", async (req, res) => {
  try {
    const { fullName = "", phoneNumber = "", email = "", consent = true, result = "Surprise Lucky Gift (Sent via Email)" } = req.body;

    const trimmedPhone = String(phoneNumber || "").trim();
    const trimmedEmail = String(email || "").trim().toLowerCase();
    const trimmedName = String(fullName || "").trim();

    // 1. Mandatory field checks (Email is primary identifier)
    if (!trimmedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email address is required."
      });
    }

    // 2. Format validation
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address (e.g. name@example.com)."
      });
    }

    // If phone number is provided, validate it; otherwise it's optional
    if (trimmedPhone) {
      const digitsOnly = trimmedPhone.replace(/\D/g, "");
      if (digitsOnly.length < 8 || digitsOnly.length > 15 || !PHONE_REGEX.test(trimmedPhone)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number."
        });
      }
    }

    // 3. Strict returning visitor check against database (No duplicates allowed)
    const existing = await SpinWheelLead.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        alreadySpun: true,
        message: "You have already spun the wheel!",
        result: existing.result,
        leadId: existing._id
      });
    }

    // 4. Save unique email lead to MongoDB
    const lead = new SpinWheelLead({
      fullName: trimmedName,
      phoneNumber: trimmedPhone,
      email: trimmedEmail,
      source: "Spin the Wheel",
      result: result || "Surprise Lucky Gift (Sent via Email)",
      consent: Boolean(consent),
      ipAddress: req.ip || req.headers["x-forwarded-for"] || ""
    });

    const saved = await lead.save();

    return res.status(201).json({
      success: true,
      alreadySpun: false,
      message: "Spin registered successfully! Reward sent to email.",
      result: saved.result,
      leadId: saved._id
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        alreadySpun: true,
        message: "You have already spun the wheel!"
      });
    }
    console.error("Spin lead save error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record contact details. Please try again."
    });
  }
});

/**
 * Admin: Fetch spin leads with pagination, search, and sorting
 * GET /api/admin/spin-leads or GET /api/spin-leads (admin)
 */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const search = (req.query.search || "").trim();
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sortBy = req.query.sortBy || "createdAt";

    let query = {};
    if (search) {
      const searchRegex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      query = {
        $or: [
          { fullName: searchRegex },
          { phoneNumber: searchRegex },
          { email: searchRegex }
        ]
      };
    }

    const totalCount = await SpinWheelLead.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const leads = await SpinWheelLead.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const formatted = leads.map((lead) => ({
      id: lead._id.toString(),
      fullName: lead.fullName || "—",
      phoneNumber: lead.phoneNumber,
      email: lead.email,
      source: lead.source || "Spin the Wheel",
      result: lead.result || "Better Luck Next Time!",
      consent: lead.consent,
      createdAt: lead.createdAt
    }));

    return res.json({
      success: true,
      leads: formatted,
      totalCount,
      page,
      totalPages,
      limit
    });
  } catch (error) {
    console.error("Admin fetch leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch spin leads"
    });
  }
});

/**
 * Admin: Export all spin leads to CSV
 * GET /api/admin/spin-leads/export or GET /api/spin-leads/export (admin)
 */
router.get("/export", requireAdmin, async (req, res) => {
  try {
    const leads = await SpinWheelLead.find().sort({ createdAt: -1 }).lean();

    // CSV Header row
    const headers = ["ID", "Full Name", "Phone Number", "Email", "Source", "Result", "Date & Time"];

    // Escape CSV cell helper
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = leads.map((lead) => [
      escapeCsv(lead._id.toString()),
      escapeCsv(lead.fullName || ""),
      escapeCsv(lead.phoneNumber),
      escapeCsv(lead.email),
      escapeCsv(lead.source || "Spin the Wheel"),
      escapeCsv(lead.result || "Better Luck Next Time!"),
      escapeCsv(new Date(lead.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\r\n");

    const filename = `games-of-gloss-spin-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("Export leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export leads to CSV"
    });
  }
});

/**
 * Admin: Delete a single lead
 * DELETE /api/admin/spin-leads/:id
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SpinWheelLead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lead record not found"
      });
    }
    return res.json({
      success: true,
      message: "Lead record removed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
