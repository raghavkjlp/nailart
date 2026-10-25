import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price cannot be negative"]
    },
    originalPrice: {
      type: Number,
      default: null
    },
    badge: {
      type: String,
      default: "Handcrafted Luxury"
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewCount: {
      type: Number,
      default: 1
    },
    collection: {
      type: String,
      default: "Coquette & Cute 🎀"
    },
    aestheticTags: {
      type: [String],
      default: ["Coquette Princess", "Romantic Dreamer"]
    },
    shape: {
      type: String,
      default: "Coffin / Ballerina"
    },
    availableShapes: {
      type: [String],
      default: ["Almond", "Square", "Coffin / Ballerina", "Oval", "Stiletto"]
    },
    defaultLength: {
      type: String,
      default: "Long"
    },
    availableLengths: {
      type: [String],
      default: ["Short", "Medium", "Long", "Extra Long"]
    },
    defaultSize: {
      type: String,
      default: "M"
    },
    availableSizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "Custom"]
    },
    colors: {
      type: [String],
      default: ["Blush pink and baby pink"]
    },
    occasions: {
      type: [String],
      default: ["Date night", "Party or vacation", "Everyday wear"]
    },
    personalityTags: {
      type: [String],
      default: ["Cute and playful", "Expensive and luxurious", "Soft and delicate"]
    },
    finish: {
      type: String,
      default: "Pearlescent Sheen"
    },
    shortDescription: {
      type: String,
      default: ""
    },
    longDescription: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      required: [true, "Cover image URL is required"]
    },
    gallery: {
      type: [String],
      default: []
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    inclusions: {
      type: String,
      default:
        "10 Handcrafted Press-On Nails, Professional Nail Glue, Double-Sided Adhesive Tabs, Nail Buffer, Nail Filer, Cuticle Pusher & Alcohol Prep pad(s). Reusable up to 5x with included jelly adhesive tabs"
    },
    careTabs: {
      type: Object,
      default: () => ({
        prep: "Push cuticles back gently & buff natural nail shine with mini buffer. Wipe each nail thoroughly with the alcohol prep pad to dehydrate oils.",
        removal: "Soak hands in warm soapy water with a few drops of cuticle oil for 10-15 minutes. Gently lift edges with the wooden cuticle stick. Never force or pull violently.",
        glueVsTabs: "Use Jelly Adhesive Tabs for temporary 3–7 day wear (completely damage-free & nails are 100% reusable). Use Professional Nail Glue for 2–3 week salon-strength wear."
      })
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.customId || ret._id.toString();
        return ret;
      }
    }
  }
);

// Auto-generate customId if not provided
ProductSchema.pre("save", function () {
  if (!this.customId) {
    this.customId =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;
  }
  if (!this.shortDescription && this.longDescription) {
    this.shortDescription =
      this.longDescription.length > 90
        ? this.longDescription.slice(0, 90) + "..."
        : this.longDescription;
  }
  if (!this.gallery || !this.gallery.length) {
    this.gallery = [this.image];
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
