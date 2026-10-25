import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, CheckCircle } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const HeroSection = ({ onOpenQuiz, onExploreShop }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8DCE5]/70 via-[#FFF9F5] to-[#FFF9F5] pt-8 pb-16 sm:pt-14 sm:pb-24">
      {/* Subtle Floating Sparkle Accents */}
      <div className="absolute top-12 left-10 text-3xl select-none animate-sparkle">✨</div>
      <div className="absolute top-36 right-12 text-2xl select-none animate-sparkle" style={{ animationDelay: "1s" }}>💖</div>
      <div className="absolute bottom-16 left-1/4 text-2xl select-none animate-sparkle" style={{ animationDelay: "2s" }}>🎀</div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D6B477]/15 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-[#64263C] text-xs font-bold uppercase tracking-widest border border-pink-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>Welcome to Games of Gloss</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif text-[#64263C] leading-[1.08] tracking-tight">
              A Little Gloss.<br />
              <span className="italic font-normal text-[#64263C]">A Lot of</span><br />
              <span className="bg-gradient-to-r from-[#64263C] via-[#D6B477] to-[#64263C] bg-clip-text text-transparent">
                Glam.
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-[#5A5255] max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Your destination for handcrafted press-on nails, statement jewellery and little luxuries. Thoughtfully curated to celebrate your individuality, elevate your everyday style and add a touch of glamour to every moment.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenQuiz}
                className="btn-primary w-full sm:w-auto px-8 py-4 text-base font-bold shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
              >
                <span>Find My Nail Vibe</span>
                <Sparkles className="w-4 h-4 text-[#D6B477] group-hover:rotate-12 transition-transform" />
              </button>

              <button
                onClick={onExploreShop}
                className="btn-secondary w-full sm:w-auto px-8 py-4 text-base font-bold flex items-center justify-center gap-2 hover:border-[#64263C]"
              >
                <span>Shop Nails</span>
                <ArrowRight className="w-4 h-4 text-[#64263C]" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-pink-200/70 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D6B477] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#242124]">Reusable 5x</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D6B477] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#242124]">10-Min Application</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D6B477] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#242124]">Prep Kit Included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High Fashion Nail Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Rounded Editorial Frame */}
              <div className="relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-pink-100">
                <img
                  src="/images/hero_nail.jpg"
                  alt="Games of Gloss signature glazed almond press-on nails"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B477] block">
                    Featured Signature Set
                  </span>
                  <div className="font-serif font-bold text-xl sm:text-2xl drop-shadow-sm">
                    Glazed Goddess Almond
                  </div>
                </div>
              </div>

              {/* Floating Customer Testimonial Pill */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-panel p-4 rounded-2xl shadow-xl max-w-xs border border-white/80 animate-bounce-slight hidden sm:block">
                <div className="flex items-center gap-1 text-[#D6B477] text-xs mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#242124] italic font-medium leading-snug">
                  "Got these for my bestie’s wedding and everyone thought I spent ₹4,000 at a salon! 🤍"
                </p>
                <div className="text-[10px] text-[#64263C] font-bold mt-1">
                  — Tanya M. • Verified Purchase
                </div>
              </div>

              {/* Floating Sparkle Badge Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 glass-panel py-2 px-4 rounded-full shadow-lg border border-white/80 flex items-center gap-2">
                <span className="text-sm">💅🏻</span>
                <span className="text-xs font-bold text-[#64263C]">100% Handcrafted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
