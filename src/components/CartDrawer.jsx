import React from "react";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { createCartCheckoutUrl } from "../utils/whatsapp.js";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onExploreShop
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = freeShippingThreshold - subtotal;

  const whatsAppCheckoutUrl = createCartCheckoutUrl(cartItems, subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-[#FFF9F5] h-full shadow-2xl border-l border-pink-200 flex flex-col justify-between animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-pink-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#64263C]" />
            <h3 className="font-serif font-bold text-lg text-[#64263C]">Your Shopping Bag</h3>
            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#64263C] text-xs font-bold">
              {cartItems.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pink-100 text-[#64263C] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-pink-50 border-b border-pink-100 text-xs text-[#5A5255]">
          {amountNeeded > 0 ? (
            <p className="mb-1.5">
              Add <strong className="text-[#64263C]">₹{amountNeeded}</strong> more for <strong>FREE Pan-India Shipping</strong>! 📦
            </p>
          ) : (
            <p className="mb-1.5 text-emerald-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>You've unlocked FREE Express Shipping! ✨</span>
            </p>
          )}
          <div className="w-full bg-pink-200/60 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F3B6CB] via-[#D6B477] to-[#64263C] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-pink-100">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-3xl flex items-center justify-center mx-auto mb-4">
                💅🏻
              </div>
              <h4 className="font-serif font-bold text-lg text-[#64263C] mb-1">Your bag is empty</h4>
              <p className="text-xs text-[#5A5255] max-w-xs mx-auto mb-6">
                Discover your signature press-on vibe and treat yourself to salon luxury at home.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreShop && onExploreShop();
                }}
                className="btn-primary text-xs py-2.5 px-6"
              >
                Explore Nail Sets ✨
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="py-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "80px", height: "80px", minWidth: "80px", minHeight: "80px" }}
                  className="rounded-xl object-cover border border-pink-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif font-bold text-sm text-[#64263C] truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[#5A5255] mb-2">
                    {item.selectedShape || item.shape} • {item.selectedLength || item.defaultLength} • Size: {item.selectedSize || "M"}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#64263C]">
                      ₹{item.price * (item.quantity || 1)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-pink-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(idx, (item.quantity || 1) - 1)}
                        className="px-2 py-0.5 text-xs text-[#5A5255] hover:bg-pink-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-[#64263C]">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, (item.quantity || 1) + 1)}
                        className="px-2 py-0.5 text-xs text-[#5A5255] hover:bg-pink-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-pink-200 bg-white/90 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5A5255]">Subtotal</span>
              <span className="font-bold text-lg text-[#64263C]">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#5A5255]">
              <span>Prep Kits & Sizing Consultation</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>

            <a
              href={whatsAppCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Checkout Order on WhatsApp (₹{subtotal})</span>
            </a>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onClearCart}
                className="text-[11px] text-[#5A5255] hover:text-red-600 underline"
              >
                Clear Bag
              </button>
              <span className="text-[11px] text-[#5A5255]">
                🔒 Fast Pan-India Delivery
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
