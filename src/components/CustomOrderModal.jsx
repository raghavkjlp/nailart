import React, { useState } from "react";
import { X, Sparkles, MessageCircle, Palette, Check, AlertCircle } from "lucide-react";
import { createCustomOrderUrl } from "../utils/whatsapp.js";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const CustomOrderModal = ({ onClose }) => {
  const [shape, setShape] = useState("Almond");
  const [length, setLength] = useState("Medium");
  const [size, setSize] = useState("M");
  const [aesthetic, setAesthetic] = useState("Coquette Princess");
  const [budget, setBudget] = useState("₹799–₹999");
  const [inspirationNote, setInspirationNote] = useState("");

  const customWhatsAppUrl = createCustomOrderUrl({
    shape,
    length,
    size,
    aesthetic,
    inspirationNote,
    budget
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-md bg-[#FFF9F5] border border-pink-200 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Palette className="w-3.5 h-3.5 text-[#D6B477]" />
              1-on-1 Bespoke Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
              Commission a Custom Nail Set
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] max-w-md mx-auto">
              Have a Pinterest moodboard, concert look, or bridal theme? Let our senior nail artists handcraft your 1-of-1 set.
            </p>
          </div>

          <div className="space-y-5 mb-6">
            {/* 1. Shape */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                1. Select Shape
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BRAND_CONFIG.shapes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShape(s.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border text-center transition-all ${
                      shape === s.id
                        ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                        : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                    }`}
                  >
                    {s.name.split("/")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Length */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                2. Select Length
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Short", "Medium", "Long", "Extra Long"].map((len) => (
                  <button
                    key={len}
                    onClick={() => setLength(len)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      length === len
                        ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                        : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Nail Bed Size */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                3. Your Nail Bed Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {["XS", "S", "M", "L", "Custom mm"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      size === sz
                        ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                        : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Aesthetic / Style */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                4. Preferred Aesthetic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Coquette & Pearls 🎀",
                  "Clean Girl Glaze 🤍",
                  "Baddie Chrome & Thorns 🖤",
                  "Bridal Couture 💍",
                  "Y2K / Kawaii Art 🌸",
                  "Moody Gothic Velvet 🍷"
                ].map((aes) => (
                  <button
                    key={aes}
                    onClick={() => setAesthetic(aes)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-left truncate transition-all ${
                      aesthetic === aes
                        ? "border-[#64263C] bg-pink-100 text-[#64263C] font-bold"
                        : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                    }`}
                  >
                    {aes}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Details & Inspiration Notes */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                5. Describe Your Vision
              </label>
              <textarea
                value={inspirationNote}
                onChange={(e) => setInspirationNote(e.target.value)}
                rows={3}
                placeholder="e.g. Milky white French with 3D chrome bows on thumb and ring finger, and subtle cat-eye shimmer..."
                className="w-full p-3.5 rounded-2xl border border-pink-200 bg-white text-xs text-[#242124] focus:outline-none focus:border-[#64263C] focus:ring-1 focus:ring-[#64263C]"
              />
              <span className="text-[11px] text-[#5A5255] mt-1 block">
                💡 You can send your reference photos directly in the WhatsApp chat that opens!
              </span>
            </div>

            {/* 6. Budget Tier */}
            <div>
              <label className="text-xs font-bold text-[#242124] uppercase tracking-wider block mb-1.5">
                6. Estimated Budget
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Under ₹799", "₹799–₹999", "₹1000+"].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setBudget(bg)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      budget === bg
                        ? "border-[#64263C] bg-[#64263C] text-white shadow-sm"
                        : "border-pink-200 bg-white hover:bg-pink-50 text-[#5A5255]"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit on WhatsApp */}
          <div className="pt-4 border-t border-pink-200">
            <a
              href={customWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Custom Order Request on WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-[#5A5255] mt-2.5">
              Review your compiled brief in WhatsApp and attach your reference images. Our artist will reply with quote & timeline!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
