import React, { useState } from "react";
import { X, Ruler, HelpCircle, Check, MessageCircle, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { createSupportUrl } from "../utils/whatsapp.js";

export const SizingGuideModal = ({ onClose }) => {
  const [activeMethod, setActiveMethod] = useState("tape"); // 'tape' | 'coin'

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
              <Ruler className="w-3.5 h-3.5 text-[#D6B477]" />
              Perfect Fit Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
              How to Find Your Nail Size
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] max-w-md mx-auto">
              Press-on nails look best when they hug your natural cuticle contours seamlessly. Measure in under 2 minutes!
            </p>
          </div>

          {/* Sizing Standard Table */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
            <div className="bg-pink-100/70 px-4 py-2.5 text-xs font-bold text-[#64263C] flex items-center justify-between">
              <span>Standard Size Chart (Thumb • Index • Middle • Ring • Pinky)</span>
              <span className="text-[10px] text-[#D6B477] uppercase font-bold">In Millimeters</span>
            </div>
            <div className="divide-y divide-pink-100">
              {BRAND_CONFIG.sizingChart.map((row) => (
                <div key={row.size} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-pink-50/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#64263C] text-white flex items-center justify-center font-bold text-xs">
                      {row.size}
                    </span>
                    <span className="font-semibold text-[#242124]">{row.recommended}</span>
                  </div>
                  <div className="text-[#64263C] font-mono text-[11px] sm:text-xs font-medium pl-9 sm:pl-0">
                    {row.measurements}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurement Method Switcher */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setActiveMethod("tape")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeMethod === "tape"
                    ? "bg-[#64263C] text-white shadow-md"
                    : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                }`}
              >
                Method 1: Tape & Ruler (Most Accurate)
              </button>
              <button
                onClick={() => setActiveMethod("coin")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeMethod === "coin"
                    ? "bg-[#64263C] text-white shadow-md"
                    : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                }`}
              >
                Method 2: Coin Photo on WhatsApp
              </button>
            </div>

            {activeMethod === "tape" ? (
              <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 text-xs text-[#5A5255] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <p>Place a strip of clear scotch tape across the widest part of your natural nail bed.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <p>Use a fine pen to mark both sidewalls where your nail meets the skin.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <p>Peel the tape off, place it flat on a ruler, and note down the millimeters for all 5 fingers!</p>
                </div>
              </div>
            ) : (
              <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 text-xs text-[#5A5255] space-y-2.5">
                <p>
                  Don't have a ruler handy? Simply place any standard coin (like a ₹1 or ₹5 coin) next to your flat hand on a plain surface and snap a top-down photo in bright natural light.
                </p>
                <p className="font-semibold text-[#64263C]">
                  Send the photo to us on WhatsApp, and our sizing specialists will measure your exact millimeters digitally!
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp Stylist Help CTA */}
          <div className="p-4 rounded-2xl bg-white border border-pink-200 text-center">
            <h4 className="font-serif font-bold text-sm text-[#64263C] mb-1">
              Still Unsure About Sizing?
            </h4>
            <p className="text-[11px] text-[#5A5255] mb-3">
              We offer free 1-on-1 sizing assistance on WhatsApp so you never end up with ill-fitting nails.
            </p>
            <a
              href={createSupportUrl("Sizing Consultation")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs font-bold py-2 px-5 inline-flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Sizing Help on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
