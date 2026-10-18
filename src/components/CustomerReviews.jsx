import React from "react";
import { Star, CheckCircle, Sparkles, Heart } from "lucide-react";

export const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Aanya Sharma",
      city: "Mumbai",
      set: "Blush Crush Almond",
      rating: 5,
      review: "I wore these for my engagement and literally every aunt and cousin thought I went to an expensive salon in Bandra! They didn't budge the entire weekend. Absolutely obsessed! 💖",
      image: "/images/blushcrush_nail.jpg"
    },
    {
      id: 2,
      name: "Rhea Kapoor",
      city: "Delhi",
      set: "Glazed Goddess Medium",
      rating: 5,
      review: "The glazed donut chrome is unreal in person. It catches sunlight in the prettiest way. Plus, taking them off with warm water and oil was so easy with ZERO damage to my real nails.",
      image: "/images/hero_nail.jpg"
    },
    {
      id: 3,
      name: "Zoya Malik",
      city: "Bangalore",
      set: "Midnight Muse Stiletto",
      rating: 5,
      review: "The 3D molten silver cyber thorns on black ombré are art pieces! The quality is thick, structured, and does not bend at all. Ordered another set for Halloween already 🖤",
      image: "/images/baddie_nail.jpg"
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF9F5] border-t border-pink-100">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-[#D6B477] fill-current" />
            Love Letters From Nail Babes
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] mb-3">
            Real Nails. Real Obsessions.
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5255] font-light">
            Over 5,000+ happy hands across India flaunting Games of Gloss press-ons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-pink-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Thumbnail & Set Name */}
                <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-pink-100">
                  <img
                    src={rev.image}
                    alt={rev.set}
                    style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" }}
                    className="rounded-xl object-cover border border-pink-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B477] block">
                      Verified Order
                    </span>
                    <span className="font-serif font-bold text-sm text-[#64263C]">
                      {rev.set}
                    </span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 text-[#D6B477] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#5A5255] leading-relaxed italic mb-6">
                  "{rev.review}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between text-xs pt-3 border-t border-pink-100">
                <span className="font-bold text-[#242124]">{rev.name}</span>
                <span className="text-[#5A5255] flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rev.city}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
