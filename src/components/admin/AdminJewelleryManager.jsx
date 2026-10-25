import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Save,
  RotateCcw,
  Search,
  AlertCircle,
  Gem,
  Tag,
  Star,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers
} from "lucide-react";
import {
  fetchJewelleryFromDb,
  createJewelleryInDb,
  updateJewelleryInDb,
  deleteJewelleryFromDb,
  seedJewelleryInDb,
  uploadImagesToImageKit
} from "../../services/api.js";

const JEWELLERY_CATEGORIES = [
  "Adjustable Rings",
  "Rotating Rings",
  "Necklaces",
  "Jhumkas",
  "Western Earrings"
];

const DEFAULT_FORM_DATA = {
  name: "",
  category: "Adjustable Rings",
  price: 899,
  originalPrice: 1299,
  badge: "Atelier Signature ✨",
  rating: 5.0,
  reviewCount: 24,
  material: "18K Gold Plated • Anti-Tarnish Stainless Steel",
  color: "Warm 18K Yellow Gold",
  size: "Adjustable Free Size",
  shortDescription: "",
  longDescription: "",
  image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
  ],
  isAvailable: true,
  inclusions: "Luxury Atelier Velvet Jewellery Pouch, Authenticity Card & Microfiber Polish Cloth",
  careInstructions: "Keep away from perfumes, sprays, and water. Store in your Games of Gloss pouch."
};

