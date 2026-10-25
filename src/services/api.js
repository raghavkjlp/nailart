// ============================================================================
// GAMES OF GLOSS — FULL-STACK API SERVICE (MONGODB ATLAS + IMAGEKIT)
// Connects frontend to the Node.js backend for products and authentication
// ============================================================================

const TOKEN_KEY = "gog_admin_jwt";
const ADMIN_KEY = "gog_admin_user";

/**
 * Authentication Helpers
 */
export const getAdminToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const getAdminUser = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAdminToken();
  return Boolean(token && token.length > 20);
};

export const setAdminSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("gog_admin_auth_changed", { detail: { authenticated: true, user } }));
};

export const clearAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new CustomEvent("gog_admin_auth_changed", { detail: { authenticated: false, user: null } }));
};

export const getAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Admin Login
 * POST /api/admin/login
 */
export const adminLogin = async (username, password) => {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Invalid admin credentials");
    }
    setAdminSession(data.token, data.user);
    return data;
  } catch (err) {
    console.error("Admin login error:", err);
    throw err;
  }
};

/**
 * Admin Logout
 */
export const adminLogout = async () => {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { ...getAuthHeaders() }
    });
  } catch (err) {
    console.warn("Logout request failed:", err);
  } finally {
    clearAdminSession();
  }
};

/**
 * Fetch All Products from MongoDB Atlas
 * GET /api/products
 */
export const fetchProductsFromDb = async () => {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products from backend");
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error("Error fetching products from MongoDB:", err);
    throw err;
  }
};

/**
 * Upload Image(s) directly to ImageKit via backend
 * POST /api/upload
 * Returns array of ImageKit CDN URLs
 */
export const uploadImagesToImageKit = async (files) => {
  if (!files || !files.length) return [];

  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to upload image(s) to ImageKit");
  }

  return data.urls || [];
};

/**
 * Create a new product in MongoDB Atlas
 * POST /api/products
 */
export const createProductInDb = async (productData) => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to save product in MongoDB");
  }

  return data.product;
};

/**
 * Update product in MongoDB Atlas
 * PUT /api/products/:id
 */
export const updateProductInDb = async (id, productData) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update product in MongoDB");
  }

  return data.product;
};

/**
 * Delete product in MongoDB Atlas
 * DELETE /api/products/:id
 */
export const deleteProductFromDb = async (id) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete product from MongoDB");
  }

  return true;
};

/**
 * Clear All Products from MongoDB Atlas
 * DELETE /api/products/admin/clear-all
 */
export const clearAllProductsFromDb = async () => {
  const res = await fetch("/api/products/admin/clear-all", {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to clear products from MongoDB");
  }

  return true;
};

/**
 * Seed Coquette Affair Demo Template into MongoDB Atlas
 * POST /api/products/admin/seed-demo
 */
export const seedDemoProductInDb = async () => {
  const res = await fetch("/api/products/admin/seed-demo", {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to seed demo product in MongoDB");
  }

  return data.product;
};
