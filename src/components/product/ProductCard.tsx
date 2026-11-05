'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Clock, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useQuickView } from '@/context/QuickViewContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useQuickView();

  const isWishlisted = isInWishlist(product.id);

  const isRental =
    product.isRentalAvailable ||
    product.categorySlug?.toLowerCase().includes('rental') ||
    product.categorySlugs?.some((s) => s.toLowerCase().includes('rental') || s.toLowerCase() === 'rent') ||
    product.categories?.some((c) => c.slug.toLowerCase().includes('rental') || c.name.toLowerCase().includes('rental') || c.slug.toLowerCase() === 'rent');

  const whatsappRentalUrl = `https://wa.me/919400976257?text=${encodeURIComponent(
    `Hello CHARMIKA By Lekshmi, I want to rent "${product.name}" (SKU: ${product.sku}). Please share availability and rental procedure.`
  )}`;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-beige/40">
        <img
          src={product.images[0]?.src || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isRental && (
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Rental Only
            </span>
          )}
          {product.stockStatus === 'outofstock' ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Out of Stock
            </span>
          ) : (
            !isRental && (
              <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> In Stock
              </span>
            )
          )}
          {product.onSale && (
            <span className="bg-maroon text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold text-maroon-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
        </div>

        {/* Action Overlay Buttons */}
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

        {/* Quick Slide-up Button */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 z-10">
          {isRental ? (
            <a
              href={whatsappRentalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Rent on WhatsApp
            </a>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, false);
              }}
              className="w-full py-2 bg-maroon hover:bg-gold hover:text-maroon text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Info Container */}
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

          <p className="text-[11px] text-charcoal/60 line-clamp-1 mt-1 font-light">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gold/10">
          <div className="flex items-baseline justify-between mb-3">
            {isRental ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-base text-maroon">
                  ₹{(product.rentalPricePerDay || product.price || 500).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  / day rent
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-base text-maroon">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.regularPrice > product.price && (
                  <span className="text-xs text-charcoal/40 line-through">
                    ₹{product.regularPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: Never allow buying rental products! */}
          <div className="flex gap-2 relative z-10">
            {isRental ? (
              <a
                href={whatsappRentalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md tracking-wider uppercase"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Rent on WhatsApp
              </a>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, false);
                  }}
                  className="flex-1 py-2 bg-beige border border-gold/40 hover:bg-gold hover:border-gold text-maroon text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Add to Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, false);
                  }}
                  className="flex-1 py-2 bg-maroon hover:bg-gold hover:text-maroon text-white text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  ⚡ Buy Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
