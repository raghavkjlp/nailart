import mongoose from "mongoose";

export const JEWELLERY_CATEGORIES = [
  "Adjustable Rings",
  "Rotating Rings",
  "Necklaces",
  "Jhumkas",
  "Western Earrings"
];

const JewelleryProductSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Jewellery piece name is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: JEWELLERY_CATEGORIES,
        message: "{VALUE} is not a valid jewellery category"
      },
      index: true
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
      default: "Atelier Signature"
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewCount: {
      type: Number,
      default: 18
    },
    material: {
      type: String,
      default: "18K Gold Plated • Anti-Tarnish Stainless Steel"
    },
    color: {
      type: String,
      default: "Warm Yellow Gold"
    },
    size: {
      type: String,
      default: "Free Size / Adjustable"
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
      required: [true, "Main product image URL is required"]
    },
    gallery: {
      type: [String],
      default: []
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },
    inclusions: {
      type: String,
      default: "Luxury Atelier Velvet Jewellery Pouch, Authenticity Card & Microfiber Polish Cloth"
    },
    careInstructions: {
      type: String,
      default: "Keep away from perfumes, sprays, and harsh chemicals. Store in your Games of Gloss velvet pouch when not in use."
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
JewelleryProductSchema.pre("save", function () {
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
      this.longDescription.length > 95
        ? this.longDescription.slice(0, 95) + "..."
        : this.longDescription;
  }
  if (!this.gallery || !this.gallery.length) {
    this.gallery = [this.image];
  }
});

const JewelleryProduct =
  mongoose.models.JewelleryProduct ||
  mongoose.model("JewelleryProduct", JewelleryProductSchema);

export default JewelleryProduct;
