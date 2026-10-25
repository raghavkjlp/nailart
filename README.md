# Games of Gloss 💅🏻 — Premium Press-On Nail Atelier & Vibe Engine

> **“Your Nails. Your Rules. Your Vibe.”**  
> A high-conversion, responsive luxury e-commerce experience designed for modern press-on nail lovers. Featuring our signature **“Find My Nail Vibe”** 7-question consultation quiz, automated recommendation engine, and seamless WhatsApp ordering integration.

---

## ✨ Brand Identity & Aesthetic Direction

- **Brand Personality**: Feminine, playful, luxurious, confident, trendy, and Instagram/Pinterest-worthy.
- **Color Palette**:
  - **Blush Pink**: `#F8DCE5`
  - **Soft Pink**: `#F3B6CB`
  - **Cream / Pearl**: `#FFF9F5`
  - **Deep Burgundy**: `#64263C`
  - **Champagne Gold**: `#D6B477`
  - **Soft Black**: `#242124`
- **Editorial Typography**: *Playfair Display* & *Italiana* for headlines, paired with clean *Plus Jakarta Sans* for modern readability.
- **Visuals**: Bespoke salon photography, 3D chrome details, velvet cat-eyes, and pearlescent glazed donut finishes.

---

## 🌟 Key Features

### 1. 💌 Dynamic Homepage
- **Editorial Hero Section**: High-impact split layout with hero glazed chrome photography, trust badges (*Reusable 5x, 10-Min Application, Free Prep Kit*), and immediate CTA anchors.
- **Aesthetic Worlds (Featured Collections)**:
  - 🎀 *Coquette & Cute* — Bows, pearls & sugar glitter French tips
  - 🤍 *Clean Girl Era* — Milky coconut nudes & glazed donut chrome
  - 🖤 *Baddie Energy* — Cyber chrome thorns, vampy ombré & stilettos
  - 💍 *Wedding & Romance* — 3D porcelain florals & crystal halos
  - ✨ *Chrome & Glazed* — Molten liquid silver & aurora holographic sheen
  - 💅🏻 *Custom Creations* — 1-on-1 bespoke atelier commissions
- **Bestsellers Showcase**: Interactive tabbed catalog with ratings, price in INR, original MRP discounts, shape/length badges, and instant WhatsApp ordering.
- **Brand Story & Philosophy**: “A Little Gloss. A Lot of Personality.” highlighting salon quality at home without UV lamp damage.
- **3-Step Glam Routine**: Visual guide to *Prep & Buff*, *Size & Glue/Tab*, and *Press & Slay*.
- **Customer Love Letters**: Social proof reviews with verified customer badges.

### 2. 🔮 Signature Feature: “Find My Nail Vibe” Interactive Quiz
A multi-step, beauty consultation quiz designed to feel like an editorial stylist appointment:
1. **Aesthetic**: Coquette Princess, Clean Girl, Baddie Energy, Glazed & Glam, Romantic Dreamer, Artsy & Experimental.
2. **Length**: Short (12–15mm), Medium (16–20mm), Long (21–25mm), Extra Long (26mm+).
3. **Nail Shape**: Almond, Square, Coffin / Ballerina, Oval, Stiletto (with custom SVG silhouette icons).
4. **Color Palettes**: Multi-select support across 7 curated palettes.
5. **Occasion**: Everyday, Work/College, Date Night, Wedding, Vacation, or Self-Care.
6. **Budget**: Under ₹299, ₹300–₹499, ₹500–₹799, ₹800+.
7. **Sensory Feel**: Soft & Delicate, Classy & Timeless, Bold & Confident, Cute & Playful, Expensive & Luxurious, Unique & Artistic.

### 3. 🧠 Intelligent Recommendation Engine (`src/utils/recommendationEngine.js`)
- Weighted multi-factor algorithm:
  - **Aesthetic Match**: `+5 pts`
  - **Shape Match**: `+4 pts`
  - **Length Match**: `+4 pts`
  - **Color Match**: `+3 pts`
  - **Occasion Match**: `+3 pts`
  - **Personality Match**: `+2 pts`
  - **Budget Match**: `+3 pts`
- **Dynamic Archetype Synthesis**: Calculates personality titles like *The Coquette Queen 🎀*, *The Clean Girl Icon 🤍*, *The Fearless Baddie 🖤*, *The Glam Goddess ✨*, *The Romantic Dreamer 🌸*, or *The Trendsetter 💅🏻*.
- **Transparent Match Explanations**: Generates specific *"Why this matches you"* tags on recommended products.
- **Budget-Aware Fallback**: If no exact match exists in the chosen budget tier, closest alternatives are shown with transparent pricing.

### 4. 🛍️ Dedicated Shop Nail Sets Page
- Multi-faceted sidebar and mobile drawer filtering (Aesthetic, Shape, Length, Color, Price Range, Occasion).
- Instant sorting: *Recommended & Top Rated*, *Price: Low to High*, *Price: High to Low*, *Most Popular*.
- Live search bar and active filter chips with one-click reset.