export const AdminJewelleryManager = ({ notify, onSwitchToJewelleryStore }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const fileInputRef = useRef(null);

  // Load products from MongoDB
  const loadJewellery = async () => {
    setLoading(true);
    try {
      const data = await fetchJewelleryFromDb();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load jewellery products:", err);
      if (notify) notify("Could not connect to MongoDB server", "info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJewellery();
  }, []);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(DEFAULT_FORM_DATA);
    setCustomImageUrl("");
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingProduct(item);
    setFormData({
      ...DEFAULT_FORM_DATA,
      ...item,
      gallery: item.gallery && item.gallery.length > 0 ? item.gallery : [item.image]
    });
    setCustomImageUrl("");
    setModalOpen(true);
  };

  // Save Form (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.category) {
      if (notify) notify("Name, Category, and Price are required", "error");
      return;
    }

    setIsSaving(true);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      rating: Number(formData.rating) || 5.0,
      reviewCount: Number(formData.reviewCount) || 1,
      image: formData.image || formData.gallery[0],
      shortDescription:
        formData.shortDescription?.trim() ||
        formData.longDescription?.slice(0, 85) + "..."
    };

    try {
      if (editingProduct) {
        const id = editingProduct.id || editingProduct.customId;
        await updateJewelleryInDb(id, payload);
        if (notify) notify(`Updated "${payload.name}" in MongoDB Atlas! 💍`);
      } else {
        await createJewelleryInDb(payload);
        if (notify) notify(`Created "${payload.name}" in MongoDB Atlas! Live on store ✨`);
      }
      setModalOpen(false);
      loadJewellery();
    } catch (err) {
      console.error("Jewellery save error:", err);
      if (notify) notify(err.message || "Failed to save jewellery piece", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await deleteJewelleryFromDb(id);
      setDeleteConfirmId(null);
      if (notify) notify("Jewellery piece deleted from MongoDB Atlas");
      loadJewellery();
    } catch (err) {
      if (notify) notify("Failed to delete piece: " + err.message, "error");
    }
  };

  // Quick Toggle Stock Availability
  const handleToggleAvailability = async (item) => {
    const id = item.id || item.customId;
    const newStatus = !item.isAvailable;
    try {
      await updateJewelleryInDb(id, { isAvailable: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === id || p.customId === id ? { ...p, isAvailable: newStatus } : p))
      );
      if (notify) notify(`Marked "${item.name}" as ${newStatus ? "Available (Live)" : "Out of Stock"}`);
    } catch (err) {
      if (notify) notify("Failed to update status", "error");
    }
  };

  // Handle ImageKit File Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const urls = await uploadImagesToImageKit(files);
      if (urls && urls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          image: urls[0],
          gallery: [...urls, ...prev.gallery.filter((g) => g !== urls[0])]
        }));
        if (notify) notify(`Uploaded ${urls.length} image(s) to ImageKit CDN! ☁️`);
      }
    } catch (err) {
      console.error("ImageKit upload error:", err);
      if (notify) notify(err.message || "Failed to upload image(s)", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Add custom URL to gallery
  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      image: prev.image ? prev.image : customImageUrl.trim(),
      gallery: [customImageUrl.trim(), ...prev.gallery.filter((g) => g !== customImageUrl.trim())]
    }));
    setCustomImageUrl("");
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = (idx) => {
    const updated = formData.gallery.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      gallery: updated,
      image: updated[0] || ""
    }));
  };

  // Seed default jewellery collection
  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      await seedJewelleryInDb(true);
      if (notify) notify("Restored default jewellery collection in MongoDB! ✨");
      loadJewellery();
    } catch (err) {
      if (notify) notify("Failed to restore default collection: " + err.message, "error");
      setLoading(false);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCategory = p.category?.toLowerCase().includes(q);
      const matchMaterial = p.material?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchMaterial) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-pink-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Jewellery Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#64263C]">
              Jewellery Catalog Manager
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5255] mt-1 max-w-xl">
              Dynamically add, edit, or delete fine jewellery pieces across Adjustable Rings, Rotating Rings, Necklaces, Jhumkas, and Western Earrings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-3 rounded-full bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#D6B477]" />
              <span>Add Jewellery Product</span>
            </button>

            {onSwitchToJewelleryStore && (
              <button
                onClick={onSwitchToJewelleryStore}
                className="px-4 py-3 rounded-full bg-pink-50 text-[#64263C] hover:bg-pink-100 text-xs font-bold border border-pink-200 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>View Jewellery Store</span>
              </button>
            )}

            <button
              onClick={handleSeedDefaults}
              className="px-3.5 py-3 rounded-full bg-white text-[#5A5255] hover:bg-pink-50 border border-pink-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Restores the curated default collection across all 5 categories"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={loadJewellery}
              disabled={loading}
              className="p-3 rounded-full bg-pink-50 text-[#64263C] hover:bg-pink-100 border border-pink-200 transition-all"
              title="Refresh Catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
              Total Jewellery in DB
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
              Active Categories
            </span>
            <span className="text-2xl font-serif font-extrabold text-[#64263C]">
              {new Set(products.map((p) => p.category)).size} / 5
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
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setCategoryFilter("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === "All"
                ? "bg-[#64263C] text-white shadow-sm"
                : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
            }`}
          >
            All Categories ({products.length})
          </button>
          {JEWELLERY_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-[#64263C] text-white shadow-sm"
                    : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jewellery by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-[#FFF9F5]/40"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-pink-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFF9F5] border-b border-pink-200/80 text-[11px] font-bold uppercase tracking-wider text-[#64263C]">
                <th className="py-4 px-4 sm:px-6">Piece</th>
                <th className="py-4 px-4 sm:px-6">Category</th>
                <th className="py-4 px-4 sm:px-6">Selling Price</th>
                <th className="py-4 px-4 sm:px-6">Material & Specs</th>
                <th className="py-4 px-4 sm:px-6">Store Status</th>
                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[#5A5255]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#D6B477]" />
                      <span>Loading jewellery collection from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-[#5A5255]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Gem className="w-12 h-12 text-[#D6B477] mx-auto" />
                      <h4 className="font-serif font-bold text-base text-[#64263C]">
                        No Jewellery Designs Found
                      </h4>
                      <p className="text-xs text-[#8E8688]">
                        Click "Add Jewellery Product" to add your first piece, or "Reset Defaults" to load starter designs.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const itemId = item.id || item.customId;

                  return (
                    <tr key={itemId} className="hover:bg-pink-50/40 transition-colors">
                      {/* Piece info with Thumbnail */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-pink-200 shrink-0 bg-[#FFF9F5]"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#64263C] text-xs sm:text-sm truncate">
                              {item.name}
                            </h4>
                            {item.badge && (
                              <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#64263C] mt-0.5">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 sm:px-6">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-[#FFF9F5] border border-pink-200 text-[#D6B477] font-bold text-[10px] uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-extrabold text-sm text-[#64263C]">
                            ₹{item.price}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Material & Specs */}
                      <td className="py-3 px-4 sm:px-6 max-w-xs">
                        <p className="text-[11px] text-[#5A5255] truncate font-medium">
                          {item.material || "18K Gold Plated"}
                        </p>
                        <p className="text-[10px] text-[#8E8688] truncate mt-0.5">
                          {item.size || "Adjustable Free Size"}
                        </p>
                      </td>

                      {/* Status toggle */}
                      <td className="py-3 px-4 sm:px-6">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                            item.isAvailable
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isAvailable ? "bg-emerald-600" : "bg-rose-600"
                            }`}
                          />
                          <span>{item.isAvailable ? "Live on Store" : "Out of Stock"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-gray-500 hover:text-[#64263C] hover:bg-pink-100 rounded-lg transition-colors"
                            title="Edit Piece"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === itemId ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(itemId)}
                                className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(itemId)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Piece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ADD / EDIT JEWELLERY MODAL
          ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="relative w-full max-w-3xl bg-[#FFF9F5] rounded-3xl sm:rounded-[32px] border border-pink-200 shadow-2xl overflow-hidden my-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-white border-b border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B477]">
                  MongoDB Database Record
                </span>
                <h3 className="text-xl font-serif font-bold text-[#64263C]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add New Jewellery Design"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-pink-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Jewellery Piece Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Starburst Adjustable Ring"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white font-semibold"
                  >
                    {JEWELLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Original Price, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Selling Price (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="899"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Original Price (₹) <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1299"
                    value={formData.originalPrice || ""}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Promotional Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller ✨, Anti-Tarnish"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Material, Color, Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    placeholder="18K Gold Plated Brass"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Color / Finish
                  </label>
                  <input
                    type="text"
                    placeholder="Warm Yellow Gold"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#242124] mb-1">
                    Size / Dimension
                  </label>
                  <input
                    type="text"
                    placeholder="Adjustable Free Size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Descriptions */}
              <div>
                <label className="block text-xs font-bold text-[#242124] mb-1">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Detailed description of the design, stones, ergonomics, and styling advice..."
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white leading-relaxed"
                />
              </div>

              {/* Row 5: Image Upload (ImageKit CDN + Direct URL) */}
              <div className="bg-white p-4 rounded-2xl border border-pink-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#242124] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D6B477]" />
                    <span>Product Images (ImageKit CDN)</span>
                  </label>
                  <span className="text-[10px] text-[#8E8688]">Max 15MB per image</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#D6B477]" />
                    )}
                    <span>Upload to ImageKit</span>
                  </button>

                  <div className="flex-1 min-w-[200px] flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-[#64263C] text-xs font-bold transition-colors"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Gallery Preview Strip */}
                {formData.gallery && formData.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-pink-200 group">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#64263C] text-white text-[8px] font-bold text-center py-0.2">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 6: Availability Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="jewellery-available-chk"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded border-pink-300 text-[#64263C] focus:ring-[#64263C]"
                />
                <label htmlFor="jewellery-available-chk" className="text-xs font-bold text-[#242124] cursor-pointer">
                  Available in Store (Immediate purchase enabled)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-pink-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-pink-200 text-xs font-semibold text-[#5A5255] hover:bg-pink-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-[#64263C] hover:bg-[#4E1C2E] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#D6B477]" />
                      <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJewelleryManager;
