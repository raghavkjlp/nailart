import React, { useState } from "react";
import { Sparkles, Heart, Shield, CheckCircle, HelpCircle, ChevronDown } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const AboutSection = ({ onOpenQuiz, onOpenCustomOrder }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How long do Games of Gloss press-ons last?",
      a: "With our salon liquid glue, your set will stay securely locked for 2 to 3 weeks (perfect for long vacations or events). With our jelly adhesive tabs, they last 3 to 5 days, making them ideal for weekends or photo shoots—plus, using tabs allows you to reuse the nails up to 5 times!"
    },
    {
      q: "Will press-on nails damage my natural nail beds?",
      a: "No! Unlike acrylics or electric drill removals at salons that thin your natural keratin, Games of Gloss nails are removed gently with warm water, soap, and cuticle oil. Your natural nails remain 100% healthy, strong, and intact."
    },
    {
      q: "Are the nails reusable?",
      a: "Yes! When applied with adhesive tabs, they peel off cleanly and can be worn up to 5 times. When applied with glue, any glue buildup can be gently buffed away using the included buffer, allowing multiple re-applications."
    },
    {
      q: "What if none of the standard sizes (XS, S, M, L) fit me?",
      a: "We offer completely custom millimeter sizing at no extra charge! Simply measure your nail beds using our Sizing Guide and send your 5 measurements via WhatsApp when placing your order."
    },
    {
      q: "What comes in each Games of Gloss package?",
      a: "Every single set arrives in a luxury keepsake box containing: 10 handcrafted press-on nails, 1 tube of professional salon liquid glue (2g), 24 double-sided jelly adhesive tabs, 1 dual-sided wooden cuticle stick, 1 mini nail buffer, and 2 alcohol prep pads."
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#FFF9F5]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            Behind The Gloss
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] mb-4">
            About Games of Gloss
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5255] font-light leading-relaxed">
            Redefining luxury nail artistry for modern women who demand beauty on their own terms.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-pink-100">
            <img
              src="/images/bridal_nail.jpg"
              alt="Games of Gloss Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#64263C] leading-snug">
              Born from a Love of Art & a Hatred of Salon Damage
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed">
              Games of Gloss began in a sunlit home studio in New Delhi with a mission to make salon-sculpted, Pinterest-worthy nail art accessible without hours trapped in a salon chair or spending thousands on sets that ruin your natural nails.
            </p>
            <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed">
              Every single nail in our collection is treated like a miniature canvas. Handcrafted with multiple layers of salon-grade gel resin, diamond chrome powders, 3D porcelain florals, and hand-placed crystals, our sets look indistinguishable from bespoke high-fashion manicures.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenQuiz}
                className="btn-primary text-xs py-3 px-6"
              >
                Find Your Vibe Quiz ✨
              </button>
              <button
                onClick={onOpenCustomOrder}
                className="btn-secondary text-xs py-3 px-6"
              >
                Commission Custom Set 🎨
              </button>
            </div>
          </div>
        </div>

        {/* Quality Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-3xl bg-white border border-pink-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              💅🏻
            </div>
            <h3 className="font-serif font-bold text-base text-[#64263C] mb-2">Triple-Cured Resin</h3>
            <p className="text-xs text-[#5A5255] leading-relaxed">
              We never use cheap brittle plastic. Our nails are molded from high-impact soft gel that flexes to fit your natural curve and won't crack.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-pink-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              🌿
            </div>
            <h3 className="font-serif font-bold text-base text-[#64263C] mb-2">Cruelty-Free & Non-Toxic</h3>
            <p className="text-xs text-[#5A5255] leading-relaxed">
              All our gel polishes and adhesives are 10-Free, vegan, and formulated without formaldehyde or harsh chemical fumes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-pink-200/80 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              💌
            </div>
            <h3 className="font-serif font-bold text-base text-[#64263C] mb-2">Sizing Guarantee</h3>
            <p className="text-xs text-[#5A5255] leading-relaxed">
              Not sure about fit? Our WhatsApp concierge guides you every step of the way, offering custom measurements for a 100% tailor-made fit.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C] mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#5A5255]">
              Everything you need to know about wear time, sizing, and care.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-pink-200 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-semibold text-sm sm:text-base text-[#64263C] hover:bg-pink-50/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D6B477] transition-transform duration-300 shrink-0 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#5A5255] leading-relaxed border-t border-pink-100/60 pt-3 bg-pink-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
