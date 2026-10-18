import React, { useState, useMemo } from "react";
import { Filter, SlidersHorizontal, RotateCcw, X, Search, Sparkles } from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import { ProductCard } from "./ProductCard.jsx";

export const ShopPage = ({
  onQuickView,
  initialCollectionFilter = null,
  wishlist = [],
  onToggleWishlist,
  onOpenQuiz
}) => {
  // Filters State
  const [selectedAesthetic, setSelectedAesthetic] = useState(initialCollectionFilter || "All");
  const [selectedShape, setSelectedShape] = useState("All");
  const [selectedLength, setSelectedLength] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available Filter Options
  const aesthetics = [
    "All",
    "Coquette Princess",
    "Clean Girl",
    "Baddie Energy",
    "Wedding & Romance",
    "Glazed & Glam",
    "Romantic Dreamer",
    "Artsy & Experimental"
  ];

  const shapes = ["All", "Almond", "Square", "Coffin / Ballerina", "Oval", "Stiletto"];
  const lengths = ["All", "Short", "Medium", "Long", "Extra Long"];
  const colors = [
    "All",
    "Blush pink and baby pink",
    "Nude and milky white",
    "Black and burgundy",
    "Chrome and silver",
    "Pastels and lavender",
    "Red and cherry tones",
    "Brown and mocha"
  ];
  const priceRanges = ["All", "Under ₹499", "₹500–₹699", "₹700–₹849", "₹850+"];
  const occasions = [
    "All",
    "Everyday wear",
    "College or work",
    "Date night",
    "Wedding or special occasion",
    "Party or vacation"
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesColl = product.collection.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesColl) return false;
      }

      // Aesthetic
      if (selectedAesthetic !== "All") {
        const matchesAesthetic = product.aestheticTags.some((tag) =>
          tag.toLowerCase().includes(selectedAesthetic.toLowerCase())
        ) || product.collection.toLowerCase().includes(selectedAesthetic.toLowerCase());
        if (!matchesAesthetic) return false;
      }

      // Shape
      if (selectedShape !== "All" && product.shape !== selectedShape) {
        return false;
      }

      // Length
      if (selectedLength !== "All" && !product.availableLengths.includes(selectedLength)) {
        return false;
      }

      // Color
      if (selectedColor !== "All" && !product.colors.includes(selectedColor)) {
        return false;
      }

      // Occasion
      if (selectedOccasion !== "All" && !product.occasions.includes(selectedOccasion)) {
        return false;
      }

      // Price Range
      if (selectedPriceRange !== "All") {
        if (selectedPriceRange === "Under ₹499" && product.price >= 500) return false;
        if (selectedPriceRange === "₹500–₹699" && (product.price < 500 || product.price > 699)) return false;
        if (selectedPriceRange === "₹700–₹849" && (product.price < 700 || product.price > 849)) return false;
        if (selectedPriceRange === "₹850+" && product.price < 850) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.reviewCount - a.reviewCount;
      // Recommended: highest rating first
      return b.rating - a.rating;
    });
  }, [
    selectedAesthetic,
    selectedShape,
    selectedLength,
    selectedColor,
    selectedPriceRange,
    selectedOccasion,
    sortBy,
    searchQuery
  ]);

  const activeFiltersCount = [
    selectedAesthetic !== "All",
    selectedShape !== "All",
    selectedLength !== "All",
    selectedColor !== "All",
    selectedPriceRange !== "All",
    selectedOccasion !== "All"
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSelectedAesthetic("All");
    setSelectedShape("All");
    setSelectedLength("All");
    setSelectedColor("All");
    setSelectedPriceRange("All");
    setSelectedOccasion("All");
    setSearchQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFF9F5]">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            Handcrafted Luxury Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] mb-3">
            Shop All Press-On Sets
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5255] font-light leading-relaxed">
            Every set is handcrafted by professional nail artists using salon-grade resin and gel polish.
            Includes complete liquid glue and adhesive tabs prep kit.
          </p>
        </div>

        {/* Search, Sort and Mobile Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-pink-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#5A5255] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search set name, finish or art..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-pink-200 text-xs text-[#242124] focus:outline-none focus:border-[#64263C] bg-pink-50/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Filter Trigger & Sort Dropdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-pink-200 text-xs font-bold text-[#64263C] bg-pink-50"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5A5255] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 rounded-full border border-pink-200 bg-white text-xs font-semibold text-[#64263C] focus:outline-none focus:border-[#64263C]"
              >
                <option value="recommended">Recommended & Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Most Popular & Viral</option>
              </select>
            </div>

            <span className="text-xs font-bold text-[#64263C] whitespace-nowrap">
              {filteredProducts.length} Sets
            </span>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-pink-200 shadow-sm h-fit sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#64263C]" />
                <h3 className="font-serif font-bold text-base text-[#64263C]">Filters</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* 1. Aesthetic Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                Aesthetic
              </label>
              <div className="space-y-1">
                {aesthetics.map((aes) => (
                  <button
                    key={aes}
                    onClick={() => setSelectedAesthetic(aes)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedAesthetic === aes
                        ? "bg-pink-100 font-bold text-[#64263C]"
                        : "text-[#5A5255] hover:bg-pink-50"
                    }`}
                  >
                    <span>{aes}</span>
                    {selectedAesthetic === aes && <span className="text-[#64263C]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Shape Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                Shape
              </label>
              <div className="flex flex-wrap gap-1.5">
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedShape(s)}
                    className={`py-1 px-2.5 rounded-full text-xs transition-all ${
                      selectedShape === s
                        ? "bg-[#64263C] text-white font-bold"
                        : "border border-pink-200 text-[#5A5255] hover:bg-pink-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Length Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                Length
              </label>
              <div className="flex flex-wrap gap-1.5">
                {lengths.map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`py-1 px-2.5 rounded-full text-xs transition-all ${
                      selectedLength === len
                        ? "bg-[#64263C] text-white font-bold"
                        : "border border-pink-200 text-[#5A5255] hover:bg-pink-50"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Color Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                Color Palette
              </label>
              <div className="space-y-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedColor === c
                        ? "bg-pink-100 font-bold text-[#64263C]"
                        : "text-[#5A5255] hover:bg-pink-50"
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {selectedColor === c && <span className="text-[#64263C]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Price Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                Price (INR)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {priceRanges.map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setSelectedPriceRange(pr)}
                    className={`py-1 px-2.5 rounded-full text-xs transition-all ${
                      selectedPriceRange === pr
                        ? "bg-[#64263C] text-white font-bold"
                        : "border border-pink-200 text-[#5A5255] hover:bg-pink-50"
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Banner in Sidebar */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200 text-center">
              <Sparkles className="w-5 h-5 text-[#D6B477] mx-auto mb-1 animate-sparkle" />
              <h4 className="font-serif font-bold text-xs text-[#64263C] mb-1">
                Overwhelmed by choices?
              </h4>
              <p className="text-[11px] text-[#5A5255] mb-3">
                Take our 60-second Nail Vibe Quiz for automated recommendations!
              </p>
              <button
                onClick={onOpenQuiz}
                className="w-full py-2 rounded-full bg-[#64263C] text-white text-xs font-bold shadow-sm"
              >
                Take Quiz ✨
              </button>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-[#5A5255] font-semibold">Active Filters:</span>
                {selectedAesthetic !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200">
                    Aesthetic: {selectedAesthetic}
                    <button onClick={() => setSelectedAesthetic("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedShape !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200">
                    Shape: {selectedShape}
                    <button onClick={() => setSelectedShape("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedLength !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200">
                    Length: {selectedLength}
                    <button onClick={() => setSelectedLength("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedColor !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200">
                    Color: {selectedColor}
                    <button onClick={() => setSelectedColor("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedPriceRange !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200">
                    Price: {selectedPriceRange}
                    <button onClick={() => setSelectedPriceRange("All")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 font-bold underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center bg-white rounded-3xl border border-pink-200 my-8">
                <div className="w-16 h-16 rounded-full bg-pink-100 text-3xl flex items-center justify-center mx-auto mb-4">
                  🔍
                </div>
                <h3 className="font-serif font-bold text-xl text-[#64263C] mb-2">
                  No Nail Sets Matched Your Criteria
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5255] max-w-md mx-auto mb-6">
                  Try adjusting your filter combination or search query to explore more handcrafted designs.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary text-xs py-2.5 px-6"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-[#FFF9F5] h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-pink-200">
                <h3 className="font-serif font-bold text-lg text-[#64263C]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#64263C]" />
                </button>
              </div>

              {/* Aesthetic Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                  Aesthetic
                </label>
                <div className="space-y-1">
                  {aesthetics.map((aes) => (
                    <button
                      key={aes}
                      onClick={() => {
                        setSelectedAesthetic(aes);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs ${
                        selectedAesthetic === aes ? "bg-pink-100 font-bold text-[#64263C]" : "text-[#5A5255]"
                      }`}
                    >
                      {aes}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                  Shape
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {shapes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedShape(s);
                        setMobileFilterOpen(false);
                      }}
                      className={`py-1 px-2.5 rounded-full text-xs ${
                        selectedShape === s ? "bg-[#64263C] text-white" : "border border-pink-200 text-[#5A5255]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear & Apply */}
              <div className="pt-4 border-t border-pink-200 flex gap-2">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-1/2 py-2.5 rounded-full border border-pink-200 text-xs font-bold text-[#64263C]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 btn-primary py-2.5 text-xs justify-center"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
