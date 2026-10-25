import React, { useState } from "react";
import { Sparkles, Heart, Shield, CheckCircle, ChevronDown, ShoppingBag, ArrowRight, Star, Gem, Smile } from "lucide-react";
import { BRAND_CONFIG } from "../config/brandConfig.js";

export const AboutSection = ({ setActiveTab, onOpenQuiz, onOpenCustomOrder }) => {
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
      a: (
        <div className="space-y-2.5">
          <p>
            Every Games of Gloss set arrives in a beautiful keepsake box, thoughtfully packed with everything you need for your perfect nail transformation.
          </p>
          <div>
            <p className="font-semibold text-[#64263C] mb-1.5">Each package includes:</p>
            <ul className="space-y-1 pl-1">
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>10 handcrafted press-on nails</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>Professional nail glue</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>Double-sided adhesive glue tabs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>1 nail buffer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>1 nail filer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>1 cuticle pusher</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D6B477] font-bold">•</span>
                <span>Alcohol prep pad(s)</span>
              </li>
            </ul>
          </div>
          <p className="pt-1">
            Everything you need to achieve a gorgeous, salon-inspired manicure from the comfort of your home. 💅
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#FFF9F5]">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-4 border border-pink-200/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            About Games of Gloss
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#64263C] leading-tight mb-4">
            A Little Gloss.<br />
            <span className="italic font-normal bg-gradient-to-r from-[#64263C] via-[#D6B477] to-[#64263C] bg-clip-text text-transparent">
              A Lot of Glam.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#5A5255] font-light leading-relaxed max-w-2xl mx-auto">
            Welcome to <strong className="font-semibold text-[#64263C]">Games of Gloss</strong> — your destination for handcrafted press-on nails, statement jewellery and little luxuries. Thoughtfully curated to celebrate your individuality, elevate your everyday style and add a touch of glamour to every moment.
          </p>
        </div>

        {/* Editorial Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 sm:mb-24">
          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-pink-100 relative group">
                <img
                  src="/images/bridal_nail.jpg"
                  alt="Games of Gloss Handcrafted Press-On Nails and Accessories"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Badges anchored safely at top inside photo */}
                <div className="absolute top-4 left-4 glass-panel py-1.5 px-3.5 rounded-full shadow-md border border-white/60 flex items-center gap-1.5 z-10">
                  <span className="text-xs">✨</span>
                  <span className="text-[11px] font-bold text-[#64263C]">Nails &amp; Accessories</span>
                </div>

                <div className="absolute top-4 right-4 glass-panel py-1.5 px-3.5 rounded-full shadow-md border border-white/60 flex items-center gap-1.5 z-10">
                  <Heart className="w-3 h-3 fill-[#F3B6CB] text-[#64263C]" />
                  <span className="text-[11px] font-bold text-[#64263C]">Curated with Love</span>
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6B477] block mb-1">
                    Everyday Glamour
                  </span>
                  <p className="font-serif text-lg sm:text-xl font-bold leading-snug">
                    Designed to make every look feel special.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Story (7 cols) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-[#D6B477]">
                Our Passion &amp; Purpose
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#64263C] leading-snug">
                Born from a love for beauty &amp; self-expression.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5A5255] leading-relaxed font-light">
              Born from a love for beauty and self-expression, <strong>Games of Gloss</strong> brings together thoughtfully curated nail essentials, stunning press-on nails and chic accessories designed to make every look feel special.
            </p>

            {/* Editorial Highlight Quote Box */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-white border-l-4 border-[#64263C] shadow-sm">
              <span className="text-3xl sm:text-4xl font-serif text-[#D6B477] absolute top-2 right-4 select-none opacity-40">
                “
              </span>
              <p className="font-serif italic text-sm sm:text-base text-[#64263C] leading-relaxed">
                We believe beauty lies in the little details — a perfectly styled set of nails, an accessory that completes your outfit, or a little something that makes you feel confident and beautiful.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#5A5255] leading-relaxed font-light">
              Our collection is created for the girl who loves to express herself, experiment with her style and add a touch of glamour to her everyday life.
            </p>

            <p className="text-sm sm:text-base text-[#5A5255] leading-relaxed font-light">
              From statement nails to everyday accessories, every piece is chosen to help you celebrate your individuality without compromising on style or affordability.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenQuiz}
                className="btn-primary text-xs py-3 px-6 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Find Your Vibe Quiz</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              </button>
              
              {setActiveTab && (
                <button
                  onClick={() => {
                    setActiveTab("shop");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn-secondary text-xs py-3 px-6 flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop Collections</span>
                </button>
              )}

              <button
                onClick={onOpenCustomOrder}
                className="text-xs py-3 px-5 rounded-full border border-pink-200 text-[#64263C] hover:bg-pink-100/60 font-semibold transition-all"
              >
                Custom Nail Order 🎨
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Values / Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D6B477] block mb-1">
              What Drives Us
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#64263C]">
              The Games of Gloss Promise
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mb-6 font-bold text-2xl shadow-sm border border-pink-200/60">
                  💅🏻
                </div>
                <h4 className="font-serif font-bold text-xl text-[#64263C] mb-3">
                  The Little Details
                </h4>
                <p className="text-sm text-[#5A5255] leading-relaxed font-light">
                  A perfectly styled set of nails and chic accessories curated to complete your outfit and make you feel confident every single time.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-pink-100 flex items-center gap-1.5 text-xs font-semibold text-[#D6B477]">
                <span>Thoughtfully curated</span>
                <span className="text-sm">✨</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mb-6 font-bold text-2xl shadow-sm border border-pink-200/60">
                  ✨
                </div>
                <h4 className="font-serif font-bold text-xl text-[#64263C] mb-3">
                  Style &amp; Affordability
                </h4>
                <p className="text-sm text-[#5A5255] leading-relaxed font-light">
                  From statement nails to everyday essentials, every piece is chosen to celebrate your individuality without compromising on quality or budget.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-pink-100 flex items-center gap-1.5 text-xs font-semibold text-[#D6B477]">
                <span>Affordable glamour</span>
                <span className="text-sm">💎</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#64263C] flex items-center justify-center mb-6 font-bold text-2xl shadow-sm border border-pink-200/60">
                  💖
                </div>
                <h4 className="font-serif font-bold text-xl text-[#64263C] mb-3">
                  Fun, Personal &amp; Accessible
                </h4>
                <p className="text-sm text-[#5A5255] leading-relaxed font-light">
                  We believe that feeling beautiful should be fun, personal and accessible — empowering you to experiment and express your style effortlessly.
                </p>
              </div>
              <div className="pt-5 mt-6 border-t border-pink-100 flex items-center gap-1.5 text-xs font-semibold text-[#D6B477]">
                <span>Effortless self-expression</span>
                <span className="text-sm">💌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Love Note / Manifesto Banner */}
        <div className="mb-20">
          <div className="rounded-3xl bg-gradient-to-r from-pink-100/90 via-[#FFF9F5] to-pink-100/90 border border-pink-200 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-md relative overflow-hidden">
            <div className="absolute top-4 left-6 text-2xl select-none opacity-40">✨</div>
            <div className="absolute bottom-4 right-6 text-2xl select-none opacity-40">💖</div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#64263C] text-[10px] font-bold uppercase tracking-wider mb-4 border border-pink-200 shadow-sm">
              <Heart className="w-3 h-3 text-[#64263C] fill-[#F3B6CB]" />
              Our Core Philosophy
            </div>

            <blockquote className="font-serif text-xl sm:text-3xl text-[#64263C] font-semibold leading-relaxed mb-6 max-w-2xl mx-auto">
              “At Games of Gloss, we believe that feeling beautiful should be fun, personal and accessible.<br />
              <span className="italic font-normal text-[#D6B477] block mt-2 text-lg sm:text-2xl">
                Because you deserve to feel like your most glamorous self — every single day.”
              </span>
            </blockquote>

            <div className="pt-2 border-t border-pink-200/60 max-w-xs mx-auto">
              <p className="text-sm font-serif font-bold text-[#64263C]">
                With love,
              </p>
              <p className="text-sm font-semibold text-[#D6B477] tracking-wider uppercase mt-0.5">
                Team Games of Gloss 💌
              </p>
            </div>
          </div>
        </div>

        {/* Quality Values Badges */}
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
