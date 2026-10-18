import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Heart,
  ExternalLink,
  MessageCircle,
  Eye,
  Sliders,
  AlertCircle
} from "lucide-react";
import { QUIZ_QUESTIONS } from "../data/quizQuestions.js";
import { calculateRecommendations } from "../utils/recommendationEngine.js";
import { createQuizResultsOrderUrl, createProductOrderUrl } from "../utils/whatsapp.js";
import { NailShapeIcon } from "./NailShapeIcon.jsx";

export const NailVibeQuiz = ({ onSelectProduct, onExploreShop, onClose }) => {
  // State: 'welcome' | 'quiz' | 'results'
  const [screen, setScreen] = useState("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    aesthetic: "",
    length: "",
    shape: "",
    colors: [],
    occasion: "",
    budget: "",
    personality: ""
  });
  const [results, setResults] = useState(null);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Handle single selection
  const handleSingleSelect = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle multi-select for colors
  const handleColorToggle = (colorId) => {
    setAnswers((prev) => {
      const current = prev.colors || [];
      if (current.includes(colorId)) {
        return { ...prev, colors: current.filter((c) => c !== colorId) };
      } else {
        return { ...prev, colors: [...current, colorId] };
      }
    });
  };

  // Check if current question is answered
  const isCurrentAnswered = () => {
    if (!currentQ) return false;
    if (currentQ.isMultiSelect) {
      return Array.isArray(answers[currentQ.key]) && answers[currentQ.key].length > 0;
    }
    return Boolean(answers[currentQ.key]);
  };

  // Next / Submit Question
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate results and trigger confetti
      const calculated = calculateRecommendations(answers);
      setResults(calculated);
      setScreen("results");

      // Celebrate with luxury gold & pink confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F3B6CB", "#D6B477", "#64263C", "#FFF9F5", "#F8DCE5"]
        });
      } catch (err) {
        console.error("Confetti trigger skipped:", err);
      }
    }
  };

  // Previous Question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setScreen("welcome");
    }
  };

  // Retake Quiz
  const handleRetake = () => {
    setAnswers({
      aesthetic: "",
      length: "",
      shape: "",
      colors: [],
      occasion: "",
      budget: "",
      personality: ""
    });
    setCurrentQuestionIndex(0);
    setResults(null);
    setScreen("welcome");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 sm:px-6">
      {/* 1. WELCOME SCREEN */}
      {screen === "welcome" && (
        <div className="glass-panel p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-pink-200/50">
          {/* Decorative floating sparkles */}
          <div className="absolute top-6 left-8 text-2xl animate-sparkle select-none">✨</div>
          <div className="absolute bottom-6 right-8 text-2xl animate-sparkle select-none" style={{ animationDelay: "1.2s" }}>
            💖
          </div>
          <div className="absolute top-10 right-14 text-xl animate-sparkle select-none" style={{ animationDelay: "2s" }}>
            🎀
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 text-[#64263C] text-xs font-bold uppercase tracking-widest mb-6 border border-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            Signature Beauty Consultation
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#64263C] mb-4 leading-tight">
            Let's Find Your Nail Vibe <span className="font-normal">💅🏻</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5A5255] max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Your nails should match your energy. Tell us a little about yourself and we'll reveal the curated sets you'll fall head-over-heels in love with.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-10 text-left">
            <div className="p-3.5 bg-white/70 rounded-2xl border border-pink-100">
              <span className="text-xl mb-1 block">🎀</span>
              <div className="font-semibold text-xs text-[#242124]">Personalized</div>
              <div className="text-[11px] text-[#5A5255]">Tailored to your aesthetic</div>
            </div>
            <div className="p-3.5 bg-white/70 rounded-2xl border border-pink-100">
              <span className="text-xl mb-1 block">✨</span>
              <div className="font-semibold text-xs text-[#242124]">7 Fun Questions</div>
              <div className="text-[11px] text-[#5A5255]">Takes under 60 seconds</div>
            </div>
            <div className="p-3.5 bg-white/70 rounded-2xl border border-pink-100">
              <span className="text-xl mb-1 block">💌</span>
              <div className="font-semibold text-xs text-[#242124]">Direct WhatsApp</div>
              <div className="text-[11px] text-[#5A5255]">Instant stylist order link</div>
            </div>
            <div className="p-3.5 bg-white/70 rounded-2xl border border-pink-100">
              <span className="text-xl mb-1 block">💎</span>
              <div className="font-semibold text-xs text-[#242124]">Zero Guesswork</div>
              <div className="text-[11px] text-[#5A5255]">Shape, length & budget match</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setScreen("quiz")}
              className="btn-primary w-full sm:w-auto px-10 py-4 text-base font-semibold shadow-lg group"
            >
              <span>Let's Play</span>
              <Sparkles className="w-4 h-4 text-[#D6B477] group-hover:rotate-12 transition-transform" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-wider text-[#5A5255] hover:text-[#64263C] underline py-2"
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. QUIZ QUESTIONS SCREEN */}
      {screen === "quiz" && currentQ && (
        <div className="glass-panel p-6 sm:p-10 border border-pink-200/60 shadow-xl transition-all duration-300">
          {/* Top Bar: Progress and Back button */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-100">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5255] hover:text-[#64263C] transition-colors py-1 px-2.5 rounded-lg hover:bg-pink-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#64263C]">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            <div className="text-xs text-[#5A5255] font-medium">
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-pink-100/60 h-2 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-[#F3B6CB] via-[#D6B477] to-[#64263C] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Title & Prompt */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-serif text-[#64263C] mb-2">
              {currentQ.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A5255] max-w-lg mx-auto">
              {currentQ.subtitle}
            </p>
            {currentQ.isMultiSelect && (
              <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-[#64263C] text-[11px] font-bold rounded-full">
                ✨ Select all colors that match your vibe
              </span>
            )}
          </div>

          {/* Question Options Renderers */}
          <div className="mb-10">
            {/* A. Aesthetic Cards (Question 1) */}
            {currentQ.key === "aesthetic" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentQ.options.map((option) => {
                  const isSelected = answers.aesthetic === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("aesthetic", option.id)}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 relative group flex flex-col ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-xl scale-[1.02]"
                          : "border-pink-100/80 bg-white/70 hover:border-pink-300 hover:shadow-md"
                      }`}
                    >
                      <div className="h-36 overflow-hidden relative">
                        <img
                          src={option.image}
                          alt={option.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 text-[#64263C] text-[10px] font-bold shadow">
                          {option.badge}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-serif font-bold text-base text-[#64263C] mb-1 flex items-center justify-between">
                            <span>{option.title}</span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#64263C] text-white flex items-center justify-center text-xs">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5A5255] leading-relaxed">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* B. Length Options (Question 2) */}
            {currentQ.key === "length" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = answers.length === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("length", option.id)}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-lg ring-2 ring-pink-200"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          isSelected ? "bg-[#64263C] text-[#FFF9F5]" : "bg-pink-100/70 text-[#64263C]"
                        }`}
                      >
                        {option.id === "Short" && "💅"}
                        {option.id === "Medium" && "✨"}
                        {option.id === "Long" && "👑"}
                        {option.id === "Extra Long" && "⚡"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-bold text-base text-[#242124]">{option.title}</span>
                          <span className="text-[11px] font-bold text-[#D6B477] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {option.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A5255] leading-relaxed">{option.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#64263C] text-white flex items-center justify-center text-xs shrink-0 self-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* C. Shape Options with custom visual silhouettes (Question 3) */}
            {currentQ.key === "shape" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {currentQ.options.map((option) => {
                  const isSelected = answers.shape === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("shape", option.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center justify-between ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-xl scale-[1.03]"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      <div className="w-16 h-20 mb-3 flex items-center justify-center bg-pink-50/70 rounded-xl p-2 border border-pink-100">
                        <NailShapeIcon
                          shape={option.shapeIcon}
                          className="w-8 h-14"
                          color={isSelected ? "#64263C" : "#F3B6CB"}
                        />
                      </div>
                      <div className="font-serif font-bold text-sm text-[#64263C] mb-1">{option.title}</div>
                      <p className="text-[11px] text-[#5A5255] leading-snug line-clamp-2">{option.desc}</p>
                      {isSelected && (
                        <span className="mt-2 text-[10px] uppercase font-bold text-white bg-[#64263C] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* D. Color Palette Options (Question 4 - Multi-select) */}
            {currentQ.key === "colors" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = Array.isArray(answers.colors) && answers.colors.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleColorToggle(option.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3.5 ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-md ring-2 ring-pink-200"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      {/* Color Swatch Circles */}
                      <div className="flex items-center -space-x-2 shrink-0">
                        {option.swatch.map((hex, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>

                      <div className="flex-1">
                        <div className="font-serif font-semibold text-sm text-[#242124]">{option.title}</div>
                        <div className="text-[11px] text-[#5A5255]">{option.desc}</div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#64263C] text-white" : "border border-pink-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* E. Occasion Options (Question 5) */}
            {currentQ.key === "occasion" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = answers.occasion === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("occasion", option.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-lg ring-2 ring-pink-200"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-serif font-bold text-base text-[#64263C] mb-0.5">{option.title}</div>
                        <p className="text-xs text-[#5A5255]">{option.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#64263C] text-white flex items-center justify-center text-xs shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* F. Budget Options (Question 6) */}
            {currentQ.key === "budget" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = answers.budget === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("budget", option.id)}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-lg ring-2 ring-pink-200"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      <div>
                        <div className="font-serif font-bold text-lg text-[#64263C] mb-1">{option.title}</div>
                        <p className="text-xs text-[#5A5255]">{option.desc}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isSelected ? "bg-[#64263C] text-white" : "border-2 border-pink-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* G. Personality / Feel (Question 7) */}
            {currentQ.key === "personality" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl mx-auto">
                {currentQ.options.map((option) => {
                  const isSelected = answers.personality === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSingleSelect("personality", option.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col justify-between ${
                        isSelected
                          ? "border-[#64263C] bg-white shadow-lg ring-2 ring-pink-200 scale-[1.02]"
                          : "border-pink-100 bg-white/70 hover:border-pink-300 hover:bg-white"
                      }`}
                    >
                      <div className="font-serif font-bold text-base text-[#64263C] mb-1">{option.title}</div>
                      <p className="text-xs text-[#5A5255] mb-2">{option.desc}</p>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-[#64263C] bg-pink-100 py-0.5 rounded-full">
                          Selected ✨
                        </span>
                      ) : (
                        <span className="text-[10px] text-pink-400">Click to choose</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Next / Reveal Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-pink-100">
            <span className="text-xs text-[#5A5255]">
              {currentQ.isMultiSelect
                ? `${answers.colors.length} color palette(s) selected`
                : isCurrentAnswered()
                ? "Answer recorded ✨"
                : "Please make a selection to continue"}
            </span>

            <button
              onClick={handleNext}
              disabled={!isCurrentAnswered()}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                isCurrentAnswered()
                  ? "bg-[#64263C] text-[#FFF9F5] hover:bg-[#4E1C2E] shadow-lg hover:shadow-xl cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              <span>{currentQuestionIndex === totalQuestions - 1 ? "Reveal My Nail Vibe ✨" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. SIGNATURE RESULTS SCREEN */}
      {screen === "results" && results && (
        <div className="glass-panel p-6 sm:p-12 shadow-2xl border border-pink-200/80 animate-fade-in">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 text-[#64263C] text-xs font-bold uppercase tracking-widest mb-4 border border-pink-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
              Stylist Consultation Complete
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#64263C] mb-2">
              Your Nail Vibe Is In! ✨
            </h2>

            <div className="text-xl sm:text-2xl font-serif font-bold text-[#D6B477] mb-3">
              {results.archetype.title}
            </div>

            <p className="text-sm sm:text-base text-[#5A5255] font-light leading-relaxed mb-6">
              {results.archetype.description}
            </p>

            {/* Profile Summary Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 bg-white/90 text-[#64263C] text-xs font-semibold rounded-full border border-pink-200 shadow-sm">
                Aesthetic: {answers.aesthetic}
              </span>
              <span className="px-3 py-1 bg-white/90 text-[#64263C] text-xs font-semibold rounded-full border border-pink-200 shadow-sm">
                Shape: {answers.shape}
              </span>
              <span className="px-3 py-1 bg-white/90 text-[#64263C] text-xs font-semibold rounded-full border border-pink-200 shadow-sm">
                Length: {answers.length}
              </span>
              <span className="px-3 py-1 bg-white/90 text-[#64263C] text-xs font-semibold rounded-full border border-pink-200 shadow-sm">
                Occasion: {answers.occasion}
              </span>
              <span className="px-3 py-1 bg-[#F5E8D8] text-[#79571D] text-xs font-semibold rounded-full border border-[#D6B477] shadow-sm">
                Budget: {answers.budget}
              </span>
            </div>
          </div>

          {/* Budget Notice if applicable */}
          {results.budgetNotice && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-[#79571D] flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#D6B477] shrink-0 mt-0.5" />
              <span>{results.budgetNotice}</span>
            </div>
          )}

          {/* Top 3 Perfect Matches */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#64263C]">Your Perfect Matches</h3>
                <p className="text-xs text-[#5A5255]">Hand-selected based on your shape, aesthetic, and color profile</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6B477] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Top 3 Curations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.topMatches.map((matchItem, index) => {
                const { product, matchPercentage, matchReasons } = matchItem;
                const orderUrl = createProductOrderUrl({
                  product,
                  selectedShape: answers.shape || product.shape,
                  selectedLength: answers.length || product.defaultLength,
                  selectedSize: "M"
                });

                return (
                  <div
                    key={product.id}
                    className="glass-card overflow-hidden flex flex-col justify-between border border-pink-200/80 rounded-2xl relative group bg-white"
                  >
                    {/* Rank Badge */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#64263C] text-white text-[11px] font-bold shadow">
                        #{index + 1} Match
                      </span>

                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#64263C] text-[11px] font-bold shadow border border-pink-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D6B477]" />
                        {matchPercentage}% Vibe Match
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-medium tracking-wide uppercase opacity-90 block">
                          {product.collection}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-white drop-shadow-sm">
                          {product.name}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Pricing & Specs */}
                      <div className="mb-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-[#64263C]">₹{product.price}</span>
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                          </div>
                          <span className="text-xs text-[#5A5255] font-medium">
                            {product.shape} • {answers.length || product.defaultLength}
                          </span>
                        </div>

                        <p className="text-xs text-[#5A5255] line-clamp-2 mb-3">
                          {product.shortDescription}
                        </p>

                        {/* Why this matches you explanation tags */}
                        <div className="bg-pink-50/70 p-3 rounded-xl border border-pink-100/80 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64263C] block mb-1">
                            Why this matches you:
                          </span>
                          <ul className="space-y-1">
                            {matchReasons.slice(0, 3).map((reason, rIdx) => (
                              <li key={rIdx} className="text-[11px] text-[#5A5255] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B477] shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2">
                        <a
                          href={orderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-whatsapp w-full text-xs font-bold py-2.5 shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Order on WhatsApp</span>
                        </a>

                        <button
                          onClick={() => onSelectProduct && onSelectProduct(product)}
                          className="w-full py-2 rounded-full border border-pink-200 text-xs font-semibold text-[#64263C] hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Product Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master WhatsApp Action & Retake Options */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-pink-50 border border-pink-200 text-center max-w-2xl mx-auto mb-8 shadow-sm">
            <h4 className="font-serif font-bold text-lg text-[#64263C] mb-2">
              Ready to Order Your Vibe?
            </h4>
            <p className="text-xs text-[#5A5255] mb-5">
              WhatsApp opens with your complete stylist profile and top recommendations prefilled for instant ordering and custom sizing support.
            </p>

            <a
              href={createQuizResultsOrderUrl({ quizResults: results })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-semibold shadow-md inline-flex items-center gap-2 mb-3"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Chat With Stylist & Order on WhatsApp</span>
            </a>

            <p className="text-[11px] text-[#5A5255]">
              💌 No automated charges. You can review your message and confirm sizes with us directly.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-pink-100">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-300 text-xs font-bold text-[#64263C] hover:bg-pink-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => onExploreShop && onExploreShop()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#64263C] text-[#FFF9F5] text-xs font-bold hover:bg-[#4E1C2E] transition-colors shadow-sm"
            >
              <span>Explore All Nail Sets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
