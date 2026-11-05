'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Clock, ShieldCheck, ArrowRight, Star, MessageCircle } from 'lucide-react';
import { useQuickView } from '@/context/QuickViewContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView } = useQuickView();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'buy' | 'rent'>('buy');
  const [rentalDays, setRentalDays] = useState(3);

  const isRentalProduct = Boolean(
    quickViewProduct &&
      (quickViewProduct.isRentalAvailable ||
        quickViewProduct.categorySlug?.toLowerCase().includes('rental') ||
        quickViewProduct.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
        quickViewProduct.categories?.some(
          (c) => c.slug.toLowerCase().includes('rental') || c.name.toLowerCase().includes('rental') || c.slug.toLowerCase() === 'rent'
        ))
  );

  useEffect(() => {
    if (isRentalProduct) {
      setSelectedMode('rent');
    } else {
      setSelectedMode('buy');
    }
  }, [isRentalProduct, quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (isRentalProduct || selectedMode === 'rent') {
      const text = encodeURIComponent(
        `Hello CHARMIKA By Lekshmi, I want to rent "${quickViewProduct.name}" (SKU: ${quickViewProduct.sku}) for ${rentalDays} days. Please share availability and rental procedure.`
      );
      window.open(`https://wa.me/919400976257?text=${text}`, '_blank');
    } else {
      addToCart(quickViewProduct, false);
    }
    closeQuickView();
  };

  const categoriesList =
    quickViewProduct.categories && quickViewProduct.categories.length > 0
      ? quickViewProduct.categories.filter((c) => c.slug !== 'uncategorized')
      : [{ id: 0, name: quickViewProduct.category, slug: quickViewProduct.categorySlug }];

  const whatsappRentalUrl = `https://wa.me/919400976257?text=${encodeURIComponent(
    `Hello CHARMIKA By Lekshmi, I want to rent "${quickViewProduct.name}" (SKU: ${quickViewProduct.sku}) for ${rentalDays} days. Please share availability and rental procedure.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-gold/30 my-8">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-beige hover:bg-gold/20 text-maroon transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-beige/40 flex flex-col justify-between">
            <div className="aspect-square rounded-xl overflow-hidden border border-gold/20 shadow-xs mb-3 bg-white">
              <img
                src={quickViewProduct.images[selectedImgIndex]?.src || quickViewProduct.images[0].src}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImgIndex === idx ? 'border-gold scale-105 shadow-xs' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {/* Multi-category tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {categoriesList.map((c) => (
                  <span
                    key={c.slug}
                    className="text-[10px] font-semibold uppercase tracking-wider text-gold-700 bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30"
                  >
                    {c.name}
                  </span>
                ))}
                {isRentalProduct && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ⏰ Rental Only
                  </span>
                )}
              </div>

              <h2 className="font-serif text-xl font-bold text-maroon">{quickViewProduct.name}</h2>

              {/* Pricing Section */}
              <div className="mt-4 p-4 bg-beige/60 rounded-xl border border-gold/20">
                {!isRentalProduct ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-2xl text-maroon">
                        ₹{quickViewProduct.price.toLocaleString('en-IN')}
                      </span>
                      {quickViewProduct.regularPrice > quickViewProduct.price && (
                        <span className="text-xs text-charcoal/40 line-through">
                          ₹{quickViewProduct.regularPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {quickViewProduct.stockStatus === 'outofstock' ? (
                      <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Out of Stock
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock • Ready to ship
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider block">
                          Rental Fee ({rentalDays} Days)
                        </span>
                        <span className="font-serif font-bold text-2xl text-maroon">
                          ₹{((quickViewProduct.rentalPricePerDay || 500) * rentalDays).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2 py-1 rounded">
                        ₹{quickViewProduct.rentalPricePerDay || 500}/day
                      </span>
                    </div>

                    {/* Rental Duration Options */}
                    <div className="mt-2.5 pt-2 border-t border-gold/20">
                      <span className="text-[11px] text-charcoal/80 font-semibold block mb-1">
                        Select Rental Duration:
                      </span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 5, 7].map((days) => (
                          <button
                            key={days}
                            onClick={() => setRentalDays(days)}
                            className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                              rentalDays === days
                                ? 'bg-maroon text-white border-maroon'
                                : 'bg-white text-charcoal border-gold/30 hover:border-gold'
                            }`}
                          >
                            {days} {days === 1 ? 'Day' : 'Days'}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-charcoal/70 mt-2 bg-gold/10 p-2 rounded border border-gold/20">
                        🛡️ Refundable Security Deposit: ₹{(quickViewProduct.securityDeposit || 2000).toLocaleString('en-IN')}. Rental items are booked via WhatsApp.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gold/20 flex gap-3">
              {isRentalProduct ? (
                <a
                  href={whatsappRentalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-700 text-white font-bold text-xs rounded-full hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-md text-center uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" />
                  Rent on WhatsApp ({rentalDays} Days)
                </a>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-maroon text-white font-bold text-xs rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Shopping Cart
                </button>
              )}

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 rounded-full border transition-all ${
                  isWishlisted ? 'border-maroon bg-maroon text-gold' : 'border-gold/40 text-charcoal hover:bg-gold/10'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-gold' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
