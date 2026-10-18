import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { FEATURED_COLLECTIONS } from "../data/products.js";

export const FeaturedCollections = ({ onSelectCollection, onOpenCustomOrder }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FFF9F5] border-t border-pink-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            Aesthetic Universes
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] mb-3">
            Featured Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5255] font-light leading-relaxed">
            From coquette bows and glazed donut chrome to razor-sharp baddie stilettos.
            Choose the world that matches your current vibe.
          </p>
        </div>

        {/* Collection Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_COLLECTIONS.map((coll) => (
            <div
              key={coll.id}
              onClick={() => {
                if (coll.id === "custom") {
                  onOpenCustomOrder && onOpenCustomOrder();
                } else {
                  onSelectCollection && onSelectCollection(coll.filterTag);
                }
              }}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-pink-200/80 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative w-full overflow-hidden bg-pink-50" style={{ height: "260px" }}>
                <img
                  src={coll.image}
                  alt={coll.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text overlay over image */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#D6B477] block mb-1">
                    {coll.tagline}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    {coll.title}
                  </h3>
                </div>
              </div>

              {/* Card Body & CTA Link */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#5A5255] leading-relaxed mb-4">
                  {coll.description}
                </p>

                <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64263C] group-hover:text-[#4E1C2E] flex items-center gap-1.5">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D6B477] group-hover:translate-x-1.5 transition-transform" />
                  </span>

                  <span className="text-[11px] font-medium text-[#5A5255] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                    Handmade
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
