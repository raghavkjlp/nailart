import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Gift,
  ArrowRight,
  ShieldCheck,
  RotateCw
} from "lucide-react";
import { submitSpinLead } from "../services/api.js";

// 8 Engaging Visual Segments on the Wheel
// Segment 0 is "Better Luck Next Time!" (The mandatory winning result)
const SEGMENTS = [
  {
    id: "better-luck",
    label: "Better Luck Next Time!",
    sub: "Try on next order",
    color: "#64263C",
    textColor: "#FFF9F5",
    icon: "💖"
  },
  {
    id: "off-500",
    label: "₹500 OFF",
    sub: "Orders above ₹1999",
    color: "#D6B477",
    textColor: "#242124",
    icon: "🎟️"
  },
  {
    id: "free-ring",
    label: "Free Gold Ring",
    sub: "With press-on nail set",
    color: "#F3B6CB",
    textColor: "#64263C",
    icon: "💍"
  },
  {
    id: "bogo",
    label: "Buy 1 Get 1 Free",
    sub: "On select earrings",
    color: "#4E1C2E",
    textColor: "#FFF9F5",
    icon: "✨"
  },
  {
    id: "mystery-gift",
    label: "Mystery Gift Box",
    sub: "Atelier surprise",
    color: "#E29578",
    textColor: "#242124",
    icon: "🎁"
  },
  {
    id: "free-shipping",
    label: "Free Express Delivery",
    sub: "Pan-India priority",
    color: "#832C4A",
    textColor: "#FFF9F5",
    icon: "🚚"
  },
  {
    id: "off-20",
    label: "20% OFF Jewellery",
    sub: "Instant discount",
    color: "#E6B87D",
    textColor: "#242124",
    icon: "🏷️"
  },
  {
    id: "nail-kit",
    label: "Free Prep Kit",
    sub: "Glue & jelly tabs",
    color: "#FCE7F0",
    textColor: "#64263C",
    icon: "💅🏻"
  }
];

