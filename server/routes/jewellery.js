import express from "express";
import JewelleryProduct, { JEWELLERY_CATEGORIES } from "../models/JewelleryProduct.js";
import { DEFAULT_JEWELLERY_PRODUCTS } from "../data/defaultJewellery.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * Public: Get all jewellery products
 * GET /api/jewellery
 */
router.get("/", async (req, res) => {
  try {
    const { category, search, availableOnly } = req.query;

    let query = {};
    if (availableOnly === "true") {
      query.isAvailable = true;
    }
    if (category && category !== "All" && category !== "All Pieces") {
      query.category = category;
    }
    if (search) {
      const searchRegex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      query.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { material: searchRegex },
        { category: searchRegex }
      ];
    }

    const products = await JewelleryProduct.find(query).sort({ createdAt: -1 });

    const formatted = products.map((p) => {
      const json = p.toJSON();
      json.id = p.customId || p._id.toString();
      return json;
    });

    res.json({
      success: true,
      count: formatted.length,
      categories: JEWELLERY_CATEGORIES,
      products: formatted
    });
  } catch (error) {
    console.error("Fetch jewellery error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jewellery products from database"
    });
  }
});

/**
 * Public: Get single jewellery piece by ID or customId
 * GET /api/jewellery/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await JewelleryProduct.findOne({ customId: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await JewelleryProduct.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Jewellery product not found"
      });
    }

    const formatted = product.toJSON();
    formatted.id = product.customId || product._id.toString();

    res.json({
      success: true,
      product: formatted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Create a new jewellery product
 * POST /api/admin/jewellery or POST /api/jewellery (admin)
 */
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = req.body;

    if (!body.name || !body.price || !body.category) {
      return res.status(400).json({
        success: false,
        message: "Product name, category, and price are required."
      });
    }

    if (!JEWELLERY_CATEGORIES.includes(body.category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${JEWELLERY_CATEGORIES.join(", ")}`
      });
    }

    const customId =
      body.customId ||
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;

    const newProduct = new JewelleryProduct({
      ...body,
      customId,
      image: body.image || body.gallery?.[0] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      gallery: body.gallery?.length ? body.gallery : [body.image]
    });

    const saved = await newProduct.save();
    const formatted = saved.toJSON();
    formatted.id = saved.customId;

    res.status(201).json({
      success: true,
      message: `Jewellery piece "${saved.name}" successfully created!`,
      product: formatted
    });
  } catch (error) {
    console.error("Create jewellery error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create jewellery piece"
    });
  }
});

/**
 * Admin: Update jewellery product
 * PUT /api/admin/jewellery/:id or PUT /api/jewellery/:id (admin)
 */
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let query = { customId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ customId: id }, { _id: id }] };
    }

    const updated = await JewelleryProduct.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Jewellery product not found to update"
      });
    }

    const formatted = updated.toJSON();
    formatted.id = updated.customId || updated._id.toString();

    res.json({
      success: true,
      message: `Jewellery piece "${updated.name}" updated successfully!`,
      product: formatted
    });
  } catch (error) {
    console.error("Update jewellery error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Delete jewellery product
 * DELETE /api/admin/jewellery/:id or DELETE /api/jewellery/:id (admin)
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let query = { customId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ customId: id }, { _id: id }] };
    }

    const deleted = await JewelleryProduct.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Jewellery product not found to delete"
      });
    }

    res.json({
      success: true,
      message: `Jewellery piece "${deleted.name}" deleted from database!`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Seed default jewellery collection if empty or requested
 * POST /api/admin/jewellery/seed
 */
router.post("/seed", requireAdmin, async (req, res) => {
  try {
    const count = await JewelleryProduct.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.json({
        success: true,
        message: `Database already contains ${count} jewellery products.`,
        count
      });
    }

    if (req.query.force === "true") {
      await JewelleryProduct.deleteMany({});
    }

    const seeded = await JewelleryProduct.insertMany(DEFAULT_JEWELLERY_PRODUCTS);
    res.json({
      success: true,
      message: `Successfully seeded ${seeded.length} jewellery pieces!`,
      count: seeded.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
