'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, false);
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="py-20 bg-beige min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-4 border border-gold/30">
          <Heart className="w-10 h-10 text-gold" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-maroon">Your Wishlist Is Empty</h1>
        <p className="text-xs text-charcoal/60 mt-2 max-w-sm leading-relaxed">
          Save your favorite Temple Nakshi haarams, AD chokers, or rental bridal sets to review and book later.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-maroon text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-maroon transition-all shadow-luxury"
        >
          Explore Jewellery Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gold/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold block mb-1">
              Personalized Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">My Saved Wishlist</h1>
            <p className="text-xs text-charcoal/60 mt-1">{wishlist.length} luxury items saved for later</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="px-4 py-2.5 bg-maroon text-white text-xs font-bold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Move All to Cart
            </button>

            <button
              onClick={clearWishlist}
              className="px-4 py-2.5 bg-white text-charcoal/70 border border-gold/30 hover:border-red-500 hover:text-red-600 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Wishlist
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gold/20 shadow-xs hover:shadow-luxury transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-beige/40 overflow-hidden">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-maroon text-gold rounded-full shadow-md hover:scale-110 transition-transform"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-4 h-4 fill-gold" />
                </button>

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-gold/90 text-maroon-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                    {product.jewelleryType}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-base font-bold text-maroon hover:text-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-charcoal/60 line-clamp-2 mt-1 font-light">
                    {product.shortDescription}
                  </p>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="font-serif font-bold text-lg text-maroon">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.regularPrice > product.price && (
                        <span className="text-xs text-charcoal/40 line-through ml-2">
                          ₹{product.regularPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gold/15">
                  <button
                    onClick={() => addToCart(product, false)}
                    className="py-2.5 bg-maroon hover:bg-gold hover:text-maroon text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="py-2.5 border border-gold/30 hover:border-red-500 hover:text-red-600 text-charcoal/70 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
