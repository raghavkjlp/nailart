import React from "react";
import { Sparkles, Gift } from "lucide-react";

export const SpinLauncherBadge = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#64263C] via-[#832C4A] to-[#64263C] text-white shadow-xl hover:shadow-2xl border border-pink-300 hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce-gentle select-none"
      aria-label="Spin & Win Lucky Draw"
    >
      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-[#D6B477] animate-sparkle" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-bold tracking-wide text-white flex items-center gap-1">
          Spin & Win 🎡
        </span>
        <span className="text-[9px] text-[#D6B477] font-medium leading-none">
          Exclusive Perks
        </span>
      </div>
    </button>
  );
};

export default SpinLauncherBadge;
