import "./config/env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import uploadRoutes from "./routes/upload.js";
import Product from "./models/Product.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Games of Gloss Luxury Press-On Atelier API",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting/disconnected",
    imagekit: !!process.env.IMAGEKIT_PUBLIC_KEY,
    timestamp: new Date().toISOString()
  });
});

// Seed default template if DB is empty
async function seedDefaultIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("No products in MongoDB. Seeding Coquette Affair reference template...");
      await Product.create({
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
          "10 Handcrafted Press-On Nails, Professional Nail Glue, Double-Sided Adhesive Tabs, Nail Buffer, Nail Filer, Cuticle Pusher & Alcohol Prep pad(s). Reusable up to 5x with included jelly adhesive tabs"
      });
      console.log("Coquette Affair seeded into MongoDB Atlas successfully!");
    }
  } catch (err) {
    console.error("Error checking or seeding database:", err);
  }
}

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Please define it in your .env or Render Environment Variables.");
    }
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Atlas connected successfully!");

    await seedDefaultIfEmpty();

    app.listen(PORT, () => {
      console.log(`Games of Gloss Atelier API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
    process.exit(1);
  }
}

startServer();
