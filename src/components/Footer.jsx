import React from "react";
import { Sparkles, MessageCircle, Mail } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon.jsx";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { createSupportUrl } from "../utils/whatsapp.js";

export const Footer = ({ setActiveTab, onOpenQuiz, onOpenSizing, onOpenCustomOrder }) => {
  return (
    <footer className="bg-[#242124] text-[#FFF9F5] pt-16 pb-12 border-t border-pink-900/40">
      <div className="container-custom">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-3 pb-8 lg:pb-0 border-b border-white/10 lg:border-none">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                GAMES OF GLOSS
              </span>
              <span className="text-xl">💅🏻</span>
            </div>

            <p className="text-sm font-semibold text-[#D6B477] tracking-wide">
              A Little Gloss. A Lot of Glam.
            </p>

            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm leading-relaxed">
              Your destination for handcrafted press-on nails, statement jewellery and little luxuries. Thoughtfully curated to celebrate your individuality, elevate your everyday style and add a touch of glamour to every moment.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F3B6CB] hover:text-[#64263C] text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={createSupportUrl("General Concierge")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-700/60 hover:bg-emerald-600 text-white flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F3B6CB] hover:text-[#64263C] text-white flex items-center justify-center transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#D6B477] uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Shop Nails
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("jewellery");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Shop Jewellery ✨
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-[#F3B6CB] transition-colors flex items-center gap-1 font-bold text-[#F3B6CB]"
                >
                  <span>Find My Nail Vibe</span>
                  <Sparkles className="w-3 h-3 text-[#D6B477]" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomOrder}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Custom Bespoke Orders
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizing}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Nail Sizing Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors text-[#D6B477] font-semibold flex items-center gap-1"
                >
                  <span>Admin Portal ⚙️</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#D6B477] uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("about");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  About Games of Gloss
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Contact & WhatsApp Support
                </button>
              </li>
              <li>
                <a
                  href={createSupportUrl("Shipping Inquiries")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Pan-India Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href={createSupportUrl("Application Assistance")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F3B6CB] transition-colors"
                >
                  Application & Removal FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & WhatsApp Order Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Games of Gloss. All rights reserved. Handcrafted with love in India 💅🏻
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveTab("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-gray-400 hover:text-[#D6B477] transition-colors flex items-center gap-1 font-semibold"
              title="Atelier Admin Portal"
            >
              <span>Admin ⚙️</span>
            </button>
            <span className="text-gray-600">•</span>
            <a
              href={createSupportUrl("Direct Help")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D6B477] hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {BRAND_CONFIG.whatsappDisplayNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
