import React, { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Sparkles, Send } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon.jsx";
import { BRAND_CONFIG } from "../config/brandConfig.js";
import { createSupportUrl } from "../utils/whatsapp.js";

export const ContactSection = () => {
  const [topic, setTopic] = useState("Order Inquiry");
  const [customMsg, setCustomMsg] = useState("");

  const handleLaunchWhatsApp = () => {
    const text = customMsg.trim()
      ? `Hi Games of Gloss! 💅🏻\n\nI have a question regarding: *${topic}*.\n\nDetails: ${customMsg}`
      : `Hi Games of Gloss! 💅🏻 I have a question regarding: *${topic}*. Please assist!`;
    const cleanNum = BRAND_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FFF9F5]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#64263C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B477]" />
            Personal Nail Concierge
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#64263C] mb-3">
            Get in Touch With Us
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5255] font-light leading-relaxed">
            Have a question about an existing order, custom nail sizing, or bridal party packages?
            Our stylist team is here to assist you via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          {/* Left: Contact Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#64263C] border-b border-pink-100 pb-3">
                Atelier Concierge
              </h3>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#64263C] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242124] block">WhatsApp Business</span>
                  <a
                    href={createSupportUrl("Concierge")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64263C] font-semibold hover:underline"
                  >
                    {BRAND_CONFIG.whatsappDisplayNumber}
                  </a>
                  <span className="text-[11px] text-gray-500 block mt-0.5">Average reply time: under 15 mins</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#64263C] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242124] block">Email Inquiries</span>
                  <a
                    href={`mailto:${BRAND_CONFIG.email}`}
                    className="text-[#64263C] font-semibold hover:underline"
                  >
                    {BRAND_CONFIG.email}
                  </a>
                  <span className="text-[11px] text-gray-500 block mt-0.5">For brand partnerships & press</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#64263C] flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242124] block">Instagram</span>
                  <a
                    href={BRAND_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#64263C] font-semibold hover:underline"
                  >
                    {BRAND_CONFIG.instagramHandle}
                  </a>
                  <span className="text-[11px] text-gray-500 block mt-0.5">Tag us in your nail selfies! 💅🏻</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#64263C] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#242124] block">Operating Hours</span>
                  <span className="text-[#5A5255]">Monday – Saturday: 10:00 AM – 8:00 PM IST</span>
                  <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">Orders accepted 24/7 online</span>
                </div>
              </div>
            </div>

            {/* Pan-India Delivery Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 to-amber-50 border border-pink-200 text-xs text-[#64263C]">
              <span className="font-bold block mb-1">📦 Pan-India Express Delivery</span>
              <p className="text-[11px] text-[#5A5255]">
                We ship to every pincode in India via Bluedart, Delhivery & DTDC. Metro deliveries take 3–4 business days.
              </p>
            </div>
          </div>

          {/* Right: Interactive WhatsApp Message Composer (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-md">
            <h3 className="font-serif font-bold text-xl text-[#64263C] mb-2">
              Send a Message to Our Stylist Team
            </h3>
            <p className="text-xs text-[#5A5255] mb-6">
              Select your inquiry type, type your message, and hit send. WhatsApp will open with your prefilled inquiry ready to send!
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Order Inquiry",
                    "Custom Sizing Help",
                    "Bridal / Bulk Order",
                    "Application Assistance",
                    "Shipping Status",
                    "Other"
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                        topic === t
                          ? "border-[#64263C] bg-pink-100 text-[#64263C] font-bold"
                          : "border-pink-200 text-[#5A5255] hover:bg-pink-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#242124] block mb-2">
                  Your Message
                </label>
                <textarea
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  rows={4}
                  placeholder="Tell us what's on your mind, your order number, or your nail design questions..."
                  className="w-full p-4 rounded-2xl border border-pink-200 text-xs text-[#242124] focus:outline-none focus:border-[#64263C] focus:ring-1 focus:ring-[#64263C]"
                />
              </div>

              <button
                onClick={handleLaunchWhatsApp}
                className="btn-whatsapp w-full py-4 text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open Chat on WhatsApp</span>
              </button>

              <div className="p-3 rounded-xl bg-pink-50 text-[11px] text-[#5A5255] text-center border border-pink-100">
                🔒 You will be directed to official WhatsApp. No automatic ordering or billing occurs without your explicit confirmation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
