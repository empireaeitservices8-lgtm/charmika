'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_COUPONS, WooCommerceService } from '@/services/woocommerce';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Tag, Clock, Copy, Check } from 'lucide-react';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { hours: prev.hours > 0 ? prev.hours - 1 : 24, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadSaleProducts() {
      const products = await WooCommerceService.getProducts();
      setSaleProducts(products.filter((p) => p.onSale));
    }
    loadSaleProducts();
  }, []);

  return (
    <div className="py-12 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with Countdown Timer */}
        <div className="bg-maroon-950 text-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-luxury mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Festival Season Sale 2026
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold">
              Exclusive Luxury Discounts
            </h1>
            <p className="text-xs text-white/80 max-w-md font-light">
              Enjoy extra savings on Kundan, Temple Nakshi & AD Stone jewellery with coupon codes below.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-gold/40 text-center">
            <span className="text-[11px] uppercase tracking-wider text-gold font-bold block mb-2">
              Sale Ends In:
            </span>
            <div className="flex gap-3 text-gold font-serif font-bold text-xl sm:text-2xl">
              <div className="bg-maroon-900 px-3 py-2 rounded-lg border border-gold/30">
                {String(timeLeft.hours).padStart(2, '0')}<span className="block text-[9px] font-sans font-normal text-white/70">HRS</span>
              </div>
              <div className="bg-maroon-900 px-3 py-2 rounded-lg border border-gold/30">
                {String(timeLeft.minutes).padStart(2, '0')}<span className="block text-[9px] font-sans font-normal text-white/70">MIN</span>
              </div>
              <div className="bg-maroon-900 px-3 py-2 rounded-lg border border-gold/30">
                {String(timeLeft.seconds).padStart(2, '0')}<span className="block text-[9px] font-sans font-normal text-white/70">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── First Customer Welcome Banner ─────────────────────── */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-gold shadow-luxury">
          <div className="absolute inset-0 bg-gradient-to-r from-maroon via-maroon-900 to-maroon-950 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-3xl shrink-0">
                🎁
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-1">
                  ✨ First Order Exclusive
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Welcome Gift — 10% OFF
                </h2>
                <p className="text-white/70 text-sm mt-1 max-w-md">
                  New to Charmika? Use code <strong className="text-gold">WELCOME10</strong> on your very first order and enjoy 10% off — no minimum spend required!
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="px-6 py-3 rounded-xl border-2 border-dashed border-gold bg-white/5 text-center">
                <span className="text-[11px] text-white/60 uppercase tracking-wider block mb-0.5">Your Coupon Code</span>
                <span className="font-mono font-bold text-2xl text-gold tracking-widest">WELCOME10</span>
              </div>
              <button
                onClick={() => copyCoupon('WELCOME10')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold text-maroon font-bold text-sm rounded-full hover:bg-white transition-colors"
              >
                {copiedCode === 'WELCOME10' ? (
                  <><Check className="w-4 h-4" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy Code</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        <h2 className="font-serif text-2xl font-bold text-maroon mb-6">All Promo Coupons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {MOCK_COUPONS.map((c) => (
            <div
              key={c.code}
              className="bg-white p-6 rounded-2xl border-2 border-dashed border-gold/40 shadow-xs flex justify-between items-center"
            >
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-wider block">
                  {c.discountType === 'percentage' ? `${c.amount}% OFF` : `FLAT ₹${c.amount} OFF`}
                </span>
                <span className="font-serif text-xl font-bold text-maroon block mt-0.5">
                  {c.code}
                </span>
                <span className="text-[10px] text-charcoal/60 block mt-1">
                  Min spend: ₹{c.minSpend?.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => copyCoupon(c.code)}
                className="px-4 py-2 bg-maroon text-white text-xs font-bold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center gap-1.5"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Sale Products Grid */}
        <h2 className="font-serif text-2xl font-bold text-maroon mb-6">Promotional Sale Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {saleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
