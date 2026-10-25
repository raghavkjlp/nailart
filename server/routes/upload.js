import express from "express";
import multer from "multer";
import imagekit from "../config/imagekit.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

/**
 * Upload single or multiple images to ImageKit
 * POST /api/upload
 */
router.post("/", requireAdmin, upload.array("images", 8), async (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "ImageKit credentials are not configured in environment variables / .env."
      });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided for upload"
      });
    }

    const uploadPromises = files.map((file) => {
      const cleanName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      return imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: cleanName,
        folder: "/gamesofgloss/products",
        useUniqueFileName: true
      });
    });

    const results = await Promise.all(uploadPromises);

    const uploadedUrls = results.map((result) => ({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      thumbnailUrl: result.thumbnailUrl
    }));

    return res.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} image(s) to ImageKit!`,
      urls: uploadedUrls.map((u) => u.url),
      files: uploadedUrls
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image(s) to ImageKit"
    });
  }
});

/**
 * Upload base64 image data directly to ImageKit
 * POST /api/upload/base64
 */
router.post("/base64", requireAdmin, async (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "ImageKit credentials are not configured in environment variables / .env."
      });
    }

    const { base64Data, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: "base64Data string is required"
      });
    }

    const cleanName = fileName
      ? `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      : `nail-${Date.now()}.jpg`;

    const result = await imagekit.upload({
      file: base64Data,
      fileName: cleanName,
      folder: "/gamesofgloss/products",
      useUniqueFileName: true
    });

    return res.json({
      success: true,
      url: result.url,
      fileId: result.fileId
    });
  } catch (error) {
    console.error("ImageKit base64 upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload base64 image to ImageKit"
    });
  }
});

export default router;
