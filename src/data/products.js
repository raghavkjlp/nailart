// ============================================================================
// GAMES OF GLOSS — PRODUCT CATALOG DATA
// Centralized product dataset. Synced with dynamic productStore.
// ============================================================================

import { getStoredProducts, COQUETTE_AFFAIR_TEMPLATE } from "./productStore.js";

// Active dynamic products
export const PRODUCTS = getStoredProducts();

// Featured Collections metadata for homepage cards
export const FEATURED_COLLECTIONS = [
  {
    id: "coquette",
    title: "Coquette & Cute 🎀",
    tagline: "Bows, Pearls & Pastel Daydreams",
    description: "Ultra-femme designs adorned with hand-sculpted 3D bows, dainty pearls, and sugar glitter tips.",
    image: "/images/coquette_nail.jpg",
    filterTag: "Coquette & Cute 🎀"
  },
  {
    id: "clean-girl",
    title: "Clean Girl Era 🤍",
    tagline: "Milky Nudes & Glazed Perfection",
    description: "The minimalist dream: glazed donut chrome, sheer coconut milk bases, and subtle elegance.",
    image: "/images/cleangirl_nail.jpg",
    filterTag: "Clean Girl Era 🤍"
  },
  {
    id: "baddie",
    title: "Baddie Energy 🖤",
    tagline: "Dramatic Shapes & Fierce Accents",
    description: "Sharp stilettos, cyber chrome thorns, deep vampy ombrés, and show-stopping attitude.",
    image: "/images/baddie_nail.jpg",
    filterTag: "Baddie Energy 🖤"
  },
  {
    id: "wedding",
    title: "Wedding & Romance 💍",
    tagline: "Bridal Porcelain & Crystal Halos",
    description: "Timeless sets sculpted with 3D lace flowers, Swarovski crystals, and soft French fades.",
    image: "/images/bridal_nail.jpg",
    filterTag: "Wedding & Romance 💍"
  },
  {
    id: "chrome",
    title: "Chrome & Glazed ✨",
    tagline: "Molten Silver & Iridescent Aurora",
    description: "High-shine futuristic chrome drips, pearlescent sheens, and liquid metallic reflections.",
    image: "/images/chrome_nail.jpg",
    filterTag: "Chrome & Glazed ✨"
  },
  {
    id: "custom",
    title: "Custom Creations 💅🏻",
    tagline: "Your Vision, Hand-Painted by Artists",
    description: "Send us your Pinterest inspiration and let our senior nail artists craft your 1-of-1 bespoke set.",
    image: "/images/custom_nail.jpg",
    filterTag: "Custom Creations 💅🏻"
  }
];
