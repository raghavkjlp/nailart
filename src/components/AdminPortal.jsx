import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Save,
  RotateCcw,
  Download,
  UploadCloud,
  Layers,
  Tag,
  Star,
  Ruler,
  ShoppingBag,
  MessageCircle,
  Package,
  AlertCircle,
  HelpCircle,
  Search,
  CheckCircle2,
  ArrowRight,
  Lock,
  Unlock,
  LogOut,
  Database,
  Cloud,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { NailShapeIcon } from "./NailShapeIcon.jsx";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  clearAllProducts,
  restoreCoquetteTemplate,
  syncProductsWithDb
} from "../data/productStore.js";
import {
  isAuthenticated,
  adminLogin,
  adminLogout,
  getAdminUser,
  uploadImagesToImageKit
} from "../services/api.js";
import { AdminSpinLeads } from "./admin/AdminSpinLeads.jsx";
import { AdminJewelleryManager } from "./admin/AdminJewelleryManager.jsx";

export const AdminPortal = ({
  products = [],
  onRefreshProducts,
  onViewProductInStore,
  onSwitchToShop
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Primary Section Hub: 'nails' | 'jewellery' | 'leads'
  const [adminSection, setAdminSection] = useState("nails");

  // UI States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'draft'
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState("form"); // 'form' | 'preview'
  const [isUploadingToImageKit, setIsUploadingToImageKit] = useState(false);
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef(null);

  // Form State for Add / Edit
  const defaultFormData = {
    name: "",
    price: 749,
    originalPrice: 1099,
    collection: "Coquette & Cute 🎀",
    badge: "Viral on Insta",
    shape: "Coffin / Ballerina",
    availableShapes: ["Almond", "Square", "Coffin / Ballerina", "Oval", "Stiletto"],
    defaultLength: "Long",
    availableLengths: ["Short", "Medium", "Long", "Extra Long"],
    defaultSize: "M",
    availableSizes: ["XS", "S", "M", "L", "Custom"],
    shortDescription: "",
    longDescription:
      "For the girl who believes more is more. Coquette Affair features a crisp white micro-french on sheer baby blush, adorned with oversized 3D pearl ribbon charms and curved Swarovski crystal arches. Unapologetically feminine and dreamlike.",
    image: "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg",
    gallery: [
      "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"
    ],
    finish: "Pearlescent Sheen",
    colors: ["Blush pink and baby pink"],
    occasions: ["Date night", "Party or vacation"],
    personalityTags: ["Cute and playful", "Soft and delicate"],
    rating: 5.0,
    reviewCount: 118,
    isAvailable: true,
    inclusions:
      "10 Handcrafted Press-On Nails, Professional Nail Glue, Double-Sided Adhesive Tabs, Nail Buffer, Nail Filer, Cuticle Pusher & Alcohol Prep pad(s). Reusable up to 5x with included jelly adhesive tabs"
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync DB manual trigger
  const handleSyncDb = async () => {
    setIsSyncing(true);
    try {
      await syncProductsWithDb();
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      notify("Synced with MongoDB Atlas! 🍃");
    } catch {
      notify("Could not reach MongoDB server, using cached data", "info");
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync with MongoDB on initial load
  useEffect(() => {
    if (isLoggedIn) {
      handleSyncDb();
    }
  }, [isLoggedIn]);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      await adminLogin(loginUsername.trim(), loginPassword.trim());
      setIsLoggedIn(true);
      notify("Welcome back! Signed in to Atelier Admin Portal ✨");
      handleSyncDb();
    } catch (err) {
      setLoginError(err.message || "Invalid admin username or password");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await adminLogout();
    setIsLoggedIn(false);
    window.location.hash = "";
    if (onSwitchToShop) {
      onSwitchToShop();
    }
    notify("Logged out from Admin Portal", "info");
  };

  // Open Form to Add New
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setPreviewTab("form");
    setModalOpen(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...defaultFormData,
      ...product,
      gallery: product.gallery?.length ? product.gallery : [product.image || "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"]
    });
    setPreviewTab("form");
    setModalOpen(true);
  };

  // Upload Photos to ImageKit
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingToImageKit(true);
    notify(`Uploading ${files.length} photo(s) to ImageKit CDN... 📸`, "info");

    try {
      const uploadedUrls = await uploadImagesToImageKit(files);

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const newGallery = [...prev.gallery, ...uploadedUrls];
          return {
            ...prev,
            gallery: newGallery,
            image: prev.image || uploadedUrls[0]
          };
        });

        notify(`Uploaded ${uploadedUrls.length} photo(s) to ImageKit successfully! ✨`);
      }
    } catch (err) {
      console.error("ImageKit upload error:", err);
      notify(err.message || "Failed to upload to ImageKit. Please try again.", "error");
    } finally {
      setIsUploadingToImageKit(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add Image via Direct URL
  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setFormData((prev) => {
      const newGallery = [...prev.gallery, customImageUrl.trim()];
      return {
        ...prev,
        gallery: newGallery,
        image: prev.image || customImageUrl.trim()
      };
    });
    setCustomImageUrl("");
    notify("Image URL added to gallery");
  };

  // Remove Photo from Gallery
  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => {
      const updatedGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      const newCover =
        prev.image === prev.gallery[indexToRemove]
          ? updatedGallery[0] || "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"
          : prev.image;
      return {
        ...prev,
        gallery: updatedGallery,
        image: newCover
      };
    });
  };

  // Set Cover Photo
  const handleSetCoverPhoto = (img) => {
    setFormData((prev) => ({ ...prev, image: img }));
    notify("Primary cover photo updated!");
  };

  // Shape toggle handler
  const handleToggleShape = (shapeName) => {
    setFormData((prev) => {
      const exists = prev.availableShapes.includes(shapeName);
      let updated;
      if (exists) {
        if (prev.availableShapes.length === 1) {
          notify("You must keep at least one available shape.", "error");
          return prev;
        }
        updated = prev.availableShapes.filter((s) => s !== shapeName);
      } else {
        updated = [...prev.availableShapes, shapeName];
      }
      return {
        ...prev,
        availableShapes: updated,
        shape: updated.includes(prev.shape) ? prev.shape : updated[0]
      };
    });
  };

  // Length toggle handler
  const handleToggleLength = (len) => {
    setFormData((prev) => {
      const exists = prev.availableLengths.includes(len);
      let updated;
      if (exists) {
        if (prev.availableLengths.length === 1) {
          notify("You must keep at least one available length.", "error");
          return prev;
        }
        updated = prev.availableLengths.filter((l) => l !== len);
      } else {
        updated = [...prev.availableLengths, len];
      }
      return {
        ...prev,
        availableLengths: updated,
        defaultLength: updated.includes(prev.defaultLength) ? prev.defaultLength : updated[0]
      };
    });
  };

  // Size toggle handler
  const handleToggleSize = (sz) => {
    setFormData((prev) => {
      const exists = prev.availableSizes.includes(sz);
      let updated;
      if (exists) {
        if (prev.availableSizes.length === 1) {
          notify("You must keep at least one size.", "error");
          return prev;
        }
        updated = prev.availableSizes.filter((s) => s !== sz);
      } else {
        updated = [...prev.availableSizes, sz];
      }
      return {
        ...prev,
        availableSizes: updated,
        defaultSize: updated.includes(prev.defaultSize) ? prev.defaultSize : updated[0]
      };
    });
  };

  // Submit Save Product to MongoDB Atlas
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notify("Please provide a product title", "error");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      notify("Please enter a valid price", "error");
      return;
    }

    setIsSavingToDb(true);
    notify("Saving product to MongoDB Atlas... 🍃", "info");

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      rating: Number(formData.rating) || 5.0,
      reviewCount: Number(formData.reviewCount) || 1,
      image: formData.image || formData.gallery[0] || "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg",
      shortDescription:
        formData.shortDescription.trim() ||
        formData.longDescription.slice(0, 85) + "..."
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id || editingProduct.customId, payload);
        notify(`Updated "${payload.name}" in MongoDB Atlas! ✨`);
      } else {
        await addProduct(payload);
        notify(`Saved "${payload.name}" to MongoDB Atlas! Live on store 💅🏻`);
      }

      if (onRefreshProducts) {
        onRefreshProducts();
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      notify("Saved to local catalog (MongoDB offline)", "info");
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      setModalOpen(false);
    } finally {
      setIsSavingToDb(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      notify("Product deleted from MongoDB Atlas");
    } catch {
      notify("Failed to delete product", "error");
    }
  };

  // Duplicate
  const handleDuplicate = async (id) => {
    try {
      await duplicateProduct(id);
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      notify("Product duplicated as copy in MongoDB");
    } catch {
      notify("Failed to duplicate product", "error");
    }
  };

  // Clear All
  const handleClearAll = async () => {
    try {
      await clearAllProducts();
      setClearConfirmOpen(false);
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      notify("Catalog cleared. Sample data removed from MongoDB Atlas.", "info");
    } catch {
      notify("Failed to clear catalog", "error");
    }
  };

  // Restore Screenshot Template
  const handleRestoreTemplate = async () => {
    try {
      await restoreCoquetteTemplate();
      if (onRefreshProducts) {
        onRefreshProducts();
      }
      notify("Restored Coquette Affair template in MongoDB! 🎀");
    } catch {
      notify("Failed to restore template", "error");
    }
  };

  // Export JSON Catalog
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `games-of-gloss-catalog-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Catalog exported to JSON");
  };

  // Filter products for display
  const filteredProducts = products.filter((p) => {
    if (activeTab === "active" && !p.isAvailable) return false;
    if (activeTab === "draft" && p.isAvailable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchColl = p.collection?.toLowerCase().includes(q);
      if (!matchName && !matchColl) return false;
    }
    return true;
  });

  const calculatedDiscount = formData.originalPrice && formData.price < formData.originalPrice
    ? formData.originalPrice - formData.price
    : 0;

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FFF9F5] border-t border-pink-100">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-pink-200 shadow-2xl animate-fade-in text-center relative overflow-hidden">
          {/* Decorative Background Soft Ambient Glows */}
          <div
            className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(243, 182, 203, 0.4) 0%, rgba(214, 180, 119, 0.2) 50%, transparent 75%)",
              filter: "blur(20px)",
              zIndex: 0
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(248, 220, 229, 0.5) 0%, rgba(100, 38, 60, 0.08) 50%, transparent 75%)",
              filter: "blur(24px)",
              zIndex: 0
            }}
          />

          <div className="relative z-10">
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-full bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto mb-4 shadow-sm border border-pink-200/60">
              <Lock className="w-8 h-8 text-[#64263C]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#D6B477]" />
              Atelier Security
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
              Admin Portal Login
            </h2>

            <p className="text-xs text-[#5A5255] mb-6 leading-relaxed">
              Please enter your administrator ID and password to manage press-on nail inventory, upload images to ImageKit, and save records in MongoDB.
            </p>

            {loginError && (
              <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242124] mb-1.5">
                  Admin Username / ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white font-medium shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242124] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white font-medium shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#64263C] hover:bg-[#4E1C2E] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D6B477]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-[#D6B477] group-hover:scale-110 transition-transform" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL ADMIN PORTAL (AUTHENTICATED)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FFF9F5] py-8 sm:py-12 border-t border-pink-100 animate-fade-in">
      <div className="container-custom">
        {/* Floating Notification (Anchored at bottom-right so it never covers buttons) */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border animate-fade-in ${
              notification.type === "error"
                ? "bg-rose-900 text-white border-rose-700"
                : notification.type === "info"
                ? "bg-[#64263C] text-white border-pink-300"
                : "bg-emerald-900 text-white border-emerald-700"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D6B477]" />
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Admin Master Navigation Hub */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border border-pink-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAdminSection("nails")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                adminSection === "nails"
                  ? "bg-[#64263C] text-white shadow-md scale-102"
                  : "bg-[#FFF9F5] text-[#5A5255] border border-pink-200 hover:bg-pink-100"
              }`}
            >
              <span>💅 Press-On Nails</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  adminSection === "nails"
                    ? "bg-white/20 text-[#D6B477]"
                    : "bg-pink-100 text-[#64263C]"
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setAdminSection("jewellery")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                adminSection === "jewellery"
                  ? "bg-[#64263C] text-white shadow-md scale-102"
                  : "bg-[#FFF9F5] text-[#5A5255] border border-pink-200 hover:bg-pink-100"
              }`}
            >
              <span>💍 Jewellery Catalog</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  adminSection === "jewellery"
                    ? "bg-white/20 text-[#D6B477]"
                    : "bg-pink-100 text-[#64263C]"
                }`}
              >
                5 Categories
              </span>
            </button>

            <button
              onClick={() => setAdminSection("leads")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                adminSection === "leads"
                  ? "bg-[#64263C] text-white shadow-md scale-102"
                  : "bg-[#FFF9F5] text-[#5A5255] border border-pink-200 hover:bg-pink-100"
              }`}
            >
              <span>🎡 Spin Wheel Leads</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  adminSection === "leads"
                    ? "bg-white/20 text-[#D6B477]"
                    : "bg-pink-100 text-[#64263C]"
                }`}
              >
                Live DB
              </span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 bg-rose-50/80 hover:bg-rose-100 px-4 py-2 rounded-full border border-rose-200 shadow-sm transition-all ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* SECTION 1: JEWELLERY CATALOG MANAGEMENT */}
        {adminSection === "jewellery" && (
          <AdminJewelleryManager
            notify={notify}
            onSwitchToJewelleryStore={() => {
              window.location.hash = "";
              window.location.search = "";
              window.location.pathname = "/";
            }}
          />
        )}

        {/* SECTION 2: SPIN WHEEL LEADS MANAGEMENT */}
        {adminSection === "leads" && (
          <AdminSpinLeads notify={notify} />
        )}

        {/* SECTION 3: PRESS-ON NAIL CATALOG MANAGEMENT */}
        {adminSection === "nails" && (
          <>
            {/* Admin Header & Stats */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-pink-100">
                <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
                Atelier Admin Portal
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#64263C]">
                Press-On Nail Catalog Manager
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5255] mt-1 max-w-xl">
                Add your real nail photos (automatically stored on ImageKit CDN) with live prices & custom shapes saved to MongoDB Atlas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleOpenAdd}
                className="px-5 py-3 rounded-full bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#D6B477]" />
                <span>Add New Nail Set</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = "";
                  if (onSwitchToShop) onSwitchToShop();
                }}
                className="px-4 py-3 rounded-full bg-pink-50 text-[#64263C] hover:bg-pink-100 text-xs font-bold border border-pink-200 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Storefront</span>
              </button>

              {/* Clear All / Restore Buttons */}
              <button
                onClick={() => setClearConfirmOpen(true)}
                className="px-3.5 py-3 rounded-full bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Wipes all sample data from MongoDB Atlas so you can start completely fresh"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All (DB)</span>
              </button>

              <button
                onClick={handleRestoreTemplate}
                className="px-3.5 py-3 rounded-full bg-white text-[#5A5255] hover:bg-pink-50 border border-pink-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Restores the Coquette Affair product template shown in screenshot into MongoDB Atlas"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D6B477]" />
                <span>Restore Template</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
                Total in MongoDB
              </span>
              <span className="text-2xl font-serif font-extrabold text-[#64263C]">
                {products.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
                Live in Store
              </span>
              <span className="text-2xl font-serif font-extrabold text-emerald-700">
                {products.filter((p) => p.isAvailable).length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
                Price Range
              </span>
              <span className="text-lg font-serif font-extrabold text-[#64263C]">
                {products.length
                  ? `₹${Math.min(...products.map((p) => p.price))} – ₹${Math.max(
                      ...products.map((p) => p.price)
                    )}`
                  : "₹0"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 flex flex-col justify-center items-center gap-1">
              <button
                onClick={handleExportJSON}
                className="text-[11px] font-bold text-[#64263C] hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-[#D6B477]" /> Export Catalog JSON
              </button>
              <span className="text-[10px] text-emerald-700 font-semibold">MongoDB Atlas Synced</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar - Single Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-nowrap items-center gap-2 shrink-0 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "all"
                  ? "bg-[#64263C] text-white shadow-sm"
                  : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
              }`}
            >
              All Sets ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "active"
                  ? "bg-[#64263C] text-white shadow-sm"
                  : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
              }`}
            >
              Active ({products.filter((p) => p.isAvailable).length})
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === "draft"
                  ? "bg-[#64263C] text-white shadow-sm"
                  : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
              }`}
            >
              Hidden / Drafts ({products.filter((p) => !p.isAvailable).length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-pink-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Catalog Grid / Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#D6B477]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#64263C] mb-2">
              No Nail Sets Found
            </h3>
            <p className="text-xs text-[#5A5255] mb-6 leading-relaxed">
              {searchQuery
                ? `No products match "${searchQuery}". Try a different keyword.`
                : products.length === 0
                ? "Your MongoDB database is currently clean and empty! Click below to add your first real handcrafted nail set with ImageKit photos."
                : "No products currently match this status filter."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#D6B477]" />
                <span>Add Your First Nail Design</span>
              </button>
              {products.length === 0 && (
                <button
                  onClick={handleRestoreTemplate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-pink-50 text-[#64263C] text-xs font-bold border border-pink-200 hover:bg-pink-100"
                >
                  Load Coquette Affair Reference
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const galleryList = product.gallery?.length ? product.gallery : [product.image];
              const discount = product.originalPrice && product.originalPrice > product.price
                ? product.originalPrice - product.price
                : null;

              return (
                <div
                  key={product.id || product.customId || product._id}
                  className="bg-white rounded-3xl border border-pink-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image and Gallery Counter Header */}
                    <div className="relative h-60 bg-pink-50 overflow-hidden">
                      <img
                        src={product.image || galleryList[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#64263C] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          {product.badge}
                        </span>
                      )}

                      <span
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                          product.isAvailable
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {product.isAvailable ? "Active" : "Draft / Hidden"}
                      </span>

                      {/* Multiple photo indicator */}
                      {galleryList.length > 1 && (
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-md flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-[#D6B477]" />
                          {galleryList.length} Photos
                        </span>
                      )}

                      {/* ImageKit indicator */}
                      {product.image?.includes("imagekit.io") && (
                        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-purple-900/70 text-white text-[9px] font-bold backdrop-blur-md flex items-center gap-1">
                          <Cloud className="w-2.5 h-2.5 text-purple-300" />
                          ImageKit CDN
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B477]">
                          {product.collection}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#64263C]">
                          <Star className="w-3.5 h-3.5 fill-current text-[#D6B477]" />
                          <span>{product.rating || "5.0"}</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-[#64263C] mb-2">
                        {product.name}
                      </h3>

                      {/* Pricing Row matching Screenshot */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-extrabold text-[#64263C]">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                        {discount && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Save ₹{discount}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#5A5255] line-clamp-2 mb-4 leading-relaxed">
                        {product.longDescription || product.shortDescription}
                      </p>

                      {/* Customization Details Chips matching Screenshot fields */}
                      <div className="space-y-1.5 text-[11px] text-[#5A5255] border-t border-pink-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#64263C]">Shapes:</span>
                          <span className="truncate max-w-[170px] text-right">
                            {product.availableShapes?.join(", ") || product.shape}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#64263C]">Lengths:</span>
                          <span className="truncate max-w-[170px] text-right">
                            {product.availableLengths?.join(", ") || product.defaultLength}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#64263C]">Sizes:</span>
                          <span className="truncate max-w-[170px] text-right">
                            {product.availableSizes?.join(", ") || "XS, S, M, L, Custom"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="p-4 bg-pink-50/40 border-t border-pink-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewProductInStore && onViewProductInStore(product)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 text-[#64263C] border border-pink-200 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="Preview as customer sees it"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDuplicate(product.id || product.customId)}
                        className="p-1.5 rounded-xl bg-white hover:bg-pink-100 text-[#5A5255] border border-pink-200 transition-colors"
                        title="Duplicate as new copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="px-3 py-1.5 rounded-xl bg-[#64263C] text-white hover:bg-[#4E1C2E] text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D6B477]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(product.id || product.customId)}
                        className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors"
                        title="Delete product from MongoDB"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </>
        )}
      </div>

      {/* =========================================================================
          ADD / EDIT PRODUCT MODAL (IMAGEKIT + MONGODB)
          ========================================================================= */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-content-lg bg-[#FFF9F5] border border-pink-200 max-h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-pink-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B477]">
                  {editingProduct ? "Product Editor (MongoDB)" : "New Creation (MongoDB + ImageKit)"}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#64263C]">
                  {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Handcrafted Nail Set"}
                </h2>
              </div>

              {/* View Switcher: Form vs Live Preview */}
              <div className="flex items-center gap-2">
                <div className="bg-pink-100/70 p-1 rounded-full flex items-center">
                  <button
                    onClick={() => setPreviewTab("form")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      previewTab === "form"
                        ? "bg-[#64263C] text-white shadow-sm"
                        : "text-[#5A5255] hover:text-[#64263C]"
                    }`}
                  >
                    Form Details
                  </button>
                  <button
                    onClick={() => setPreviewTab("preview")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                      previewTab === "preview"
                        ? "bg-[#64263C] text-white shadow-sm"
                        : "text-[#5A5255] hover:text-[#64263C]"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="modal-close-btn relative top-0 right-0"
                  aria-label="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {previewTab === "preview" ? (
                /* LIVE REAL-TIME PREVIEW MATCHING SCREENSHOT */
                <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-md animate-fade-in">
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      <Check className="w-3 h-3" /> Live Customer Simulation
                    </span>
                  </div>

                  {/* Cover image preview */}
                  <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-pink-50 border border-pink-200 mb-4 shadow-inner">
                    <img
                      src={formData.image || formData.gallery[0] || "https://ik.imagekit.io/nrbbmx019/gamesofgloss/products/coquette_nail.jpg"}
                      alt={formData.name || "Preview"}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#64263C] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      {formData.badge || "Handcrafted Luxury"}
                    </span>
                  </div>

                  {/* Thumbnail strip */}
                  {formData.gallery.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
                      {formData.gallery.map((img, idx) => (
                        <div
                          key={idx}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                            formData.image === img ? "border-[#64263C] scale-105" : "border-pink-200"
                          }`}
                        >
                          <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collection & Rating */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D6B477]">
                      {formData.collection}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#64263C]">
                      <Star className="w-3.5 h-3.5 fill-current text-[#D6B477]" />
                      <span>{formData.rating || "5.0"}</span>
                      <span className="text-gray-400">({formData.reviewCount || 118} verified reviews)</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
                    {formData.name || "Coquette Affair"}
                  </h2>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#64263C]">
                      ₹{formData.price}
                    </span>
                    {formData.originalPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{formData.originalPrice}
                      </span>
                    )}
                    {calculatedDiscount > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Save ₹{calculatedDiscount}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed mb-6">
                    {formData.longDescription}
                  </p>

                  {/* 1. SELECT SHAPE */}
                  <div className="mb-5">
                    <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-2">
                      1. SELECT SHAPE: <span className="text-[#64263C] font-serif">{formData.shape}</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {BRAND_CONFIG.shapes
                        .filter((s) => formData.availableShapes.includes(s.id))
                        .map((s) => (
                          <div
                            key={s.id}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center ${
                              formData.shape === s.id
                                ? "border-[#64263C] bg-white ring-2 ring-pink-300 font-bold"
                                : "border-pink-200 bg-white/60 text-[#5A5255]"
                            }`}
                          >
                            <NailShapeIcon
                              shape={s.id}
                              className="w-5 h-8 mb-1"
                              color={formData.shape === s.id ? "#64263C" : "#D6B477"}
                            />
                            <span className="text-[10px] truncate max-w-full">{s.name.split("/")[0]}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 2. SELECT LENGTH */}
                  <div className="mb-5">
                    <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-2">
                      2. SELECT LENGTH: <span className="text-[#64263C] font-serif">{formData.defaultLength}</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.availableLengths.map((len) => (
                        <div
                          key={len}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center ${
                            formData.defaultLength === len
                              ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                              : "border-pink-200 bg-white text-[#5A5255]"
                          }`}
                        >
                          {len}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. SELECT SIZE */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                        3. SELECT SIZE: <span className="text-[#64263C] font-serif">{formData.defaultSize}</span>
                      </label>
                      <span className="text-xs text-[#64263C] font-bold underline flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Size Guide (mm)</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {formData.availableSizes.map((sz) => (
                        <div
                          key={sz}
                          className={`py-2 rounded-xl border text-xs font-bold text-center ${
                            formData.defaultSize === sz
                              ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                              : "border-pink-200 bg-white text-[#5A5255]"
                          }`}
                        >
                          {sz}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions Card */}
                  <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 text-xs">
                    <div className="font-serif font-bold text-[#64263C] mb-2 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#D6B477]" />
                      <span>Complimentary Salon Prep Kit Included</span>
                    </div>
                    <p className="text-[#5A5255] leading-relaxed mb-2">
                      {formData.inclusions}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reusable up to 5x with included jelly adhesive tabs</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* FORM DETAILS WITH IMAGEKIT FILE UPLOADER */
                <form onSubmit={handleSaveProduct} className="space-y-6">
                  {/* SECTION 1: CORE INFORMATION */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200 space-y-4">
                    <h3 className="font-serif font-bold text-base text-[#64263C] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D6B477]" />
                      <span>1. Core Nail Set Information</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Product Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Coquette Affair"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124]"
                        />
                      </div>

                      {/* Collection Category */}
                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Aesthetic Collection
                        </label>
                        <select
                          value={formData.collection}
                          onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                        >
                          <option value="Coquette & Cute 🎀">Coquette & Cute 🎀</option>
                          <option value="Clean Girl Era 🤍">Clean Girl Era 🤍</option>
                          <option value="Baddie Energy 🖤">Baddie Energy 🖤</option>
                          <option value="Wedding & Romance 💍">Wedding & Romance 💍</option>
                          <option value="Chrome & Glazed ✨">Chrome & Glazed ✨</option>
                          <option value="Custom Creations 💅🏻">Custom Creations 💅🏻</option>
                        </select>
                      </div>
                    </div>

                    {/* Pricing matching screenshot */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Selling Price (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#64263C] pointer-events-none select-none">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="749"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm font-bold text-[#64263C] focus:outline-none focus:ring-2 focus:ring-[#64263C]/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Original Price / MRP (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">₹</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="1099"
                            value={formData.originalPrice || ""}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#64263C]/30"
                          />
                        </div>
                      </div>

                      {/* Computed discount badge */}
                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Discount Display
                        </label>
                        <div className="h-10 px-4 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between text-xs font-bold text-emerald-800">
                          <span>{calculatedDiscount > 0 ? `Save ₹${calculatedDiscount}` : "No Discount"}</span>
                          {calculatedDiscount > 0 && formData.originalPrice && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              ({Math.round((calculatedDiscount / formData.originalPrice) * 100)}% OFF)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge & Stock status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Product Badge / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Viral on Insta, Bestseller, Clean Girl Staple"
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                          Catalog Visibility
                        </label>
                        <select
                          value={formData.isAvailable ? "true" : "false"}
                          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
                          className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white font-semibold"
                        >
                          <option value="true">Active (Visible in Storefront)</option>
                          <option value="false">Hidden / Draft</option>
                        </select>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <label className="block text-xs font-bold text-[#242124] uppercase tracking-wider mb-1">
                        Detailed Description (As shown in screenshot) *
                      </label>
                      <textarea
                        rows="3"
                        required
                        placeholder="For the girl who believes more is more. Coquette Affair features a crisp white micro-french on sheer baby blush..."
                        value={formData.longDescription}
                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: PHOTOS OF NAILS (SAVED ON IMAGEKIT CDN) */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base text-[#64263C] flex items-center gap-1.5">
                        <Cloud className="w-4 h-4 text-purple-600" />
                        <span>2. Photos of Nails (Saved on ImageKit CDN)</span>
                      </h3>
                      {isUploadingToImageKit && (
                        <span className="text-xs text-purple-700 font-bold flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Uploading to ImageKit...
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#5A5255]">
                      Select or drop your nail photos. They will be uploaded directly to <strong>ImageKit CDN</strong> (https://ik.imagekit.io/nrbbmx019) and permanently linked in <strong>MongoDB Atlas</strong>.
                    </p>

                    {/* Upload Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* ImageKit Direct File Upload Button */}
                      <label className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                        <Upload className="w-7 h-7 text-purple-700 group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-bold text-purple-900">Upload to ImageKit CDN</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Select photos from PC or Phone</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingToImageKit}
                          className="hidden"
                        />
                      </label>

                      {/* Direct URL input */}
                      <div className="p-4 rounded-2xl bg-pink-50/20 border border-pink-200 flex flex-col justify-between">
                        <span className="text-xs font-bold text-[#242124] mb-1">Or Add via Image URL / Path:</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://ik.imagekit.io/..."
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#64263C]"
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-3 py-1.5 rounded-xl bg-[#64263C] text-white text-xs font-bold shrink-0"
                          >
                            Add
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                          Paste any web photo or ImageKit URL
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery & Cover Selector */}
                    {formData.gallery.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-2">
                          Gallery Images ({formData.gallery.length}) — Click photo to set as Primary Cover:
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {formData.gallery.map((img, idx) => (
                            <div
                              key={idx}
                              className={`relative group rounded-2xl overflow-hidden border-2 bg-pink-50 aspect-square ${
                                formData.image === img
                                  ? "border-[#64263C] ring-2 ring-pink-300 scale-102"
                                  : "border-pink-200"
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Nail set ${idx}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => handleSetCoverPhoto(img)}
                              />

                              {/* Primary badge */}
                              {formData.image === img && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#64263C] text-white text-[9px] font-bold">
                                  Cover
                                </span>
                              )}

                              {/* Delete button */}
                              {formData.gallery.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePhoto(idx);
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
                                  title="Remove photo"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: CUSTOMIZATION OPTIONS (SHAPE, LENGTH, SIZE) MATCHING SCREENSHOT */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200 space-y-5">
                    <h3 className="font-serif font-bold text-base text-[#64263C] flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-[#D6B477]" />
                      <span>3. Customization Options (As Seen In Screenshot)</span>
                    </h3>

                    {/* 1. SELECT SHAPE */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                          1. Available Shapes (Toggle offered shapes):
                        </label>
                        <span className="text-[11px] text-[#64263C] font-semibold">
                          Default: {formData.shape}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {BRAND_CONFIG.shapes.map((s) => {
                          const isEnabled = formData.availableShapes.includes(s.id);
                          const isDefault = formData.shape === s.id;

                          return (
                            <div
                              key={s.id}
                              className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                                isEnabled
                                  ? isDefault
                                    ? "border-[#64263C] bg-pink-50/70 ring-2 ring-pink-300"
                                    : "border-pink-300 bg-white"
                                  : "border-gray-200 bg-gray-50 opacity-40"
                              }`}
                            >
                              <div
                                onClick={() => handleToggleShape(s.id)}
                                className="cursor-pointer w-full flex flex-col items-center"
                              >
                                <NailShapeIcon
                                  shape={s.id}
                                  className="w-5 h-8 mb-1"
                                  color={isEnabled ? "#64263C" : "#999"}
                                />
                                <span className="text-xs font-bold text-[#242124]">
                                  {s.name.split("/")[0]}
                                </span>
                              </div>

                              <div className="mt-2 pt-2 border-t border-pink-100 w-full flex items-center justify-between gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleShape(s.id)}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isEnabled
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {isEnabled ? "✓ Active" : "+ Off"}
                                </button>
                                {isEnabled && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, shape: s.id })}
                                    className={`text-[9px] font-bold px-1 py-0.5 rounded ${
                                      isDefault
                                        ? "bg-[#64263C] text-white"
                                        : "text-gray-400 hover:text-black"
                                    }`}
                                  >
                                    {isDefault ? "Default" : "Set Def"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. SELECT LENGTH */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                          2. Available Lengths:
                        </label>
                        <span className="text-[11px] text-[#64263C] font-semibold">
                          Default: {formData.defaultLength}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {["Short", "Medium", "Long", "Extra Long"].map((len) => {
                          const isEnabled = formData.availableLengths.includes(len);
                          const isDefault = formData.defaultLength === len;

                          return (
                            <div
                              key={len}
                              className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                                isEnabled
                                  ? isDefault
                                    ? "border-[#64263C] bg-pink-50/70 ring-2 ring-pink-300 font-bold"
                                    : "border-pink-300 bg-white"
                                  : "border-gray-200 bg-gray-50 opacity-40"
                              }`}
                            >
                              <div
                                onClick={() => handleToggleLength(len)}
                                className="cursor-pointer text-xs font-bold text-[#242124] mb-2"
                              >
                                {len}
                              </div>
                              <div className="flex items-center justify-between gap-1 pt-1 border-t border-pink-100">
                                <button
                                  type="button"
                                  onClick={() => handleToggleLength(len)}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isEnabled
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {isEnabled ? "✓ Active" : "+ Off"}
                                </button>
                                {isEnabled && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, defaultLength: len })}
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      isDefault
                                        ? "bg-[#64263C] text-white"
                                        : "text-gray-400 hover:text-black"
                                    }`}
                                  >
                                    {isDefault ? "Default" : "Set Def"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. SELECT SIZE */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                          3. Available Sizes:
                        </label>
                        <span className="text-[11px] text-[#64263C] font-semibold">
                          Default: {formData.defaultSize}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {["XS", "S", "M", "L", "Custom"].map((sz) => {
                          const isEnabled = formData.availableSizes.includes(sz);
                          const isDefault = formData.defaultSize === sz;

                          return (
                            <div
                              key={sz}
                              className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                                isEnabled
                                  ? isDefault
                                    ? "border-[#64263C] bg-pink-50/70 ring-2 ring-pink-300 font-bold"
                                    : "border-pink-300 bg-white"
                                  : "border-gray-200 bg-gray-50 opacity-40"
                              }`}
                            >
                              <div
                                onClick={() => handleToggleSize(sz)}
                                className="cursor-pointer text-xs font-bold text-[#242124] mb-2"
                              >
                                {sz}
                              </div>
                              <div className="flex items-center justify-between gap-1 pt-1 border-t border-pink-100">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSize(sz)}
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isEnabled
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {isEnabled ? "✓ Active" : "+ Off"}
                                </button>
                                {isEnabled && (
                                  <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, defaultSize: sz })}
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      isDefault
                                        ? "bg-[#64263C] text-white"
                                        : "text-gray-400 hover:text-black"
                                    }`}
                                  >
                                    {isDefault ? "Default" : "Set Def"}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: INCLUSIONS & KIT */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200 space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#64263C] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#D6B477]" />
                      <span>4. Complimentary Salon Prep Kit Inclusions</span>
                    </h3>
                    <textarea
                      rows="2"
                      value={formData.inclusions}
                      onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs text-[#242124] leading-relaxed"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-3 rounded-full bg-white text-[#5A5255] border border-pink-200 text-xs font-bold hover:bg-pink-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingToDb || isUploadingToImageKit}
                      className="px-8 py-3 rounded-full bg-[#64263C] hover:bg-[#4E1C2E] text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-60"
                    >
                      {isSavingToDb ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#D6B477]" />
                          <span>Saving to MongoDB Atlas...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-[#D6B477]" />
                          <span>{editingProduct ? "Save Changes (DB)" : "Save to MongoDB & Publish"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-pink-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#64263C] mb-1">
              Delete This Nail Set?
            </h3>
            <p className="text-xs text-[#5A5255] mb-5">
              This will remove this product from MongoDB Atlas and your live website.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-full border border-gray-200 text-xs font-bold text-[#5A5255] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md"
              >
                Delete from DB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {clearConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#64263C] mb-2">
              Remove All Products from Database?
            </h3>
            <p className="text-xs text-[#5A5255] mb-6 leading-relaxed">
              This will wipe all products in MongoDB Atlas so you can start 100% fresh with your real nail sets. You can restore the screenshot template anytime with one click.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setClearConfirmOpen(false)}
                className="py-2.5 rounded-full border border-gray-200 text-xs font-bold text-[#5A5255] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md"
              >
                Yes, Clear Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