export const SpinWheelModal = ({
  isOpen,
  onClose,
  onExploreShop,
  onExploreJewellery
}) => {
  // Step: 'form' | 'spinning' | 'result' (Modal cannot be closed until 'result' comes)
  const [step, setStep] = useState("form");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);

  // Form Status & Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Wheel Animation Rotation
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Prevent closing via Escape key unless result has arrived
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (step === "result") {
          handleClose();
        } else {
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  // Canvas ref for drawing the crisp high-DPI wheel
  const canvasRef = useRef(null);

  // Draw the wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = 380;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 12;
    const numSegments = SEGMENTS.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, size, size);

    // Draw Outer Gold Ring with Luxury Shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#D6B477";
    ctx.shadowColor = "rgba(100, 38, 60, 0.25)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Draw Wheel Segments
    SEGMENTS.forEach((segment, i) => {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      // Delicate Segment Border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render Label Text & Icon inside segment
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      // Text color
      ctx.fillStyle = segment.textColor;

      // Label
      ctx.font = "bold 11px 'Playfair Display', Georgia, serif";
      ctx.fillText(segment.label, radius - 26, -4);

      // Icon
      ctx.font = "14px sans-serif";
      ctx.fillText(segment.icon, radius - 6, -3);

      ctx.restore();
    });

    // Draw Decorative Inner Gold Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, 46, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFF9F5";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#D6B477";
    ctx.stroke();

    // Draw Center Brand Core
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    ctx.fillStyle = "#64263C";
    ctx.fill();

    // Center Monogram / Text
    ctx.fillStyle = "#D6B477";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAMES", centerX, centerY - 7);
    ctx.fillText("OF GLOSS", centerX, centerY + 6);
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    const cleanPhone = phoneNumber.trim().replace(/\D/g, "");
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      newErrors.phoneNumber = "Please enter a valid 10-digit mobile number";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com)";
    }

    if (!consent) {
      newErrors.consent = "Please agree to receive updates & offers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form Submission Handler:
   * 1. Validate inputs on frontend
   * 2. Save lead in backend / database
   * 3. If saving succeeds, initiate the wheel spin animation
   * 4. Land strictly on "Better Luck Next Time!"
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save lead to database BEFORE spinning
      const response = await submitSpinLead({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        consent
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to record contact information");
      }

      // Mark that user has spun in session
      try {
        sessionStorage.setItem("gog_spin_claimed", "true");
        sessionStorage.setItem("gog_spin_shown", "true");
      } catch {
        // Ignore storage errors
      }

      // Transition to spinning state
      setStep("spinning");
      setIsSpinning(true);

      /**
       * Wheel Physics Calculation:
       * The pointer needle is positioned at the TOP (270 degrees / -90 degrees).
       * Segment 0 is "Better Luck Next Time!" (from 0 to 45 deg, center at 22.5 deg).
       * To make Segment 0 land directly beneath the top pointer:
       * Pointer is at 270°.
       * Target center of segment 0 = 22.5°.
       * Required final rotation modulo 360 = (270 - 22.5) = 247.5 degrees!
       * Adding 6 full revolutions (6 * 360 = 2160) = 2407.5 degrees.
       * Plus a tiny random jitter within ±12° of the segment center for organic look,
       * but strictly staying inside Segment 0 (which spans 45°)!
       */
      const segmentAngle = 360 / SEGMENTS.length; // 45 deg
      const targetCenter = segmentAngle / 2; // 22.5 deg
      const stopTarget = (270 - targetCenter + 360) % 360;
      const fullRotations = 6 * 360; // 2160 degrees
      const jitter = (Math.random() - 0.5) * 16; // ±8 degrees, well inside the 45° segment
      const finalAngle = fullRotations + stopTarget + jitter;

      setRotationAngle(finalAngle);

      // Wait 4.6 seconds for the spin animation to conclude
      setTimeout(() => {
        setIsSpinning(false);
        setStep("result");
      }, 4600);
    } catch (err) {
      console.error("Spin lead registration failed:", err);
      setApiError(err.message || "Could not register your details. Please check your internet connection.");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Only allow closing if result has been revealed
    if (step !== "result") {
      return;
    }
    try {
      sessionStorage.setItem("gog_spin_completed", "true");
      sessionStorage.setItem("gog_spin_shown", "true");
    } catch {
      // Ignore
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => {
        if (step === "result") {
          handleClose();
        }
      }}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-[#FFF9F5] rounded-3xl sm:rounded-[32px] border border-pink-200/80 shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#64263C] via-[#D6B477] to-[#64263C]" />

        {/* Close Button - ONLY VISIBLE ONCE SPIN RESULT IS REVEALED */}
        {step === "result" && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-pink-100 text-[#64263C] border border-pink-200 transition-all shadow-md"
            aria-label="Close Spin Modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              <span>{step === "result" ? "Spin Completed" : "Welcome Gift • Spin to Enter"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#64263C] tracking-tight">
              Spin & Discover Your Luck! ✨
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5255] mt-1.5">
              {step === "result"
                ? "Here is your lucky draw result!"
                : "Enter your contact details below to spin the wheel and reveal your luck before entering."}
            </p>
          </div>

          {/* Main Interactive Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: The Spinning Wheel */}
            <div className="flex flex-col items-center justify-center relative select-none">
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
                {/* Pointer Indicator (Top needle with jewel glow) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                  <div className="w-5 h-5 rotate-45 bg-[#D6B477] border-2 border-white shadow-lg -mb-2.5 rounded-sm" />
                  <div className="w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[18px] border-t-[#64263C] filter drop-shadow-md" />
                </div>

                {/* Rotating Canvas Wrapper */}
                <div
                  className="w-full h-full rounded-full transition-transform"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transition: isSpinning
                      ? "transform 4.5s cubic-bezier(0.15, 0.75, 0.1, 0.99)"
                      : "none"
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Pulsing Ring Glow */}
                <div className="absolute inset-0 rounded-full border-2 border-[#D6B477]/40 pointer-events-none animate-pulse" />
              </div>

              {/* Status Hint */}
              {isSpinning && (
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#64263C] animate-bounce">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#D6B477]" />
                  <span>Spinning for your luck...</span>
                </div>
              )}
            </div>

            {/* Right: Flow Screens */}
            <div className="flex flex-col justify-center">
              {/* LEAD COLLECTION FORM (STEP 4 OF PROMPT) */}
              {(step === "form" || step === "spinning") && (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-pink-200/80 shadow-sm">
                  <div className="mb-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-[#64263C] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3 h-3 text-[#D6B477]" />
                      <span>Free Entry Spin Required</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#64263C]">
                      Where should we send your spin result?
                    </h3>
                    <p className="text-[11px] text-[#5A5255] mt-0.5">
                      Please enter your contact information to spin the lucky wheel and reveal your result.
                    </p>
                  </div>


                  {apiError && (
                    <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    {/* Full Name (Optional) */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#242124] mb-1">
                        Full Name <span className="text-[#8E8688] font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          disabled={isSubmitting || isSpinning}
                          placeholder="e.g. Ananya Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Phone Number (Required) */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#242124] mb-1">
                        Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          disabled={isSubmitting || isSpinning}
                          placeholder="10-digit mobile (e.g. 9876543210)"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (errors.phoneNumber) {
                              setErrors((prev) => ({ ...prev, phoneNumber: null }));
                            }
                          }}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white disabled:bg-gray-50 ${
                            errors.phoneNumber ? "border-rose-400 ring-1 ring-rose-300" : "border-pink-200"
                          }`}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-[10px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phoneNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address (Required) */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#242124] mb-1">
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          disabled={isSubmitting || isSpinning}
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors((prev) => ({ ...prev, email: null }));
                            }
                          }}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#64263C]/30 text-[#242124] bg-white disabled:bg-gray-50 ${
                            errors.email ? "border-rose-400 ring-1 ring-rose-300" : "border-pink-200"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Privacy & Consent Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={consent}
                          disabled={isSubmitting || isSpinning}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="mt-0.5 rounded border-pink-300 text-[#64263C] focus:ring-[#64263C]"
                        />
                        <span className="text-[10px] text-[#5A5255] leading-tight">
                          I consent to store my details and receive exclusive product updates, jewellery launches & promotions.
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-[10px] text-rose-600 mt-1 font-medium">
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    {/* Privacy Notice Badge */}
                    <div className="flex items-center gap-1.5 text-[10px] text-[#8E8688] pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Your information is strictly protected & never shared.</span>
                    </div>

                    {/* Submit & Spin Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isSpinning}
                      className="w-full mt-2 py-3 px-5 rounded-full bg-[#64263C] hover:bg-[#4E1C2E] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isSpinning ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin text-[#D6B477]" />
                          <span>Spinning the Wheel...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#D6B477]" />
                          <span>Submit & Spin Now!</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* SCREEN 3: RESULT STATE (STRICTLY "Better Luck Next Time!") */}
              {step === "result" && (
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-pink-200/80 shadow-md text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-pink-100 text-[#64263C] flex items-center justify-center mx-auto shadow-inner border border-pink-200">
                    <Sparkles className="w-8 h-8 text-[#D6B477]" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6B477] block mb-1">
                      Spin Result
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#64263C]">
                      Better Luck Next Time!
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A5255] mt-2 leading-relaxed">
                      Thank you for spinning! Although luck wasn't on this spin, your true charm awaits in our handcrafted press-on nails and dazzling fine jewellery collection.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        if (onExploreShop) onExploreShop();
                      }}
                      className="w-full py-3.5 px-6 rounded-full bg-[#64263C] hover:bg-[#4E1C2E] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#D6B477]" />
                      <span>Continue Shopping</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        if (onExploreJewellery) onExploreJewellery();
                      }}
                      className="w-full py-2.5 px-4 rounded-full bg-pink-50 hover:bg-pink-100 text-[#64263C] text-xs font-bold border border-pink-200 transition-all"
                    >
                      <span>Explore Fine Jewellery 💍</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheelModal;
