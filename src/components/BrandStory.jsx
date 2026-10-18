import React from "react";
import { Sparkles, Heart, Shield, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const BrandStory = ({ onOpenCustomOrder, onOpenQuiz }) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-pink-100 overflow-hidden">
      <div className="container-custom">
        {/* Brand Story Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          {/* Atelier Photography */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#FFF9F5] aspect-square bg-pink-100">
                <img
                  src="/images/custom_nail.jpg"
                  alt="Games of Gloss Senior Nail Artist Handcrafting Press-On Nails"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 glass-panel p-4 rounded-2xl shadow-xl max-w-xs border border-pink-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-[#64263C]">Handcrafted in India</span>
                </div>
                <p className="text-[11px] text-[#5A5255] leading-relaxed">
                  Every tip is sculpted with salon-grade multi-layer gel resin for unyielding strength.
                </p>
              </div>
            </div>
          </div>

          {/* Story Copy */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              Our Philosophy
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] leading-tight">
              A Little Gloss.<br />
              <span className="italic font-normal">A Lot of Personality.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#5A5255] font-light leading-relaxed">
              We started <strong>Games of Gloss</strong> with a simple belief: you shouldn't have to choose between salon-quality nails and your time, wallet, or natural nail health. Traditional gel appointments take 2 hours, cost a fortune, and weaken your natural nail beds under harsh UV lamps.
            </p>

            <p className="text-sm sm:text-base text-[#5A5255] font-light leading-relaxed">
              Our handcrafted press-on sets give you the freedom to match your nails to your mood, outfit, or weekend trip in just 10 minutes. Whether you are in your <em>Clean Girl Era</em> for morning meetings or switching to razor-sharp <em>Baddie Chrome</em> for Friday night, Games of Gloss is your personal on-demand beauty atelier.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100">
                <Clock className="w-5 h-5 text-[#D6B477] mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#64263C]">10-Minute Fit</h4>
                <p className="text-[11px] text-[#5A5255]">Salon glamour without the 2-hour chair time.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100">
                <RefreshCw className="w-5 h-5 text-[#D6B477] mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#64263C]">Reusable 5x</h4>
                <p className="text-[11px] text-[#5A5255]">Wear for a weekend or weeks. Store & re-wear.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-pink-100 col-span-2 sm:col-span-1">
                <Shield className="w-5 h-5 text-[#D6B477] mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#64263C]">Zero Damage</h4>
                <p className="text-[11px] text-[#5A5255]">No aggressive electric drills or thinning nails.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Glam Process */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-pink-50 via-[#FFF9F5] to-pink-50 border border-pink-200 text-center">
          <div className="max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B477] block mb-1">
              Easy At-Home Routine
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#64263C]">
              How It Works: 3 Steps to Flawless Nails
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm relative">
              <span className="text-3xl font-serif font-extrabold text-[#D6B477] block mb-2">01</span>
              <h4 className="font-serif font-bold text-base text-[#64263C] mb-1">Prep & Buff 💅🏻</h4>
              <p className="text-xs text-[#5A5255] leading-relaxed">
                Gently push back cuticles using the wooden stick. Lightly buff the surface with the mini buffer and wipe clean with the alcohol pad to remove natural oils.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm relative">
              <span className="text-3xl font-serif font-extrabold text-[#D6B477] block mb-2">02</span>
              <h4 className="font-serif font-bold text-base text-[#64263C]">Size & Glue / Tab 🪄</h4>
              <p className="text-xs text-[#5A5255] leading-relaxed">
                Choose the best nail size for each finger. Apply a drop of liquid glue for 2–3 weeks of wear, or use the jelly adhesive tabs for 3–5 days of reusable glam.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm relative">
              <span className="text-3xl font-serif font-extrabold text-[#D6B477] block mb-2">03</span>
              <h4 className="font-serif font-bold text-base text-[#64263C]">Press & Slay ✨</h4>
              <p className="text-xs text-[#5A5255] leading-relaxed">
                Align the press-on at a 45-degree angle starting from your cuticle bed. Press firmly for 20 seconds. Admire your salon-worthy manicure!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
