import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  HelpCircle,
  Ruler,
  ChevronLeft,
  ChevronRight
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

  // Announcement Slider State
  const announcements = BRAND_CONFIG.announcements || [
    {
      id: "dream-nails",
      text: "Your dream nails, delivered 💌",
      sub: "Discover your signature nail vibe",
      action: "shop"
    },
    {
      id: "free-shipping",
      text: "Free Pan-India Shipping over ₹999 📦",
      sub: "Express 3–5 day doorstep delivery",
      action: "shop"
    },
    {
      id: "salon-finish",
      text: "Salon Finish in 10 Mins 💅🏻",
      sub: "Reusable up to 5x • Gentle on natural nails",
      action: "about"
    },
    {
      id: "nail-quiz",
      text: "Find Your Nail Aesthetic ✨",
      sub: "Take our 60-second Nail Vibe Quiz",
      action: "quiz"
    }
  ];

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [announcementFade, setAnnouncementFade] = useState(true);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);

  useEffect(() => {
    if (isAnnouncementPaused) return;
    const timer = setInterval(() => {
      setAnnouncementFade(false);
      setTimeout(() => {
        setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setAnnouncementFade(true);
      }, 220);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAnnouncementPaused, announcements.length]);

  const handlePrevAnnouncement = (e) => {
    e.stopPropagation();
    setAnnouncementFade(false);
    setTimeout(() => {
      setCurrentAnnouncementIndex(
        (prev) => (prev - 1 + announcements.length) % announcements.length
      );
      setAnnouncementFade(true);
    }, 150);
  };

  const handleNextAnnouncement = (e) => {
    e.stopPropagation();
    setAnnouncementFade(false);
    setTimeout(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
      setAnnouncementFade(true);
    }, 150);
  };

  const handleAnnouncementClick = (action) => {
    if (action === "quiz") {
      if (onOpenQuiz) onOpenQuiz();
    } else if (action === "sizing") {
      if (onOpenSizing) onOpenSizing();
    } else if (action === "shop") {
      handleNavClick("shop");
    } else if (action === "about") {
      handleNavClick("about");
    }
  };

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
      if (onOpenSizing) onOpenSizing();
    } else {
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const currentAnnouncement = announcements[currentAnnouncementIndex] || announcements[0];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. Auto-Rotating Announcement Bar (Optimized for Mobile & Desktop) */}
      <div
        className="bg-[#64263C] text-[#FFF9F5] py-2 px-2 sm:px-4 border-b border-[#4E1C2E] select-none transition-colors"
        onMouseEnter={() => setIsAnnouncementPaused(true)}
        onMouseLeave={() => setIsAnnouncementPaused(false)}
        onTouchStart={() => setIsAnnouncementPaused(true)}
        onTouchEnd={() => setIsAnnouncementPaused(false)}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrevAnnouncement}
            className="p-1 text-[#FFF9F5]/70 hover:text-[#D6B477] hover:bg-white/10 active:scale-90 rounded-full transition-all shrink-0 focus:outline-none"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Announcement Content (Clickable) */}
          <div
            onClick={() => handleAnnouncementClick(currentAnnouncement.action)}
            className={`flex-1 min-w-0 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 text-center transition-all duration-300 ease-in-out ${announcementFade
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1"
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477] animate-sparkle shrink-0" />

            {/* Primary message: Fits on every phone without clipping or horizontal overflow */}
            <span className="font-semibold text-[11px] sm:text-xs text-[#FFF9F5] tracking-wide truncate">
              {currentAnnouncement.text}
            </span>

            {/* Desktop secondary detail */}
            {currentAnnouncement.sub && (
              <span className="hidden md:inline-block text-[#D6B477] text-xs font-normal">
                • {currentAnnouncement.sub}
              </span>
            )}

            {/* Interactive hint on desktop */}
            <span className="hidden lg:inline-block text-[10px] text-[#D6B477]/80 hover:text-[#D6B477] ml-1 underline decoration-dotted">
              view →
            </span>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNextAnnouncement}
            className="p-1 text-[#FFF9F5]/70 hover:text-[#D6B477] hover:bg-white/10 active:scale-90 rounded-full transition-all shrink-0 focus:outline-none"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${isScrolled
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
                className={`text-sm font-semibold tracking-wide transition-all duration-200 relative py-1 whitespace-nowrap shrink-0 ${activeTab === item.id
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
                className={`block w-full text-left py-2.5 px-3 rounded-xl text-base font-semibold ${item.isSpecial
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
                  if (onOpenQuiz) onOpenQuiz();
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full py-3 text-sm justify-center"
              >
                <Sparkles className="w-4 h-4 text-[#D6B477]" />
                <span>Take Nail Vibe Quiz ✨</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenSizing) onOpenSizing();
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
