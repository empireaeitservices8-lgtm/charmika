'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, Star, Sparkles, ShoppingBag, Clock, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useQuickView } from '@/context/QuickViewContext';

interface RentalProductCardProps {
  product: Product;
}

export const RentalProductCard: React.FC<RentalProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const isWishlisted = isInWishlist(product.id);

  const rentalPrice = product.rentalPricePerDay || Math.round(product.price * 0.05) || 500;
  const deposit = product.securityDeposit || Math.round(product.price * 0.3) || 1500;

  const whatsappRentalUrl = `https://wa.me/919400976257?text=${encodeURIComponent(
    `Hello Charmika By Lekshmi, I would like to book "${product.name}" for rental (₹${rentalPrice}/day). Please share available dates and rental details.`
  )}`;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-beige/40">
        <img
          src={product.images[0]?.src || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.stockStatus === 'outofstock' ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Out of Stock
            </span>
          ) : (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Available for Rent
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold text-maroon text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
          {/* Rental Badge */}
          <span className="bg-maroon-950 text-gold text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 border border-gold/40">
            <Clock className="w-2.5 h-2.5" /> For Rent
          </span>
        </div>

        {/* Wishlist + Quick View */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isWishlisted ? 'bg-maroon text-gold' : 'bg-white/90 text-charcoal hover:bg-gold hover:text-maroon'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-gold' : ''}`} />
          </button>
          <button
            onClick={() => openQuickView(product)}
            className="p-2 bg-white/90 text-charcoal hover:bg-gold hover:text-maroon rounded-full backdrop-blur-md transition-all shadow-md"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Hover slide-up: Rent on WhatsApp */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <a
            href={whatsappRentalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md text-center uppercase tracking-wider"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Rent on WhatsApp
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Multi-Category Tags */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {(product.categories && product.categories.length > 0
              ? product.categories
              : [{ id: 0, name: product.category, slug: product.categorySlug }]
            )
              .filter((c) => c.slug !== 'uncategorized')
              .slice(0, 3)
              .map((c) => (
                <span
                  key={c.slug}
                  className="text-[9px] font-semibold text-gold-700 bg-gold/10 px-1.5 py-0.5 rounded border border-gold/20"
                >
                  {c.name}
                </span>
              ))}
          </div>

          <Link href={`/product/${product.slug}`} className="before:absolute before:inset-0 before:z-[5]" aria-label={`View ${product.name}`}>
            <h3 className="font-serif text-sm font-semibold text-maroon hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-charcoal/60 line-clamp-1 mt-0.5 font-light">
            {product.shortDescription}
          </p>

          {/* Rental price info */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-charcoal/60 bg-gold/5 border border-gold/15 rounded-lg px-2.5 py-1.5">
            <Clock className="w-3 h-3 text-gold shrink-0" />
            <span>
              <strong className="text-maroon">₹{rentalPrice}/day</strong>
              {' '}· Deposit ₹{deposit.toLocaleString('en-IN')} (refundable)
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gold/10">
          {/* Rental Fee info (Online buying disabled) */}
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-base text-maroon">
                ₹{rentalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                / day rent
              </span>
            </div>
            <span className="text-[10px] text-charcoal/50">WhatsApp Booking</span>
          </div>

          {/* Action button - Rent on WhatsApp */}
          <div className="relative z-10">
            <a
              href={whatsappRentalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-center shadow-xs tracking-wider uppercase"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Rent on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
