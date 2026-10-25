import React, { useState } from "react";
import {
  X,
  Star,
  Check,
  MessageCircle,
  ShoppingBag,
  Ruler,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  ChevronRight
} from "lucide-react";
import { createProductOrderUrl } from "../utils/whatsapp.js";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { NailShapeIcon } from "./NailShapeIcon.jsx";

export const ProductDetailModal = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizing,
  onOpenCustomOrder
}) => {
  if (!product) return null;

  const displayedShapes = product.availableShapes?.length
    ? BRAND_CONFIG.shapes.filter((s) => product.availableShapes.includes(s.id))
    : BRAND_CONFIG.shapes;

  const displayedLengths = product.availableLengths?.length
    ? product.availableLengths
    : ["Short", "Medium", "Long", "Extra Long"];

  const displayedSizes = product.availableSizes?.length
    ? product.availableSizes
    : ["XS", "S", "M", "L", "Custom"];

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedShape, setSelectedShape] = useState(
    product.shape || displayedShapes[0]?.id || "Almond"
  );
  const [selectedLength, setSelectedLength] = useState(
    product.defaultLength || displayedLengths[0] || "Medium"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.defaultSize || displayedSizes[0] || "M"
  );
  const [activeTab, setActiveTab] = useState("application"); // 'application' | 'details' | 'removal'
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.gallery || [product.image];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedShape,
      selectedLength,
      selectedSize,
      quantity: 1
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const whatsAppUrl = createProductOrderUrl({
    product,
    selectedShape,
    selectedLength,
    selectedSize
  });

  const discountAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-lg bg-[#FFF9F5] border border-pink-200 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Gallery & Zoom Preview */}
            <div>
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-pink-100/40 border border-pink-200 mb-4 shadow-sm">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#64263C] text-white text-[11px] font-bold uppercase tracking-wider shadow">
                  {product.badge || "Handcrafted Luxury"}
                </span>
              </div>

              {/* Thumbnail selector */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img
                          ? "border-[#64263C] ring-2 ring-pink-300 scale-105"
                          : "border-pink-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Inclusions Card */}
              <div className="mt-6 p-4 rounded-2xl bg-white/80 border border-pink-200 text-xs">
                <div className="font-serif font-bold text-[#64263C] mb-2 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#D6B477]" />
                  <span>Complimentary Salon Prep Kit Included</span>
                </div>
                <p className="text-[#5A5255] leading-relaxed mb-2">
                  {product.inclusions}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reusable up to 5x with included jelly adhesive tabs</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Customization Options */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Collection & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D6B477]">
                    {product.collection}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#64263C]">
                    <Star className="w-3.5 h-3.5 fill-current text-[#D6B477]" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({product.reviewCount} verified reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#64263C]">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                  {discountAmount > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Save ₹{discountAmount}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed mb-6">
                  {product.longDescription}
                </p>

                {/* 1. Shape Selection */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                      1. Select Shape: <span className="text-[#64263C] font-serif">{selectedShape}</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {displayedShapes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedShape(s.id)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                          selectedShape === s.id
                            ? "border-[#64263C] bg-white ring-2 ring-pink-300 font-bold"
                            : "border-pink-200 bg-white/60 hover:bg-white text-[#5A5255]"
                        }`}
                      >
                        <NailShapeIcon
                          shape={s.id}
                          className="w-5 h-8 mb-1"
                          color={selectedShape === s.id ? "#64263C" : "#D6B477"}
                        />
                        <span className="text-[10px] truncate max-w-full">{s.name.split("/")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Length Selection */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-2">
                    2. Select Length: <span className="text-[#64263C] font-serif">{selectedLength}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {displayedLengths.map((len) => (
                      <button
                        key={len}
                        onClick={() => setSelectedLength(len)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          selectedLength === len
                            ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                            : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Nail Bed Size Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#242124] uppercase tracking-wider">
                      3. Select Size: <span className="text-[#64263C] font-serif">{selectedSize}</span>
                    </label>
                    <button
                      onClick={onOpenSizing}
                      className="text-xs text-[#64263C] font-bold underline hover:text-[#D6B477] flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide (mm)</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {displayedSizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedSize === sz
                            ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                            : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  {selectedSize === "Custom" && (
                    <p className="text-[11px] text-[#5A5255] mt-1.5 italic">
                      ✨ You can share your custom thumb-to-pinky millimeter measurements when WhatsApp opens!
                    </p>
                  )}
                </div>

                {/* CTAs: WhatsApp Order & Add to Bag */}
                <div className="space-y-3 mb-6">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Order on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 px-6 rounded-full border-2 border-[#64263C] text-[#64263C] hover:bg-[#64263C] hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedAnimation ? "✓ Added to Shopping Bag!" : "Add to Shopping Bag"}</span>
                  </button>
                </div>

                <div className="text-center text-[11px] text-[#5A5255] mb-6">
                  💌 Have a special design idea?{" "}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCustomOrder && onOpenCustomOrder();
                    }}
                    className="text-[#64263C] font-bold underline"
                  >
                    Request Custom Atelier Order
                  </button>
                </div>
              </div>

              {/* Informational Tabs (Application, Removal, Care) */}
              <div className="border-t border-pink-200 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setActiveTab("application")}
                    className={`text-xs font-bold pb-1 border-b-2 transition-all ${
                      activeTab === "application"
                        ? "border-[#64263C] text-[#64263C]"
                        : "border-transparent text-[#5A5255] hover:text-[#242124]"
                    }`}
                  >
                    10-Min Application
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => setActiveTab("removal")}
                    className={`text-xs font-bold pb-1 border-b-2 transition-all ${
                      activeTab === "removal"
                        ? "border-[#64263C] text-[#64263C]"
                        : "border-transparent text-[#5A5255] hover:text-[#242124]"
                    }`}
                  >
                    Safe Gentle Removal
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => setActiveTab("wearTime")}
                    className={`text-xs font-bold pb-1 border-b-2 transition-all ${
                      activeTab === "wearTime"
                        ? "border-[#64263C] text-[#64263C]"
                        : "border-transparent text-[#5A5255] hover:text-[#242124]"
                    }`}
                  >
                    Glue vs. Tabs
                  </button>
                </div>

                <div className="text-xs text-[#5A5255] leading-relaxed bg-pink-50/50 p-3.5 rounded-xl border border-pink-100">
                  {activeTab === "application" && (
                    <ol className="list-decimal list-inside space-y-1">
                      <li><strong>Prep:</strong> Push cuticles back gently & buff natural nail shine with mini buffer.</li>
                      <li><strong>Cleanse:</strong> Wipe each nail thoroughly with the alcohol prep pad to dehydrate oils.</li>
                      <li><strong>Apply:</strong> Apply liquid glue or adhesive tab. Press firmly from cuticle at 45° angle for 20 seconds. Slay! ✨</li>
                    </ol>
                  )}
                  {activeTab === "removal" && (
                    <p>
                      Soak hands in warm soapy water with a few drops of cuticle oil or baby oil for 10–15 minutes. Gently rock nails side to side with the cuticle stick. Never force or rip them off!
                    </p>
                  )}
                  {activeTab === "wearTime" && (
                    <p>
                      <strong>Liquid Glue:</strong> Holds strong for 2–3 weeks (ideal for long trips & vacations).<br />
                      <strong>Adhesive Jelly Tabs:</strong> Holds for 3–5 days, zero natural nail damage, allows reusing nails up to 5 times!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
