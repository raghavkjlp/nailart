import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  HelpCircle,
  Ruler
} from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const Navbar = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenQuiz,
  onOpenSizing
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop Nail Sets" },
    { id: "sizing", label: "Sizing Guide" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" }
  ];

  const handleNavClick = (id) => {
    if (id === "sizing") {
      onOpenSizing && onOpenSizing();
    } else {
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. Announcement Bar */}
      <div className="bg-[#64263C] text-[#FFF9F5] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[#4E1C2E] whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-[#D6B477] animate-sparkle shrink-0" />
        <span className="whitespace-nowrap">{BRAND_CONFIG.announcementText}</span>
        <span className="hidden md:inline-block text-[#D6B477] whitespace-nowrap">• Free Pan-India Shipping over ₹999</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFF9F5]/90 backdrop-blur-md shadow-md py-3 border-b border-pink-200/50"
            : "bg-[#FFF9F5]/80 backdrop-blur-sm py-4 border-b border-pink-100"
        }`}
      >
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#64263C] hover:bg-pink-100/50 rounded-xl transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo Text Treatment */}
          <div
            onClick={() => handleNavClick("home")}
            className="cursor-pointer flex flex-col items-center lg:items-start select-none group shrink-0"
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-[#64263C] group-hover:text-[#4E1C2E] transition-colors whitespace-nowrap">
                GAMES OF GLOSS
              </span>
              <span className="text-xl shrink-0">💅🏻</span>
            </div>
            <span className="text-[10px] tracking-[0.25em] font-sans font-bold uppercase text-[#D6B477] -mt-1 hidden sm:block whitespace-nowrap">
              Luxury Press-On Atelier
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold tracking-wide transition-all duration-200 relative py-1 whitespace-nowrap shrink-0 ${
                  activeTab === item.id
                    ? "text-[#64263C]"
                    : "text-[#5A5255] hover:text-[#64263C]"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#64263C] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Action CTAs: Find My Vibe + Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent Find My Vibe button */}
            <button
              onClick={() => onOpenQuiz && onOpenQuiz()}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-[#F3B6CB] via-[#D6B477] to-[#F3B6CB] text-[#64263C] shadow-sm hover:shadow-md hover:scale-105 transition-all border border-pink-200 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#64263C] shrink-0" />
              <span className="whitespace-nowrap">Find My Vibe</span>
            </button>

            {/* Shopping Bag Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/80 hover:bg-pink-100 text-[#64263C] border border-pink-200 transition-all shadow-sm shrink-0"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#64263C] text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF9F5] border-t border-pink-200 px-6 py-6 space-y-4 shadow-xl animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left py-2.5 px-3 rounded-xl text-base font-semibold ${
                  item.isSpecial
                    ? "bg-pink-100 text-[#64263C] font-bold"
                    : activeTab === item.id
                    ? "text-[#64263C] bg-pink-50"
                    : "text-[#5A5255]"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 border-t border-pink-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenQuiz && onOpenQuiz();
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full py-3 text-sm justify-center"
              >
                <Sparkles className="w-4 h-4 text-[#D6B477]" />
                <span>Take Nail Vibe Quiz ✨</span>
              </button>

              <button
                onClick={() => {
                  onOpenSizing && onOpenSizing();
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary w-full py-2.5 text-xs justify-center"
              >
                <Ruler className="w-4 h-4" />
                <span>Nail Sizing Chart (mm)</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
