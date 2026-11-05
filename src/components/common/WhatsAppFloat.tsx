'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Clock, Sparkles } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '919400976257';

  const options = [
    {
      label: 'Rental Jewellery Inquiry',
      msg: 'Hello Lekshmi! I would like to inquire about bridal rental availability & booking terms.',
      icon: Clock,
    },
    {
      label: 'Custom Design / Purchase Inquiry',
      msg: 'Hello CHARMIKA Jewels! I have questions regarding purchasing or customizing a jewellery piece.',
      icon: Sparkles,
    },
    {
      label: 'General Boutique Question',
      msg: 'Hello! I would like to speak with your Kottayam store team.',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick Menu Popup */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-3xl shadow-luxury border border-gold/30 p-4 space-y-3 animate-slide-up text-charcoal">
          <div className="flex justify-between items-center pb-2 border-b border-gold/20">
            <div>
              <span className="font-serif font-bold text-maroon text-sm block">Charmika WhatsApp Help</span>
              <span className="text-[10px] text-emerald-600 font-semibold">● Online • Typical response &lt; 15 mins</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-charcoal/50 hover:text-charcoal hover:bg-beige"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <a
                  key={opt.label}
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(opt.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 bg-beige/60 hover:bg-gold/20 rounded-xl transition-all border border-gold/15 text-xs text-maroon font-medium group"
                >
                  <div className="p-1.5 bg-white rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 text-[11px] leading-snug">{opt.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Compact Circular Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 sm:p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group border-2 border-white/40"
        title="Chat with Charmika Jewels on WhatsApp"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>
    </div>
  );
};
