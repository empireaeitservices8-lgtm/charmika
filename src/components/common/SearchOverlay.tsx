'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Gem, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { WooCommerceService } from '@/services/woocommerce';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const popularSearches = [
    'Temple Haaram',
    'AD Choker',
    'Bridal Combo',
    'Anti Tarnish Chain',
    'Oddiyanam',
    'Jhumkas',
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await WooCommerceService.getProducts({ search: query });
      setResults(res.slice(0, 5));
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-maroon-950/90 backdrop-blur-lg animate-fadeIn text-white">
      {/* Top Search Bar */}
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-8 flex items-center justify-between border-b border-gold/30">
        <div className="flex items-center gap-3 w-full mr-4">
          <Search className="w-6 h-6 text-gold" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search necklaces, chokers, temple jewellery, rentals..."
            autoFocus
            className="w-full bg-transparent text-xl sm:text-2xl font-serif text-white placeholder-white/40 focus:outline-none"
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* Main Results Container */}
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-8 flex-1 overflow-y-auto">
        {query.trim() === '' ? (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 bg-white/10 hover:bg-gold hover:text-maroon-950 rounded-full text-xs font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-gold">
            <Gem className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Searching Charmika Collection...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
              Products Found ({results.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/15 rounded-lg transition-colors border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0].src}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md border border-gold/30"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-white">{product.name}</h4>
                      <p className="text-xs text-white/60">{product.category}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="font-semibold text-gold text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-maroon-950 font-semibold rounded-full hover:bg-white transition-all text-xs"
              >
                View All Results for "{query}"
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            <p>No products found matching "{query}".</p>
            <p className="text-xs text-white/40 mt-1">Try searching for 'Temple', 'Haaram', or 'Choker'</p>
          </div>
        )}
      </div>
    </div>
  );
};