### 5. 💅🏻 Product Customizer & Quick View Modal
- High-res image gallery with interactive thumbnails.
- Dynamic Shape Selector (Almond, Square, Coffin, Oval, Stiletto).
- Dynamic Length Selector (Short, Medium, Long, Extra Long).
- Sizing Selector (XS, S, M, L, Custom mm).
- Tabbed instructions: *10-Min Application*, *Safe Removal*, *Glue vs. Tabs*.

### 6. 💬 WhatsApp Order & Concierge Integration (`src/utils/whatsapp.js`)
- **Single Product Order**: Prefills item name, price, chosen shape, length, size, and prep kit confirmation.
- **Quiz Results Order**: Compiles customer archetype, answers summary, and top 3 recommended sets into a styling inquiry.
- **Custom Bespoke Order**: Brief generator collecting references, custom mm sizes, and inspiration descriptions.
- **Bag Checkout**: Compiles multiple items, quantities, and totals into an organized WhatsApp message.
- *Notice*: Never claims an order is placed automatically; opens WhatsApp with a prepared draft for the customer to review and send.

### 7. 📏 Nail Bed Sizing Guide & 1-on-1 Atelier Inquiry Modals
- Millimeter sizing chart across Thumb, Index, Middle, Ring, Pinky.
- Step-by-step Tape & Ruler measurement method and Coin photo assistance.

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/games-of-gloss.git
cd games-of-gloss
npm install
```

### 2. Development Server
Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` (or port specified in terminal).

### 3. Production Build
Compile optimized production assets:
```bash
npm run build
```
Preview the built bundle locally:
```bash
npm run preview
```

---

## 🎨 How to Customize the Brand

All business data and products are intentionally centralized for easy editing without touching complex UI logic:

### Updating Brand Information (`src/config/brandConfig.js`)
Edit phone number, announcement bar, Instagram handle, and shipping rules:
```javascript
export const BRAND_CONFIG = {
  name: "Games of Gloss",
  whatsappNumber: "918178187385", // WhatsApp business number
  whatsappDisplayNumber: "+91 81781 87385",
  instagramHandle: "@games_of_gloss",
  instagramUrl: "https://www.instagram.com/games_of_gloss/",
  freeShippingThreshold: 999, // In INR
  ...
};
```

### Adding or Updating Products (`src/data/products.js`)
Add new nail sets, modify prices, or change images in `src/data/products.js`:
```javascript
{
  id: "cherry-on-top",
  name: "Cherry On Top",
  price: 699,
  originalPrice: 999,
  image: "/images/cherry_nail.jpg",
  badge: "Trending Now",
  shape: "Almond",
  defaultLength: "Medium",
  aestheticTags: ["Baddie Energy", "Romantic Dreamer"],
  colors: ["Red and cherry tones"],
  ...
}
```

---

## 🌐 Netlify Deployment Guide

The project is pre-configured with:
- `netlify.toml` for automated build commands and security headers.
- `public/_redirects` for Single Page Application fallback routing.

### Step 1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Push your project:
```bash
git init
git add .
git commit -m "feat: initial commit of Games of Gloss luxury press-on website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/games-of-gloss.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** and authorize access to your repository `games-of-gloss`.
4. Netlify will auto-detect the build settings from `netlify.toml`:
   - **Base directory**: (leave blank / root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**. Netlify will build and deploy your site with a free `*.netlify.app` URL.

### Step 3: Connecting Your Existing Custom Domain
1. In your Netlify Site dashboard, go to **Site configuration** > **Domain management**.
2. Click **"Add custom domain"** and enter your registered domain (e.g., `gamesofgloss.com`).
3. Netlify will show the required DNS records:
   - **Apex domain (`gamesofgloss.com`)**: Add an **A Record** pointing to Netlify's load balancer IP: `75.2.60.5`
   - **Subdomain (`www.gamesofgloss.com`)**: Add a **CNAME Record** pointing to your Netlify site URL (e.g. `your-site-name.netlify.app`).
4. Log into your domain registrar (GoDaddy, Namecheap, Google Domains / Squarespace) and update your DNS records accordingly.

### Step 4: Enabling Free HTTPS / SSL
1. In Netlify's **Domain management** page, scroll down to **HTTPS**.
2. Once DNS propagation finishes (typically 15 mins to a few hours), click **"Verify DNS configuration"** and then **"Provision certificate"**.
3. Netlify will issue a free, automatic Let's Encrypt SSL certificate and automatically redirect all HTTP traffic to HTTPS.

---

## 🔮 Future-Ready Architecture

The codebase is structured so the following advanced features can be integrated smoothly:
1. **AI Beauty Assistant**: UI slots and data models are decoupled from the recommendation engine, allowing you to connect an LLM chat widget to `src/utils/recommendationEngine.js` for real-time conversational styling.
2. **Virtual Nail Try-On**: Product cards and modal containers contain dedicated canvas hooks where hand photo upload and AR overlay models can be introduced without altering product schemas.
3. **Database / Headless CMS Integration**: `src/data/products.js` uses standard JSON/REST-compatible object schemas that can be replaced with an API call to Shopify, Strapi, or Supabase.

---

## 📜 License
Handcrafted with love for **Games of Gloss**. All rights reserved.
