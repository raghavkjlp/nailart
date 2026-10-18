// ============================================================================
// GAMES OF GLOSS — WHATSAPP ORDER & ENQUIRY INTEGRATION
// Formats direct click-to-chat links with prefilled styling and order details
// ============================================================================

import { BRAND_CONFIG } from "../config/brandConfig.js";

/**
 * Clean phone number to ensure digits-only format for WhatsApp wa.me API
 */
const getCleanPhoneNumber = () => {
  return BRAND_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
};

/**
 * 1. Single Product Direct Order Link
 */
export const createProductOrderUrl = ({ product, selectedShape, selectedLength, selectedSize = "M" }) => {
  const shape = selectedShape || product.shape;
  const length = selectedLength || product.defaultLength;
  const size = selectedSize || "M";

  const message = `Hi Games of Gloss! 💅🏻✨

I would love to order the *${product.name}* press-on nail set!

🛍️ *Order Summary:*
• Item: ${product.name} (${product.finish})
• Price: ₹${product.price} (MRP: ₹${product.originalPrice})
• Shape: ${shape}
• Length: ${length}
• Size: ${size}
• Includes: Complete Luxury Application Prep Kit

Please confirm availability and share payment & delivery details. Thank you! 💌`;

  return `https://wa.me/${getCleanPhoneNumber()}?text=${encodeURIComponent(message)}`;
};

/**
 * 2. Quiz Consultation & Recommendation Order Link
 */
export const createQuizResultsOrderUrl = ({ quizResults, selectedProduct = null }) => {
  const { archetype, userAnswers, topMatches } = quizResults;
  const productNames = topMatches.map((m, idx) => `${idx + 1}. ${m.product.name} (₹${m.product.price})`).join("\n");
  const colorsText = Array.isArray(userAnswers.colors) ? userAnswers.colors.join(", ") : userAnswers.colors;

  const targetNote = selectedProduct
    ? `\n🌟 *I specifically want to order:* ${selectedProduct.name} (₹${selectedProduct.price})`
    : "";

  const message = `Hi Games of Gloss! 💅🏻✨

I just completed the *Find My Nail Vibe Quiz* on your website and got my signature stylist profile!

👑 *My Nail Vibe:* ${archetype.title}
• Aesthetic: ${userAnswers.aesthetic || "Not specified"}
• Preferred Shape: ${userAnswers.shape || "Almond"}
• Preferred Length: ${userAnswers.length || "Medium"}
• Favorite Colors: ${colorsText || "Any"}
• Occasion: ${userAnswers.occasion || "Everyday"}
• Budget Tier: ${userAnswers.budget || "Open"}
• Desired Vibe: ${userAnswers.personality || "Classy"}

💖 *My Top 3 Matches:*
${productNames}${targetNote}

Could you please assist me with sizing advice and confirm how to place my order? Can't wait! 💌`;

  return `https://wa.me/${getCleanPhoneNumber()}?text=${encodeURIComponent(message)}`;
};

/**
 * 3. Custom Bespoke Order Enquiry Link
 */
export const createCustomOrderUrl = ({ shape, length, size, aesthetic, inspirationNote, budget }) => {
  const message = `Hi Games of Gloss Atelier! 💅🏻🎨

I would love to commission a *1-on-1 Bespoke Custom Press-On Nail Set*!

📋 *My Custom Requirements:*
• Preferred Shape: ${shape || "Almond"}
• Preferred Length: ${length || "Medium"}
• My Nail Size: ${size || "M (or Custom mm)"}
• Desired Aesthetic: ${aesthetic || "Custom Art / Pinterest Inspo"}
• Approximate Budget: ${budget || "Flexible"}
• Inspo Notes: ${inspirationNote || "I will share reference photos & screenshots here!"}

I am attaching my reference photos in this chat. Please let me know the quote and timeline! ✨`;

  return `https://wa.me/${getCleanPhoneNumber()}?text=${encodeURIComponent(message)}`;
};

/**
 * 4. General Support / Sizing Consultation Link
 */
export const createSupportUrl = (topic = "General Inquiry") => {
  const message = `Hi Games of Gloss! 💌

I have a question regarding: *${topic}*.

Could you please guide me? Thank you! 💅🏻`;

  return `https://wa.me/${getCleanPhoneNumber()}?text=${encodeURIComponent(message)}`;
};

/**
 * 5. Full Bag / Cart Checkout Link
 */
export const createCartCheckoutUrl = (cartItems, totalAmount) => {
  const itemsList = cartItems
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (Qty: ${item.quantity || 1})
   • Shape: ${item.selectedShape || item.shape} | Length: ${item.selectedLength || item.defaultLength} | Size: ${item.selectedSize || "M"}
   • Price: ₹${item.price * (item.quantity || 1)}`
    )
    .join("\n\n");

  const message = `Hi Games of Gloss! 🛍️💅🏻

I'd like to place an order for my shopping bag:

${itemsList}

💵 *Total Order Value:* ₹${totalAmount}
📦 *Delivery Address:* (I will provide my full address and pin code below)

Please share UPI / payment details to confirm my order! ✨`;

  return `https://wa.me/${getCleanPhoneNumber()}?text=${encodeURIComponent(message)}`;
};
