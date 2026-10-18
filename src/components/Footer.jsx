import React, { useState } from "react";
import { Sparkles, MessageCircle, Mail, MapPin, Heart, Send } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon.jsx";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { createSupportUrl } from "../utils/whatsapp.js";

export const Footer = ({ setActiveTab, onOpenQuiz, onOpenSizing, onOpenCustomOrder }) => {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <footer className="bg-[#242124] text-[#FFF9F5] pt-16 pb-12 border-t border-pink-900/40">
      <div className="container-custom">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                GAMES OF GLOSS
              </span>
              <span className="text-xl">💅🏻</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm leading-relaxed">
              India's premium handcrafted press-on nail brand. Dedicated to empowering self-expression through salon-quality, reusable nail artistry you can apply in 10 minutes.
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
                  Shop Nail Sets
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
                  Nail Sizing Guide (mm)
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
                  About Our Atelier
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

          {/* Gloss VIP Club Newsletter */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#D6B477] uppercase tracking-wider mb-4">
              The Gloss Club 💌
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Subscribe for VIP secret drop alerts, seasonal nail art edits, and 10% off your first set.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-pink-900/40 border border-pink-700/60 text-xs text-[#F3B6CB] font-semibold">
                ✨ Welcome to the club, babe! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F3B6CB]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F3B6CB] text-[#64263C] flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & WhatsApp Order Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © {new Date().getFullYear()} Games of Gloss. All rights reserved. Handcrafted with love in India 💅🏻
          </div>

          <div className="flex items-center gap-4">
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
