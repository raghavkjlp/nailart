import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Filter,
  ShoppingBag,
  Eye,
  Heart,
  Star,
  Check,
  RotateCw,
  Gem,
  ArrowRight
} from "lucide-react";
import { fetchJewelleryFromDb } from "../services/api.js";
import { DEFAULT_JEWELLERY_PRODUCTS } from "../../server/data/defaultJewellery.js";

const CATEGORIES = [
  "All Pieces",
  "Adjustable Rings",
  "Rotating Rings",
  "Necklaces",
  "Jhumkas",
  "Western Earrings"
];

export const JewelleryPage = ({
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  initialCategory = "All Pieces"
}) => {
  const [products, setProducts] = useState(DEFAULT_JEWELLERY_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-low' | 'price-high' | 'rating'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});

  // Fetch real jewellery from database
  const loadJewellery = async () => {
    setLoading(true);
    try {
      const data = await fetchJewelleryFromDb();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(DEFAULT_JEWELLERY_PRODUCTS);
      }
    } catch (err) {
      console.warn("Using offline jewellery catalog:", err.message);
      setProducts(DEFAULT_JEWELLERY_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJewellery();
  }, []);

  // Filter and sort products
  const filteredProducts = products.filter((item) => {
    // Category Filter
    if (selectedCategory !== "All Pieces" && item.category !== selectedCategory) {
      return false;
    }
    // In-Stock Filter
    if (inStockOnly && !item.isAvailable) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchDesc = item.shortDescription?.toLowerCase().includes(q);
      const matchMaterial = item.material?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc && !matchMaterial) {
        return false;
      }
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
    return 0; // featured (default ordering)
  });

  const handleAddDirect = (e, item) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    if (onAddToCart) {
      onAddToCart({
        id: item.id || item.customId,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category,
        material: item.material,
        quantity: 1,
        type: "jewellery"
      });

      const itemId = item.id || item.customId;
      setAddedItemMap((prev) => ({ ...prev, [itemId]: true }));
      setTimeout(() => {
        setAddedItemMap((prev) => ({ ...prev, [itemId]: false }));
      }, 1500);
    }
  };

  return (
    <div className="bg-[#FFF9F5] min-h-screen py-8 sm:py-12 animate-fade-in">
      <div className="container-custom">
        {/* Hero Banner for Jewellery */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#64263C] via-[#832C4A] to-[#64263C] text-white p-6 sm:p-12 mb-10 shadow-xl border border-pink-300/30">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#D6B477] text-xs font-bold uppercase tracking-wider mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Atelier Fine Jewellery Collection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight">
              Curated Jewels for the Modern Muse ✨
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/90 mt-3 leading-relaxed">
              Explore hypoallergenic 18K gold plated adjustable rings, mindful rotating spinner rings, liquid gold necklaces, royal festive jhumkas, and effortless western earrings designed to pair flawlessly with your luxury press-on nails.
            </p>
          </div>

          {/* Decorative Sparkle Accents */}
          <div className="absolute right-6 -bottom-8 opacity-20 pointer-events-none hidden lg:block">
            <Gem className="w-64 h-64 text-[#D6B477]" />
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All Pieces"
                ? products.length
                : products.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? "bg-[#64263C] text-white shadow-md scale-105"
                    : "bg-white text-[#5A5255] border border-pink-200/80 hover:bg-pink-50"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat
                      ? "bg-white/20 text-[#D6B477]"
                      : "bg-pink-100 text-[#64263C]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jewellery by name or stone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-[#FFF9F5]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Controls: In-Stock Toggle + Sorting */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* In-Stock Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5A5255] select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-pink-300 text-[#64263C] focus:ring-[#64263C]"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8E8688] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-full border border-pink-200 bg-white text-xs font-semibold text-[#242124] focus:outline-none focus:ring-2 focus:ring-[#64263C]/30"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Count Indicator */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#5A5255] font-semibold">
          <span>
            Showing <strong className="text-[#64263C]">{sortedProducts.length}</strong> handcrafted jewellery design(s)
          </span>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-[#64263C]">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#D6B477]" />
              Syncing latest designs...
            </span>
          )}
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-200/80 p-8 shadow-sm">
            <Gem className="w-12 h-12 text-[#D6B477] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#64263C]">
              No jewellery pieces found
            </h3>
            <p className="text-xs text-[#5A5255] mt-1 max-w-sm mx-auto">
              We couldn't find matches for your current category or search filters. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Pieces");
                setSearchQuery("");
                setInStockOnly(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#64263C] text-white text-xs font-bold hover:bg-[#4E1C2E] transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((item) => {
              const itemId = item.id || item.customId;
              const isWishlisted = wishlist.includes(itemId);
              const isAdded = Boolean(addedItemMap[itemId]);
              const discountPercent =
                item.originalPrice && item.originalPrice > item.price
                  ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={itemId}
                  onClick={() => onQuickView && onQuickView(item)}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-pink-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-square overflow-hidden bg-[#FFF9F5] border-b border-pink-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Badge (e.g. Bestseller, Anti-Tarnish) */}
                      {item.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#64263C] text-white text-[10px] font-bold shadow-md">
                          {item.badge}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      {onToggleWishlist && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(itemId);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-all ${
                            isWishlisted
                              ? "bg-rose-500 text-white"
                              : "bg-white/80 text-[#64263C] hover:bg-white"
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>
                      )}

                      {/* Quick View Hover Pill on Desktop */}
                      <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 text-[#64263C] text-[11px] font-bold shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5">
                      {/* Category and Rating */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B477]">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#242124] font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.rating || 5.0}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-base text-[#64263C] line-clamp-1 group-hover:text-[#4E1C2E] transition-colors">
                        {item.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-[#5A5255] mt-1 line-clamp-2 leading-relaxed">
                        {item.shortDescription || item.longDescription}
                      </p>

                      {/* Material Highlight */}
                      {item.material && (
                        <div className="mt-2 text-[10px] text-[#8E8688] font-medium truncate">
                          ✨ {item.material}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Price & CTA */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-pink-50 flex items-center justify-between gap-2 mt-2">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-serif font-extrabold text-[#64263C]">
                          ₹{item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                      {discountPercent && (
                        <span className="text-[9px] font-bold text-emerald-700 block">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddDirect(e, item)}
                      disabled={!item.isAvailable}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : item.isAvailable
                          ? "bg-[#64263C] hover:bg-[#4E1C2E] text-white hover:scale-105"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : item.isAvailable ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#D6B477]" />
                          <span>Add</span>
                        </>
                      ) : (
                        <span>Out of Stock</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JewelleryPage;
