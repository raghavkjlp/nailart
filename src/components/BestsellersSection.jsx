import React, { useState } from "react";
import { Sparkles, ArrowRight, Flame } from "lucide-react";
import { PRODUCTS } from "../data/products.js";
import { ProductCard } from "./ProductCard.jsx";

export const BestsellersSection = ({
  onQuickView,
  wishlist = [],
  onToggleWishlist,
  onExploreShop
}) => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Bestsellers 🔥" },
    { id: "coquette", label: "Coquette 🎀" },
    { id: "clean", label: "Clean Girl 🤍" },
    { id: "chrome", label: "Chrome & Glazed ✨" },
    { id: "baddie", label: "Baddie Energy 🖤" }
  ];

  const filteredBestsellers = PRODUCTS.filter((p) => {
    if (activeTab === "all") return p.rating >= 4.9 || p.badge.includes("Bestseller") || p.badge.includes("Viral");
    if (activeTab === "coquette") return p.collection.includes("Coquette");
    if (activeTab === "clean") return p.collection.includes("Clean Girl");
    if (activeTab === "chrome") return p.collection.includes("Chrome");
    if (activeTab === "baddie") return p.collection.includes("Baddie");
    return true;
  }).slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFF9F5] via-[#F8DCE5]/30 to-[#FFF9F5] border-t border-pink-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-[#D6B477]" />
              Most Loved By Our Community
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C]">
              Bestselling Press-Ons
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] max-w-lg mt-2 font-light">
              The sets our customers re-order time and time again. 100% reusable with complimentary salon prep kit.
            </p>
          </div>

          <button
            onClick={onExploreShop}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64263C] hover:text-[#4E1C2E] border-b-2 border-[#64263C] pb-1 w-fit group"
          >
            <span>View All Nail Sets ({PRODUCTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#64263C] text-white shadow-md scale-105"
                  : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
