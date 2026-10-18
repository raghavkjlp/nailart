import React from "react";
import { MessageCircle, Eye, Star, Heart, Sparkles } from "lucide-react";
import { createProductOrderUrl } from "../utils/whatsapp.js";

export const ProductCard = ({
  product,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const directWhatsAppUrl = createProductOrderUrl({
    product,
    selectedShape: product.shape,
    selectedLength: product.defaultLength,
    selectedSize: "M"
  });

  return (
    <div className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl">
      {/* Product Image & Badges */}
      <div className="relative w-full overflow-hidden bg-pink-50/50" style={{ height: "260px" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay for subtle text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge (Bestseller, New, etc.) */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#64263C] text-[#FFF9F5] text-[10px] font-extrabold tracking-wider uppercase shadow-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? "bg-[#64263C] text-white"
              : "bg-white/80 hover:bg-white text-[#64263C]"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Shape & Length Pills Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#64263C] text-[11px] font-bold shadow-sm">
            {product.shape} • {product.defaultLength}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/60 text-[#D6B477] text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-[#D6B477]" />
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Aesthetic Tag */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#D6B477] mb-1">
            {product.collection}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="font-serif font-bold text-lg sm:text-xl text-[#64263C] hover:text-[#4E1C2E] cursor-pointer transition-colors mb-1.5"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#5A5255] line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Price & MRP */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-extrabold text-[#64263C]">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Free Prep Kit Included
            </span>
          </div>

          {/* Buttons: View Details & Order on WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickView && onQuickView(product)}
              className="w-full py-2.5 px-3 rounded-full border border-pink-200 hover:border-[#64263C] text-[#64263C] text-xs font-bold hover:bg-pink-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full text-xs font-bold py-2.5 px-3 shadow-sm flex items-center justify-center gap-1.5 text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
