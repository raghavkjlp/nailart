// ============================================================================
// GAMES OF GLOSS — INTELLIGENT NAIL RECOMMENDATION ENGINE
// Multi-factor weighted scoring algorithm for personalized nail recommendations
// ============================================================================

import { getStoredProducts } from "../data/productStore.js";

/**
 * Budget range parser helper
 */
export const isWithinBudget = (price, budgetAnswer) => {
  if (!budgetAnswer) return true;
  if (budgetAnswer === "Under ₹299") return price <= 299;
  if (budgetAnswer === "₹300–₹499" || budgetAnswer === "₹300-₹499") return price >= 300 && price <= 499;
  if (budgetAnswer === "₹500–₹799" || budgetAnswer === "₹500-₹799") return price >= 500 && price <= 799;
  if (budgetAnswer === "₹800+") return price >= 800;
  return true;
};

/**
 * Determine dynamic personality archetype based on quiz answers
 */
export const calculateArchetype = (answers) => {
  const aesthetic = answers.aesthetic || "";
  const personality = answers.personality || "";

  if (aesthetic.includes("Coquette") || personality === "Cute and playful") {
    return {
      title: "The Coquette Queen 🎀",
      tagline: "Romantic ribbons, pearls & unapologetic sweetness",
      description: "Your style radiates delicate whimsy, romantic daydreams, and feminine allure. You appreciate fine details, pearlescent textures, and nails that make you feel like the main character in your own modern fairytale.",
      colorAccent: "#F3B6CB"
    };
  }

  if (aesthetic.includes("Clean Girl") || personality === "Classy and timeless") {
    return {
      title: "The Clean Girl Icon 🤍",
      tagline: "Effortless luxury, glazed nudes & understated polish",
      description: "You believe the chicest statement is subtle and pristine. Your vibe is quiet luxury: glowing skin, gold huggie earrings, iced lattes, and glazed milky manicures that look effortlessly expensive.",
      colorAccent: "#D6B477"
    };
  }

  if (aesthetic.includes("Baddie") || personality === "Bold and confident") {
    return {
      title: "The Fearless Baddie 🖤",
      tagline: "Unapologetic drama, razor-sharp tips & high voltage confidence",
      description: "You don't follow trends—you dictate them. Your nails are your armor and your crown: dramatic silhouettes, vampy gradients, metallic chrome accents, and enough attitude to command every room you enter.",
      colorAccent: "#64263C"
    };
  }

  if (aesthetic.includes("Glazed") || personality === "Expensive and luxurious") {
    return {
      title: "The Glam Goddess ✨",
      tagline: "Mirror reflections, molten chrome & celestial radiance",
      description: "You are enchanted by shimmer, light-catching chrome, and multidimensional shine. You love sets that look like spun gold and silver stardust, perfectly capturing high-fashion runway energy.",
      colorAccent: "#D6B477"
    };
  }

  if (aesthetic.includes("Romantic") || personality === "Soft and delicate") {
    return {
      title: "The Romantic Dreamer 🌸",
      tagline: "Blushing florals, soft pastels & poetic grace",
      description: "Gentle, nostalgic, and enchanting. You gravitate toward pastel tones, ethereal watercolor gradients, and delicate hand-painted accents that whisper elegance rather than shout.",
      colorAccent: "#F8DCE5"
    };
  }

  // Default / Artsy
  return {
    title: "The Trendsetter 💅🏻",
    tagline: "Eclectic creativity, avant-garde textures & bespoke flair",
    description: "You view your fingertips as a miniature gallery canvas. You love experimental shapes, unexpected color pairings, and conversation-starting nail art that reflects your dynamic, multifaceted spirit.",
    colorAccent: "#E8A2B8"
  };
};

/**
 * Main recommendation calculator
 */
export const calculateRecommendations = (answers, customProducts = null) => {
  const {
    aesthetic = "",
    length = "",
    shape = "",
    colors = [],
    occasion = "",
    budget = "",
    personality = ""
  } = answers;

  const catalog = customProducts || getStoredProducts();
  const availableProducts = catalog.filter((p) => p.isAvailable !== false);

  const scoredProducts = availableProducts.map((product) => {
    let score = 0;
    const matchReasons = [];

    // 1. Aesthetic match: +5 points
    if (
      aesthetic &&
      ((product.aestheticTags &&
        product.aestheticTags.some(
          (tag) =>
            tag.toLowerCase().includes(aesthetic.toLowerCase()) ||
            aesthetic.toLowerCase().includes(tag.toLowerCase())
        )) ||
        (product.collection &&
          product.collection.toLowerCase().includes(aesthetic.toLowerCase())))
    ) {
      score += 5;
      matchReasons.push(`Matches your ${aesthetic} aesthetic`);
    }

    // 2. Nail shape match: +4 points
    if (
      shape &&
      (product.shape?.toLowerCase() === shape.toLowerCase() ||
        (product.availableShapes &&
          product.availableShapes.some((s) => s.toLowerCase() === shape.toLowerCase())))
    ) {
      score += 4;
      matchReasons.push(`Features your favorite ${shape} silhouette`);
    }

    // 3. Length match: +4 points
    if (
      length &&
      (product.defaultLength === length ||
        (product.availableLengths && product.availableLengths.includes(length)))
    ) {
      score += 4;
      matchReasons.push(`Available in your ideal ${length} length`);
    }

    // 4. Color preference match: +3 points
    if (Array.isArray(colors) && colors.length > 0 && product.colors) {
      const matchingColor = colors.find((c) => product.colors.includes(c));
      if (matchingColor) {
        score += 3;
        matchReasons.push(`Features your color palette (${matchingColor})`);
      }
    }

    // 5. Occasion match: +3 points
    if (occasion && product.occasions && product.occasions.includes(occasion)) {
      score += 3;
      matchReasons.push(`Perfect for ${occasion}`);
    }

    // 6. Personality/vibe match: +2 points
    if (personality && product.personalityTags && product.personalityTags.includes(personality)) {
      score += 2;
      matchReasons.push(`Embodies that ${personality} feel`);
    }

    // 7. Within budget check: +3 points
    const withinBudget = isWithinBudget(product.price, budget);
    if (withinBudget) {
      score += 3;
      if (budget) matchReasons.push(`Within your ${budget} budget`);
    }

    // Calculate match percentage (max score possible ~ 24 points)
    const maxPossibleScore = 24;
    const matchPercentage = Math.min(99, Math.max(68, Math.round((score / maxPossibleScore) * 100)));

    return {
      product,
      score,
      matchPercentage,
      withinBudget,
      matchReasons
    };
  });

  // Sort primarily by within budget, then score descending, then rating descending
  scoredProducts.sort((a, b) => {
    if (a.withinBudget !== b.withinBudget) {
      return a.withinBudget ? -1 : 1;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.product.rating - a.product.rating;
  });

  // Check if any product matched the budget
  const anyWithinBudget = scoredProducts.some((item) => item.withinBudget);
  const budgetNotice = !anyWithinBudget && budget
    ? `We noticed none of our handcrafted sets currently fall in the "${budget}" tier, but don't worry! Here are our closest luxury matches with transparent pricing:`
    : null;

  // Return top 3 matches as primary, and remaining as alternative recommendations
  const topMatches = scoredProducts.slice(0, 3);
  const otherMatches = scoredProducts.slice(3, 6);
  const archetype = calculateArchetype(answers);

  return {
    archetype,
    topMatches,
    otherMatches,
    totalEvaluated: scoredProducts.length,
    budgetNotice,
    userAnswers: answers
  };
};
