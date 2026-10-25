// ============================================================================
// GAMES OF GLOSS — ATELIER PRODUCT STORE (MONGODB ATLAS + IMAGEKIT SYNC)
// Centralized, persistent catalog management with MongoDB API & dynamic updates
// ============================================================================

import {
  fetchProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
  clearAllProductsFromDb,
  seedDemoProductInDb
} from "../services/api.js";

const STORAGE_KEY = "gog_products_catalog";
const STORAGE_EVENT = "gog_products_updated";

/**
 * Screenshot Reference Template: "Coquette Affair"
 * Matches the user's uploaded screenshots with all customization fields.
 */
export const COQUETTE_AFFAIR_TEMPLATE = {
  id: "coquette-affair",
  name: "Coquette Affair",
  price: 749,
  originalPrice: 1099,
  image: "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg",
  gallery: [
    "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"
  ],
  badge: "Viral on Insta",
  rating: 5.0,
  reviewCount: 118,
  collection: "Coquette & Cute 🎀",
  aestheticTags: ["Coquette Princess", "Romantic Dreamer"],
  shape: "Coffin / Ballerina",
  availableShapes: ["Almond", "Square", "Coffin / Ballerina", "Oval", "Stiletto"],
  availableLengths: ["Short", "Medium", "Long", "Extra Long"],
  defaultLength: "Long",
  availableSizes: ["XS", "S", "M", "L", "Custom"],
  defaultSize: "M",
  colors: ["Blush pink and baby pink", "Pastels and lavender"],
  occasions: ["Date night", "Party or vacation", "Wedding or special occasion"],
  personalityTags: ["Cute and playful", "Expensive and luxurious", "Soft and delicate"],
  finish: "Pearlescent Sheen",
  shortDescription: "Ultra-femme French tip with 3D sculpted pearl bows and crystal halo borders.",
  longDescription:
    "For the girl who believes more is more. Coquette Affair features a crisp white micro-french on sheer baby blush, adorned with oversized 3D pearl ribbon charms and curved Swarovski crystal arches. Unapologetically feminine and dreamlike.",
  isAvailable: true,
  inclusions:
    "10 Handcrafted Press-On Nails, Professional Nail Glue, Double-Sided Adhesive Tabs, Nail Buffer, Nail Filer, Cuticle Pusher & Alcohol Prep pad(s). Reusable up to 5x with included jelly adhesive tabs",
  careTabs: {
    prep: "Push cuticles back gently & buff natural nail shine with mini buffer. Wipe each nail thoroughly with the alcohol prep pad to dehydrate oils.",
    removal: "Soak hands in warm soapy water with a few drops of cuticle oil for 10-15 minutes. Gently lift edges with the wooden cuticle stick. Never force or pull violently.",
    glueVsTabs: "Use Jelly Adhesive Tabs for temporary 3–7 day wear (completely damage-free & nails are 100% reusable). Use Professional Nail Glue for 2–3 week salon-strength wear."
  }
};

export const INITIAL_PRODUCTS = [COQUETTE_AFFAIR_TEMPLATE];

/**
 * Retrieve all products from localStorage cache
 */
export const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PRODUCTS;
  } catch (err) {
    console.error("Failed to read products from localStorage:", err);
    return INITIAL_PRODUCTS;
  }
};

/**
 * Save products to cache and broadcast an update event
 */
export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: products }));
    return true;
  } catch (err) {
    console.error("Failed to save products to localStorage:", err);
    return false;
  }
};

/**
 * Load fresh products from MongoDB Atlas
 */
export const syncProductsWithDb = async () => {
  try {
    const products = await fetchProductsFromDb();
    if (Array.isArray(products)) {
      saveStoredProducts(products);
      return products;
    }
    return getStoredProducts();
  } catch (err) {
    console.warn("Could not sync with MongoDB Atlas, using cached catalog:", err.message);
    return getStoredProducts();
  }
};

/**
 * Subscribe to product catalog changes
 */
export const subscribeProducts = (callback) => {
  const handler = (event) => {
    callback(event.detail || getStoredProducts());
  };
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

/**
 * Add a new product to MongoDB Atlas
 */
export const addProduct = async (productData) => {
  try {
    const created = await createProductInDb(productData);
    const current = getStoredProducts();
    const updated = [created, ...current.filter((p) => (p.id || p.customId) !== (created.id || created.customId))];
    saveStoredProducts(updated);
    return created;
  } catch (err) {
    console.error("Failed to add product to MongoDB, saving locally:", err);
    // Fallback locally
    const current = getStoredProducts();
    const id =
      productData.id ||
      productData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;

    const fallbackProduct = {
      ...productData,
      id,
      createdAt: Date.now()
    };
    const updated = [fallbackProduct, ...current];
    saveStoredProducts(updated);
    return fallbackProduct;
  }
};

/**
 * Update an existing product in MongoDB Atlas
 */
export const updateProduct = async (id, productData) => {
  try {
    const updated = await updateProductInDb(id, productData);
    const current = getStoredProducts();
    const list = current.map((p) => ((p.id || p.customId) === id ? updated : p));
    saveStoredProducts(list);
    return updated;
  } catch (err) {
    console.error("Failed to update product in MongoDB, updating locally:", err);
    const current = getStoredProducts();
    const index = current.findIndex((p) => (p.id || p.customId) === id);
    if (index === -1) return null;
    const localUpdated = { ...current[index], ...productData, updatedAt: Date.now() };
    const list = [...current];
    list[index] = localUpdated;
    saveStoredProducts(list);
    return localUpdated;
  }
};

/**
 * Delete a product from MongoDB Atlas
 */
export const deleteProduct = async (id) => {
  try {
    await deleteProductFromDb(id);
  } catch (err) {
    console.warn("Failed to delete from MongoDB:", err.message);
  }
  const current = getStoredProducts();
  const updated = current.filter((p) => (p.id || p.customId) !== id);
  saveStoredProducts(updated);
  return updated;
};

/**
 * Clear all products from MongoDB Atlas
 */
export const clearAllProducts = async () => {
  try {
    await clearAllProductsFromDb();
  } catch (err) {
    console.warn("Failed to clear MongoDB:", err.message);
  }
  saveStoredProducts([]);
  return [];
};

/**
 * Restore Screenshot Template (Coquette Affair) in MongoDB Atlas
 */
export const restoreCoquetteTemplate = async () => {
  try {
    const restored = await seedDemoProductInDb();
    const list = [restored];
    saveStoredProducts(list);
    return list;
  } catch (err) {
    console.warn("Failed to seed in MongoDB, restoring locally:", err.message);
    saveStoredProducts([COQUETTE_AFFAIR_TEMPLATE]);
    return [COQUETTE_AFFAIR_TEMPLATE];
  }
};

/**
 * Duplicate a product
 */
export const duplicateProduct = async (id) => {
  const current = getStoredProducts();
  const target = current.find((p) => (p.id || p.customId) === id);
  if (!target) return null;

  const cloneData = {
    ...target,
    name: `${target.name} (Copy)`
  };
  delete cloneData._id;
  delete cloneData.id;
  delete cloneData.customId;

  return addProduct(cloneData);
};
