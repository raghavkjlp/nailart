// ============================================================================
// GAMES OF GLOSS — FULL-STACK API SERVICE (MONGODB ATLAS + IMAGEKIT)
// Connects frontend to the Node.js backend for products and authentication
// ============================================================================

const TOKEN_KEY = "gog_admin_jwt";
const ADMIN_KEY = "gog_admin_user";

// Configurable API Base with smart local detection
export const getApiBase = () => {
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("onrender.com")) {
        return import.meta.env.VITE_API_URL.replace(/\/$/, "");
      }
      return "http://localhost:5000";
    }
  }
  return (
    import.meta.env.VITE_API_URL || "https://nailart-z8gc.onrender.com"
  ).replace(/\/$/, "");
};

export const API_BASE = getApiBase();

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
    const res = await fetch(`${API_BASE}/api/admin/login`, {
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
    await fetch(`${API_BASE}/api/admin/logout`, {
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
    const res = await fetch(`${API_BASE}/api/products`);
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

  const res = await fetch(`${API_BASE}/api/upload`, {
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
  const res = await fetch(`${API_BASE}/api/products`, {
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
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
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
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
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
  const res = await fetch(`${API_BASE}/api/products/admin/clear-all`, {
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
  const res = await fetch(`${API_BASE}/api/products/admin/seed-demo`, {
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

// ============================================================================
// SPIN THE WHEEL LEADS API
// ============================================================================

/**
 * Public: Submit visitor contact info and record spin lead
 * POST /api/spin-leads
 */
export const submitSpinLead = async ({ fullName, phoneNumber, email, consent = true }) => {
  const res = await fetch(`${API_BASE}/api/spin-leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, phoneNumber, email, consent })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to submit spin entry");
  }

  return data;
};

/**
 * Admin: Fetch spin leads with pagination, search & sorting
 * GET /api/admin/spin-leads
 */
export const fetchSpinLeadsAdmin = async ({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc"
} = {}) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    sortBy,
    sortOrder
  });

  const res = await fetch(`${API_BASE}/api/admin/spin-leads?${query.toString()}`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch spin leads from server");
  }

  return data;
};

/**
 * Admin: Export spin leads as CSV
 */
export const exportSpinLeadsCsv = async () => {
  const res = await fetch(`${API_BASE}/api/admin/spin-leads/export`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!res.ok) {
    throw new Error("Failed to export spin leads CSV");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `games-of-gloss-spin-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  return true;
};

/**
 * Admin: Delete a single lead
 */
export const deleteSpinLeadAdmin = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/spin-leads/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete lead");
  }

  return true;
};

// ============================================================================
// JEWELLERY ATELIER API
// ============================================================================

/**
 * Public: Fetch active jewellery products from database
 * GET /api/jewellery
 */
export const fetchJewelleryFromDb = async ({ category = "All", search = "", availableOnly = false } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== "All" && category !== "All Pieces") {
    params.set("category", category);
  }
  if (search) {
    params.set("search", search);
  }
  if (availableOnly) {
    params.set("availableOnly", "true");
  }

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}/api/jewellery${queryStr}`);
  if (!res.ok) {
    throw new Error("Failed to fetch jewellery products from backend");
  }

  const data = await res.json();
  return data.products || [];
};

/**
 * Public: Get single jewellery piece
 * GET /api/jewellery/:id
 */
export const fetchSingleJewelleryFromDb = async (id) => {
  const res = await fetch(`${API_BASE}/api/jewellery/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch jewellery product details");
  }
  const data = await res.json();
  return data.product;
};

/**
 * Admin: Create jewellery product
 * POST /api/admin/jewellery
 */
export const createJewelleryInDb = async (productData) => {
  const res = await fetch(`${API_BASE}/api/admin/jewellery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to save jewellery piece");
  }

  return data.product;
};

/**
 * Admin: Update jewellery product
 * PUT /api/admin/jewellery/:id
 */
export const updateJewelleryInDb = async (id, productData) => {
  const res = await fetch(`${API_BASE}/api/admin/jewellery/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update jewellery piece");
  }

  return data.product;
};

/**
 * Admin: Delete jewellery product
 * DELETE /api/admin/jewellery/:id
 */
export const deleteJewelleryFromDb = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/jewellery/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete jewellery piece");
  }

  return true;
};

/**
 * Admin: Seed jewellery collection
 * POST /api/admin/jewellery/seed
 */
export const seedJewelleryInDb = async (force = false) => {
  const res = await fetch(`${API_BASE}/api/admin/jewellery/seed${force ? "?force=true" : ""}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to seed jewellery collection");
  }

  return data;
};

