// ============================================================================
// GAMES OF GLOSS — BRAND CONFIGURATION
// Easily edit brand details, contact information, and business parameters here.
// ============================================================================

export const BRAND_CONFIG = {
  name: "Games of Gloss",
  shortName: "GOG",
  tagline: "A Little Gloss. A Lot of Glam.",
  subtitle: "Your destination for handcrafted press-on nails, statement jewellery and little luxuries. Thoughtfully curated to celebrate your individuality, elevate your everyday style and add a touch of glamour to every moment.",
  
  // Announcement ticker text
  announcementText: "A Little Gloss. A Lot of Glam. ✨ | Handcrafted nails & statement jewellery",
  announcementSub: "Handcrafted Luxury • Reusable up to 5x • Salon Finish in 10 Mins 💅🏻",
  announcements: [
    {
      id: "brand-tagline",
      text: "A Little Gloss. A Lot of Glam. ✨",
      sub: "All things beautiful, bold & effortlessly stylish",
      action: "about"
    },
    {
      id: "free-shipping",
      text: "Free Pan-India Shipping over ₹999 📦",
      sub: "Express 3–5 day doorstep delivery",
      action: "shop"
    },
    {
      id: "salon-finish",
      text: "Salon Finish in 10 Mins 💅🏻",
      sub: "Reusable up to 5x • Gentle on natural nails",
      action: "about"
    },
    {
      id: "nail-quiz",
      text: "Find Your Nail Aesthetic ✨",
      sub: "Take our 60-second Nail Vibe Quiz",
      action: "quiz"
    }
  ],
  
  // WhatsApp Configuration (Direct contact & order concierge)
  // Format: country code + 10 digit number without '+' or '-'
  whatsappNumber: "918178187385", 
  whatsappDisplayNumber: "+91 81781 87385",
  
  // Social links & contacts
  instagramHandle: "@games_of_gloss",
  instagramUrl: "https://www.instagram.com/games_of_gloss/",
  email: "Gamesofgloss@gmail.com",
  location: "New Delhi & Mumbai, India",
  shippingNote: "Pan-India Express Delivery (3–5 business days)",
  freeShippingThreshold: 999,
  currency: "₹",
  
  // Trust Badges
  features: [
    {
      icon: "Sparkles",
      title: "Salon Quality In 10 Mins",
      description: "Get pristine gel-sculpted nails at home without harmful UV damage or hours in a salon."
    },
    {
      icon: "ShieldCheck",
      title: "Reusable Up to 5x",
      description: "Made with multi-layered premium resin that won't chip, bend, or fade over time."
    },
    {
      icon: "PackageCheck",
      title: "Complete Prep Kit Included",
      description: "Every set arrives in a keepsake box with professional nail glue, adhesive glue tabs, nail buffer, nail filer, cuticle pusher & alcohol prep pads."
    },
    {
      icon: "HeartHandshake",
      title: "Custom Sized for You",
      description: "Flawless custom nail beds from XS to L, or customized millimeter measurements for a bespoke fit."
    }
  ],

  // Sizing standard measurements (in millimeters: Thumb, Index, Middle, Ring, Pinky)
  sizingChart: [
    { size: "XS", measurements: "14mm • 11mm • 12mm • 10mm • 8mm", recommended: "Petite nail beds" },
    { size: "S", measurements: "15mm • 12mm • 13mm • 11mm • 8mm", recommended: "Average to slim fingers" },
    { size: "M", measurements: "16mm • 12mm • 14mm • 12mm • 9mm", recommended: "Most popular universal fit" },
    { size: "L", measurements: "18mm • 13mm • 15mm • 13mm • 10mm", recommended: "Wider nail beds" },
    { size: "Custom", measurements: "Send your custom mm via WhatsApp", recommended: "100% tailor-made fit" }
  ],

  // Available nail shapes with descriptions
  shapes: [
    { id: "Almond", name: "Almond", tag: "Most Flattering", desc: "Elongates fingers with a soft tapered, rounded tip. Universally elegant." },
    { id: "Square", name: "Square", tag: "Modern Classic", desc: "Crisp straight-across edge with sharp 90-degree corners. Chic and clean." },
    { id: "Coffin / Ballerina", name: "Coffin / Ballerina", tag: "Baddie Favorite", desc: "Tapered sides that flatten into a straight square tip. High-glam statement." },
    { id: "Oval", name: "Oval", tag: "Natural & Timeless", desc: "Classic curved contour following natural cuticle shape. Soft and effortless." },
    { id: "Stiletto", name: "Stiletto", tag: "Bold & Fierce", desc: "Dramatically pointed spike silhouette. Ultimate drama and confidence." }
  ],

  // Available lengths
  lengths: [
    { id: "Short", name: "Short", tag: "Practical & Low Maintenance", desc: "12–15mm past fingertip. Ideal for typing, everyday tasks, and subtle grace." },
    { id: "Medium", name: "Medium", tag: "The Sweet Spot", desc: "16–20mm. Balanced length that adds elegance while staying functional." },
    { id: "Long", name: "Long", tag: "Glamorous & Dramatic", desc: "21–25mm. Gorgeous editorial length that turns heads." },
    { id: "Extra Long", name: "Extra Long", tag: "Showstopper", desc: "26mm+. Maximalist statement nails for festivals, shoots, and baddie energy." }
  ]
};
