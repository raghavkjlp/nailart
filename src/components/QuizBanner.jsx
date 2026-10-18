import React from "react";
import { Sparkles, ArrowRight, Heart } from "lucide-react";

export const QuizBanner = ({ onOpenQuiz }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FFF9F5]">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#F8DCE5] via-[#F3B6CB] to-[#F8DCE5] p-8 sm:p-14 text-center border-2 border-white shadow-xl">
          {/* Floating Sparkles & Emojis */}
          <div className="absolute top-6 left-8 text-2xl select-none animate-sparkle">✨</div>
          <div className="absolute bottom-6 left-16 text-xl select-none animate-sparkle" style={{ animationDelay: "1.5s" }}>💖</div>
          <div className="absolute top-8 right-12 text-2xl select-none animate-sparkle" style={{ animationDelay: "0.8s" }}>🎀</div>
          <div className="absolute bottom-6 right-20 text-xl select-none animate-sparkle" style={{ animationDelay: "2.2s" }}>💅🏻</div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#64263C] text-[11px] font-bold uppercase tracking-widest border border-pink-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              Interactive Stylist Experience
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] leading-tight">
              Not Sure Which Nails Are So You?
            </h2>

            <p className="text-sm sm:text-base text-[#5A5255] max-w-lg mx-auto font-light leading-relaxed">
              Answer a few fun questions and let our intelligent recommendation engine reveal your signature nail archetype and top three perfect matches.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenQuiz}
                className="btn-primary px-9 py-4 text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Take the Nail Vibe Quiz</span>
                <Sparkles className="w-4 h-4 text-[#D6B477] group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="text-[11px] text-[#64263C] font-semibold pt-1">
              Takes only 60 seconds • Direct WhatsApp stylist recommendations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
