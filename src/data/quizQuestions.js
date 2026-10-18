// ============================================================================
// GAMES OF GLOSS — INTERACTIVE NAIL VIBE QUIZ DATA
// Question definitions, aesthetic cards, visual shape mappings & color palettes
// ============================================================================

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    key: "aesthetic",
    title: "What's your current aesthetic?",
    subtitle: "Select the vibe that speaks directly to your soul right now.",
    isMultiSelect: false,
    options: [
      {
        id: "Coquette Princess",
        title: "Coquette Princess 🎀",
        desc: "Bows, soft pinks, micro-pearls & delicate details.",
        image: "/images/coquette_nail.jpg",
        badge: "Ultra Femme"
      },
      {
        id: "Clean Girl",
        title: "Clean Girl 🤍",
        desc: "Nude shades, milky whites, minimalist glazed elegance.",
        image: "/images/cleangirl_nail.jpg",
        badge: "Quiet Luxury"
      },
      {
        id: "Baddie Energy",
        title: "Baddie Energy 🖤",
        desc: "Vampy ombrés, dramatic silhouettes & fierce confidence.",
        image: "/images/baddie_nail.jpg",
        badge: "High Drama"
      },
      {
        id: "Glazed & Glam",
        title: "Glazed & Glam ✨",
        desc: "Chrome reflections, pearlescent sheens & glossy aura.",
        image: "/images/hero_nail.jpg",
        badge: "Viral Trend"
      },
      {
        id: "Romantic Dreamer",
        title: "Romantic Dreamer 🌸",
        desc: "Florals, blushing pastels & soft poetic finishes.",
        image: "/images/bridal_nail.jpg",
        badge: "Sweet Romance"
      },
      {
        id: "Artsy & Experimental",
        title: "Artsy & Experimental 🎨",
        desc: "Molten 3D chrome, avant-garde textures & creative art.",
        image: "/images/chrome_nail.jpg",
        badge: "Runway Vibe"
      }
    ]
  },
  {
    id: 2,
    key: "length",
    title: "What length feels right for you?",
    subtitle: "From natural chic to show-stopping editorial drama.",
    isMultiSelect: false,
    options: [
      {
        id: "Short",
        title: "Short Nails",
        tag: "12–15 mm",
        desc: "Natural, effortless, and practical for typing and daily life.",
        icon: "Minimize2"
      },
      {
        id: "Medium",
        title: "Medium Nails",
        tag: "16–20 mm",
        desc: "The universal sweet spot: balanced, flattering, and versatile.",
        icon: "CheckCircle2"
      },
      {
        id: "Long",
        title: "Long Nails",
        tag: "21–25 mm",
        desc: "Dramatic, glamorous, and turns hands into living artwork.",
        icon: "Sparkles"
      },
      {
        id: "Extra Long",
        title: "Extra Long Nails",
        tag: "26+ mm",
        desc: "Maximalist, bold statement nails that own the spotlight.",
        icon: "Zap"
      }
    ]
  },
  {
    id: 3,
    key: "shape",
    title: "Pick your favorite nail shape",
    subtitle: "Each silhouette changes the contour and character of your hands.",
    isMultiSelect: false,
    options: [
      {
        id: "Almond",
        title: "Almond",
        desc: "Soft tapered curve with a rounded peak. Universally slimming.",
        shapeIcon: "Almond"
      },
      {
        id: "Square",
        title: "Square",
        desc: "Crisp straight-across edge with clean 90-degree corners.",
        shapeIcon: "Square"
      },
      {
        id: "Coffin / Ballerina",
        title: "Coffin / Ballerina",
        desc: "Tapered sides terminating in a sharp, flat square edge.",
        shapeIcon: "Coffin / Ballerina"
      },
      {
        id: "Oval",
        title: "Oval",
        desc: "Classic gently-curved rounded contour that flatters all finger types.",
        shapeIcon: "Oval"
      },
      {
        id: "Stiletto",
        title: "Stiletto",
        desc: "Dramatically pointed apex. Edgy, daring, and fierce.",
        shapeIcon: "Stiletto"
      }
    ]
  },
  {
    id: 4,
    key: "colors",
    title: "What colors do you gravitate toward?",
    subtitle: "Select one or more color families that make your heart flutter.",
    isMultiSelect: true,
    options: [
      {
        id: "Blush pink and baby pink",
        title: "Blush & Baby Pink",
        swatch: ["#F8DCE5", "#F3B6CB"],
        desc: "Delicate ballet pinks and rosy hues"
      },
      {
        id: "Nude and milky white",
        title: "Nude & Milky White",
        swatch: ["#F9F4EE", "#E8D8CC"],
        desc: "Clean girl coconut milk and glazed neutrals"
      },
      {
        id: "Black and burgundy",
        title: "Black & Burgundy",
        swatch: ["#242124", "#64263C"],
        desc: "Moody obsidian noir and vampy oxblood"
      },
      {
        id: "Chrome and silver",
        title: "Chrome & Silver",
        swatch: ["#E8E8EE", "#A8A8B4"],
        desc: "Molten liquid mirror and pearlescent shine"
      },
      {
        id: "Pastels and lavender",
        title: "Pastels & Lavender",
        swatch: ["#E2D4F0", "#F8E1EE"],
        desc: "Dreamy aurora lilac and fairycore tones"
      },
      {
        id: "Red and cherry tones",
        title: "Red & Cherry Tones",
        swatch: ["#991B38", "#590D22"],
        desc: "Juicy black cherry and classic ruby red"
      },
      {
        id: "Brown and mocha",
        title: "Brown & Mocha",
        swatch: ["#795548", "#C7A788"],
        desc: "Warm caramel latte and toasted espresso"
      }
    ]
  },
  {
    id: 5,
    key: "occasion",
    title: "What are your nails for?",
    subtitle: "Tell us where you'll be showing off your new signature set.",
    isMultiSelect: false,
    options: [
      { id: "Everyday wear", title: "Everyday Wear ☕", desc: "Low-stress, chip-proof glam that elevates your routine." },
      { id: "College or work", title: "College or Work 💻", desc: "Polished, professional, and typing-friendly." },
      { id: "Date night", title: "Date Night 🍷", desc: "Sultry, romantic, and candlelit-glow ready." },
      { id: "Wedding or special occasion", title: "Wedding or Special Occasion 💍", desc: "Luxe pearls, crystals, and heirloom bridal glamour." },
      { id: "Party or vacation", title: "Party or Vacation 🥂", desc: "Showstopper sets ready for cocktails and golden hour." },
      { id: "Just because I deserve fabulous nails!", title: "Just Because I Deserve Fabulous Nails! 💅🏻", desc: "Self-care pure and simple. Main character energy." }
    ]
  },
  {
    id: 6,
    key: "budget",
    title: "What's your preferred budget?",
    subtitle: "We believe everyone deserves salon-quality luxury.",
    isMultiSelect: false,
    options: [
      { id: "Under ₹299", title: "Under ₹299", desc: "Ultra-accessible entry glam & cute accent sets." },
      { id: "₹300–₹499", title: "₹300–₹499", desc: "Sweet spot for everyday staples & clean girl glazed sets." },
      { id: "₹500–₹799", title: "₹500–₹799", desc: "Intricate handcrafted 3D art, chrome drips & cat-eyes." },
      { id: "₹800+", title: "₹800+", desc: "Full bespoke couture, Swarovski crystals & editorial art." }
    ]
  },
  {
    id: 7,
    key: "personality",
    title: "How do you want your nails to feel?",
    subtitle: "The final touch: define the sensory emotion of your set.",
    isMultiSelect: false,
    options: [
      { id: "Soft and delicate", title: "Soft & Delicate 🕊️", desc: "Gentle, understated, and whispering quiet beauty." },
      { id: "Classy and timeless", title: "Classy & Timeless 💎", desc: "Never out of style. The epitome of refined taste." },
      { id: "Bold and confident", title: "Bold & Confident ⚡", desc: "Unstoppable, commanding, and fiercely magnetic." },
      { id: "Cute and playful", title: "Cute & Playful 🎀", desc: "Bubbly, cheerful, and full of charming personality." },
      { id: "Expensive and luxurious", title: "Expensive & Luxurious ✨", desc: "Radiating high-tax-bracket indulgence." },
      { id: "Unique and artistic", title: "Unique & Artistic 🎨", desc: "One of a kind, expressive, and avant-garde." }
    ]
  }
];
