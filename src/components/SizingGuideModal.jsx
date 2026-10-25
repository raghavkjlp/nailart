import React, { useState } from "react";
import {
  X,
  Ruler,
  HelpCircle,
  Check,
  MessageCircle,
  Sparkles,
  Camera,
  CheckCircle2,
  Maximize2,
  Info
} from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { createSupportUrl } from "../utils/whatsapp.js";

export const SizingGuideModal = ({ onClose }) => {
  const [activeMethod, setActiveMethod] = useState("coin"); // Default to 'coin' as requested
  const [enlargedImage, setEnlargedImage] = useState(null);

  const coinWhatsAppUrl = `https://wa.me/${BRAND_CONFIG.whatsappNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    "Hi Games of Gloss! 💅🏻✨ I have taken the 2 photos using the Coin Method (thumb & 4 fingers). Sending them over now for free digital nail sizing! 📏"
  )}`;

  return (
    <div className="modal-backdrop">
      <div className="modal-content modal-content-md bg-[#FFF9F5] border border-pink-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Ruler className="w-3.5 h-3.5 text-[#D6B477]" />
              Perfect Fit Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-1.5">
              How to Find Your Nail Size
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] max-w-md mx-auto">
              Press-on nails look salon-sculpted when they hug your natural cuticle contours seamlessly. Measure in under 2 minutes!
            </p>
          </div>

          {/* Sizing Standard Table */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
            <div className="bg-pink-100/70 px-4 py-2.5 text-xs font-bold text-[#64263C] flex items-center justify-between">
              <span>Standard Size Chart (Thumb • Index • Middle • Ring • Pinky)</span>
              <span className="text-[10px] text-[#D6B477] uppercase font-bold">In Millimeters</span>
            </div>
            <div className="divide-y divide-pink-100">
              {BRAND_CONFIG.sizingChart.map((row) => (
                <div
                  key={row.size}
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-pink-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#64263C] text-white flex items-center justify-center font-bold text-[11px]">
                      {row.size}
                    </span>
                    <span className="font-semibold text-[#242124]">{row.recommended}</span>
                  </div>
                  <div className="text-[#64263C] font-mono text-[11px] sm:text-xs font-medium pl-8 sm:pl-0">
                    {row.measurements}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurement Method Switcher */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <button
                onClick={() => setActiveMethod("coin")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMethod === "coin"
                    ? "bg-[#64263C] text-white shadow-md scale-102"
                    : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#D6B477]" />
                <span>Method 1: Coin Photo (Easiest) 🪙</span>
              </button>
              <button
                onClick={() => setActiveMethod("tape")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMethod === "tape"
                    ? "bg-[#64263C] text-white shadow-md scale-102"
                    : "bg-white text-[#5A5255] border border-pink-200 hover:bg-pink-50"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Method 2: Tape & Ruler</span>
              </button>
            </div>

            {/* METHOD 1: COIN METHOD (WITH USER'S ACTUAL PHOTOS) */}
            {activeMethod === "coin" ? (
              <div className="space-y-4">
                <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-200 text-xs text-[#5A5255]">
                  <p className="font-serif font-bold text-sm text-[#64263C] mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D6B477]" />
                    <span>Free WhatsApp Digital Sizing via Coin Calibration</span>
                  </p>
                  <p className="leading-relaxed">
                    No ruler handy? Simply place any standard coin (like a ₹5 or ₹10 coin) next to your fingers on a plain surface/sticky note. Take <strong>two quick top-down photos</strong> and send them to us on WhatsApp! Our sizing artists will measure your exact millimeters digitally.
                  </p>
                </div>

                {/* The Two Coin Method Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo 1: Thumb beside coin */}
                  <div className="bg-white rounded-2xl border border-pink-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="bg-pink-100/60 px-3.5 py-2 flex items-center justify-between text-xs font-bold text-[#64263C]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#64263C] text-white flex items-center justify-center text-[10px]">1</span>
                        Photo 1: Thumb Beside Coin
                      </span>
                      <span className="text-[10px] text-[#D6B477] uppercase font-bold">Sample Reference</span>
                    </div>

                    <div
                      className="relative h-56 bg-amber-50/30 overflow-hidden cursor-pointer"
                      onClick={() => setEnlargedImage("/images/coin_method_thumb.jpeg")}
                      title="Click to enlarge"
                    >
                      <img
                        src="/images/coin_method_thumb.jpeg"
                        alt="Coin Method - Thumb placement sample"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-[#64263C] text-[11px] font-bold flex items-center gap-1 shadow-md">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Click to View Full Size
                        </span>
                      </div>
                    </div>

                    <div className="p-3 text-[11px] text-[#5A5255] border-t border-pink-100 bg-[#FFFDFB]">
                      <strong>How to pose:</strong> Place your thumb flat on a plain sticky note or white sheet with the coin directly next to it.
                    </div>
                  </div>

                  {/* Photo 2: 4 Fingers beside coin */}
                  <div className="bg-white rounded-2xl border border-pink-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="bg-pink-100/60 px-3.5 py-2 flex items-center justify-between text-xs font-bold text-[#64263C]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#64263C] text-white flex items-center justify-center text-[10px]">2</span>
                        Photo 2: Four Fingers Beside Coin
                      </span>
                      <span className="text-[10px] text-[#D6B477] uppercase font-bold">Sample Reference</span>
                    </div>

                    <div
                      className="relative h-56 bg-amber-50/30 overflow-hidden cursor-pointer"
                      onClick={() => setEnlargedImage("/images/coin_method_fingers.jpeg")}
                      title="Click to enlarge"
                    >
                      <img
                        src="/images/coin_method_fingers.jpeg"
                        alt="Coin Method - 4 Fingers placement sample"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-[#64263C] text-[11px] font-bold flex items-center gap-1 shadow-md">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Click to View Full Size
                        </span>
                      </div>
                    </div>

                    <div className="p-3 text-[11px] text-[#5A5255] border-t border-pink-100 bg-[#FFFDFB]">
                      <strong>How to pose:</strong> Place your 4 fingers flat together next to the coin and snap straight from above.
                    </div>
                  </div>
                </div>

                {/* 3 Golden Photo Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-[#5A5255]">
                  <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#64263C] block">90° Top-Down Angle</strong>
                      Hold phone directly above your hand, avoiding diagonal tilts.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#64263C] block">Natural Lighting</strong>
                      Ensure bright, clean lighting without dark shadows over nails.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-pink-100 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#64263C] block">Standard Coin</strong>
                      Any ₹1, ₹2, ₹5, or ₹10 coin placed flat alongside.
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp CTA Button */}
                <div className="pt-2">
                  <a
                    href={coinWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full py-3 px-5 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send My 2 Coin Photos on WhatsApp for Free Sizing</span>
                  </a>
                </div>
              </div>
            ) : (
              /* METHOD 2: TAPE & RULER METHOD */
              <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 text-xs text-[#5A5255] space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#64263C] block">Apply Clear Tape:</strong>
                    Place a strip of clear scotch tape across the widest part of your natural nail bed.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#64263C] block">Mark Both Sidewalls:</strong>
                    Use a fine pen to mark both sidewalls where your nail curves into the skin.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D6B477] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#64263C] block">Measure in Millimeters:</strong>
                    Peel the tape off, lay it flat on a metric millimeter ruler, and compare against our chart above!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sizing Stylist Help CTA */}
          <div className="p-4 rounded-2xl bg-white border border-pink-200 text-center">
            <h4 className="font-serif font-bold text-sm text-[#64263C] mb-1">
              Still Unsure About Your Fit?
            </h4>
            <p className="text-[11px] text-[#5A5255] mb-3">
              We offer free 1-on-1 sizing consultations so you never end up with ill-fitting press-on nails.
            </p>
            <a
              href={createSupportUrl("Sizing Consultation")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs font-bold py-2 px-5 inline-flex items-center gap-1.5 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Sizing Specialist on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Modal for Enlarged Photo Preview */}
        {enlargedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="relative max-w-2xl w-full bg-white rounded-3xl p-3 overflow-hidden shadow-2xl">
              <button
                onClick={() => setEnlargedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={enlargedImage}
                alt="Enlarged reference"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="p-3 text-center text-xs font-semibold text-[#64263C]">
                Coin Sizing Reference — Lay fingers flat next to standard coin in bright light
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
