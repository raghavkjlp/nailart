import React, { useState } from "react";
import {
  X,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Heart,
  Gem,
  Award
} from "lucide-react";

export const JewelleryDetailModal = ({
  product,
  onClose,
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isWishlisted = wishlist.includes(product.id || product.customId);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        id: product.id || product.customId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        material: product.material,
        quantity: quantity,
        type: "jewellery"
      });
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1800);
    }
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#FFF9F5] rounded-3xl sm:rounded-[36px] border border-pink-200/90 shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-pink-100 text-[#64263C] border border-pink-200 shadow-md transition-all"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 sm:p-8 bg-white flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-pink-100">
            {/* Primary Large Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFF9F5] border border-pink-100 shadow-inner group">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {product.badge && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#64263C] text-white text-[11px] font-bold shadow-md">
                  {product.badge}
                </div>
              )}

              {/* Wishlist Floating Button */}
              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product.id || product.customId)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                    isWishlisted
                      ? "bg-rose-500 text-white"
                      : "bg-white/85 text-[#64263C] hover:bg-white"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-4 overflow-x-auto max-w-full pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? "border-[#64263C] scale-105 shadow-sm"
                        : "border-pink-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchasing */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6B477]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#242124] font-semibold bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 5.0}</span>
                  <span className="text-[#8E8688]">({product.reviewCount || 24})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#64263C]">
                {product.name}
              </h1>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#64263C]">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    {discountPercent && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Availability Indicator */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span className="text-xs font-semibold text-[#5A5255]">
                  {product.isAvailable ? "In Stock • Ready to Dispatch" : "Temporarily Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed">
                  {product.longDescription || product.shortDescription}
                </p>
              </div>

              {/* Specifications / Highlights */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-2xl bg-white border border-pink-100">
                  <span className="text-[10px] uppercase font-bold text-[#D6B477] block">Material</span>
                  <span className="text-xs font-semibold text-[#242124] block mt-0.5 truncate">
                    {product.material || "18K Gold Plated Brass"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-pink-100">
                  <span className="text-[10px] uppercase font-bold text-[#D6B477] block">Size / Fit</span>
                  <span className="text-xs font-semibold text-[#242124] block mt-0.5 truncate">
                    {product.size || "Adjustable Free Size"}
                  </span>
                </div>
              </div>

              {/* Care & Inclusions */}
              {product.careInstructions && (
                <div className="mt-4 p-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-[11px] text-[#5A5255]">
                  <span className="font-bold text-[#64263C] block mb-0.5">Atelier Care Guide:</span>
                  <span>{product.careInstructions}</span>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Bag */}
            <div className="pt-4 border-t border-pink-100 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-full border border-pink-200 bg-white px-3 py-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="text-sm font-bold text-[#64263C] hover:text-[#4E1C2E] px-1 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#242124]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-sm font-bold text-[#64263C] hover:text-[#4E1C2E] px-1"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAdd}
                  disabled={!product.isAvailable}
                  className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? "bg-emerald-600 text-white"
                      : product.isAvailable
                      ? "bg-[#64263C] hover:bg-[#4E1C2E] text-white hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : product.isAvailable ? (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#D6B477]" />
                      <span>Add to Shopping Bag • ₹{product.price * quantity}</span>
                    </>
                  ) : (
                    <span>Sold Out</span>
                  )}
                </button>
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#5A5255] text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#D6B477]" />
                  <span>Fast Pan-India Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#D6B477]" />
                  <span>Anti-Tarnish Plating</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Award className="w-4 h-4 text-[#D6B477]" />
                  <span>Velvet Pouch Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryDetailModal;
