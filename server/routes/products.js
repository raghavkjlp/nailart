import express from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Reference demo data matching user screenshot
const DEMO_COQUETTE = {
  customId: "coquette-affair",
  name: "Coquette Affair",
  price: 749,
  originalPrice: 1099,
  badge: "Viral on Insta",
  rating: 5.0,
  reviewCount: 118,
  collection: "Coquette & Cute 🎀",
  aestheticTags: ["Coquette Princess", "Romantic Dreamer"],
  shape: "Coffin / Ballerina",
  availableShapes: ["Almond", "Square", "Coffin / Ballerina", "Oval", "Stiletto"],
  defaultLength: "Long",
  availableLengths: ["Short", "Medium", "Long", "Extra Long"],
  defaultSize: "M",
  availableSizes: ["XS", "S", "M", "L", "Custom"],
  colors: ["Blush pink and baby pink", "Pastels and lavender"],
  occasions: ["Date night", "Party or vacation", "Wedding or special occasion"],
  personalityTags: ["Cute and playful", "Expensive and luxurious", "Soft and delicate"],
  finish: "Pearlescent Sheen",
  shortDescription: "Ultra-femme French tip with 3D sculpted pearl bows and crystal halo borders.",
  longDescription:
    "For the girl who believes more is more. Coquette Affair features a crisp white micro-french on sheer baby blush, adorned with oversized 3D pearl ribbon charms and curved Swarovski crystal arches. Unapologetically feminine and dreamlike.",
  image: "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg",
  gallery: [
    "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"
  ],
  isAvailable: true,
  inclusions:
    "10 Handcrafted Press-On Nails, Professional Nail Glue, Double-Sided Adhesive Tabs, Nail Buffer, Nail Filer, Cuticle Pusher & Alcohol Prep pad(s). Reusable up to 5x with included jelly adhesive tabs",
  careTabs: {
    prep: "Push cuticles back gently & buff natural nail shine with mini buffer. Wipe each nail thoroughly with the alcohol prep pad to dehydrate oils.",
    removal: "Soak hands in warm soapy water with a few drops of cuticle oil for 10-15 minutes. Gently lift edges with the wooden cuticle stick. Never force or pull violently.",
    glueVsTabs: "Use Jelly Adhesive Tabs for temporary 3–7 day wear (completely damage-free & nails are 100% reusable). Use Professional Nail Glue for 2–3 week salon-strength wear."
  }
};

/**
 * Public: Get all products
 * GET /api/products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // Transform products with standard id field
    const formatted = products.map((p) => {
      const json = p.toJSON();
      json.id = p.customId || p._id.toString();
      return json;
    });

    res.json({
      success: true,
      count: formatted.length,
      products: formatted
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products from MongoDB"
    });
  }
});

/**
 * Public: Get single product by id or customId
 * GET /api/products/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ customId: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
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
 * Admin: Create a new product in MongoDB
 * POST /api/products
 */
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = req.body;

    if (!body.name || !body.price) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required"
      });
    }

    const customId =
      body.customId ||
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;

    const newProduct = new Product({
      ...body,
      customId,
      image: body.image || body.gallery?.[0] || "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg",
      gallery: body.gallery?.length ? body.gallery : [body.image]
    });

    const saved = await newProduct.save();
    const formatted = saved.toJSON();
    formatted.id = saved.customId;

    res.status(201).json({
      success: true,
      message: `Product "${saved.name}" successfully created in MongoDB!`,
      product: formatted
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product in MongoDB"
    });
  }
});

/**
 * Admin: Update an existing product
 * PUT /api/products/:id
 */
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let query = { customId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ customId: id }, { _id: id }] };
    }

    const updated = await Product.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found to update"
      });
    }

    const formatted = updated.toJSON();
    formatted.id = updated.customId || updated._id.toString();

    res.json({
      success: true,
      message: `Product "${updated.name}" updated in MongoDB!`,
      product: formatted
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Delete a product
 * DELETE /api/products/:id
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let query = { customId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ customId: id }, { _id: id }] };
    }

    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found to delete"
      });
    }

    res.json({
      success: true,
      message: `Product "${deleted.name}" deleted from MongoDB!`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Clear all products from MongoDB
 * DELETE /api/products/admin/clear-all
 */
router.delete("/admin/clear-all", requireAdmin, async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({
      success: true,
      message: "All products successfully removed from MongoDB database."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Admin: Seed Screenshot Template (Coquette Affair)
 * POST /api/products/admin/seed-demo
 */
router.post("/admin/seed-demo", requireAdmin, async (req, res) => {
  try {
    const existing = await Product.findOne({ customId: DEMO_COQUETTE.customId });
    if (existing) {
      return res.json({
        success: true,
        message: "Coquette Affair is already present in database",
        product: existing
      });
    }

    const product = new Product(DEMO_COQUETTE);
    const saved = await product.save();

    res.json({
      success: true,
      message: "Coquette Affair template seeded into MongoDB!",
      product: saved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
